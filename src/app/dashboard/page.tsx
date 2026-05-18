"use client";

import React, { useState, useEffect } from "react";
import AppAreaChart, { AreaChartItem } from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import Cookies from "js-cookie"; // 🎯 IMPORTANTE: Para leer el token del inicio de sesión
import { Skeleton } from "@/components/ui/skeleton";

interface Ingreso {
  id: number;
  monto: number;
  fecha: string;
  descripcion?: string;
}

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

interface Reportes {
  distribucion: unknown[];
  rendimiento: unknown[];
}

interface Cliente {
  id: number;
  nombre: string;
  email?: string;
}

// 🎯 URL Base del servidor de FastAPI en Render
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Homepage() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [reportes, setReportes] = useState<Reportes | null>(null);
  const [clientesTop, setClientesTop] = useState<Cliente[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarDashboardReal = async () => {
      try {
        // 🎯 1. Recuperamos el token de seguridad desde las cookies
        const token = Cookies.get("token");

        if (!token) {
          console.log("[Dashboard] Token no definido");
          return;
        }

        // 🎯 2. Configuramos las cabeceras inyectando el Bearer Token si existe
        const headersConfig: HeadersInit = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // 🎯 3. Peticiones paralelas apuntando a las rutas REALES e individuales del backend
        const [resIngresos, resTareas, resReportes, resClientes] =
          await Promise.all([
            fetch(`${BASE_URL}/ingresos/`, {
              method: "GET",
              headers: headersConfig,
            }),
            fetch(`${BASE_URL}/tareas/`, {
              method: "GET",
              headers: headersConfig,
            }),
            fetch(`${BASE_URL}/reportes/`, {
              method: "GET",
              headers: headersConfig,
            }),
            fetch(`${BASE_URL}/clientes/`, {
              method: "GET",
              headers: headersConfig,
            }),
          ]);

        // Verificamos si el backend nos rechazó (como el 401 que te salía)
        if (
          !resIngresos.ok ||
          !resTareas.ok ||
          !resReportes.ok ||
          !resClientes.ok
        ) {
          throw new Error(
            "Error de autorización o ruta inexistente en el backend",
          );
        }

        const dataIngresos = await resIngresos.json();
        const dataTareasRaw = await resTareas.json();
        const dataReportes = await resReportes.json();
        const dataClientes = await resClientes.json();

        // 🎯 ADAPTACIÓN: Traducimos el "estado" de FastAPI a "completada" de Next.js
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tareasAdaptadas: Tarea[] = dataTareasRaw.map((t: any) => ({
          id: t.id,
          titulo: t.titulo,
          completada: t.estado === "completado" || t.estado === "completada",
        }));

        setIngresos(dataIngresos);
        setTareas(tareasAdaptadas);
        setReportes(dataReportes);
        setClientesTop(dataClientes);
      } catch (err) {
        console.error("Error conectando el Dashboard con FastAPI:", err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    cargarDashboardReal();
  }, []);

  // 🚀 FUNCIÓN PARA ACTUALIZAR EL ESTADO EN PANTALLA AL HACER CLIC
  const handleToggleTodo = (id: number) => {
    setTareas((prevTareas) =>
      prevTareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea,
      ),
    );
  };

  if (cargando) {
    return (
      <div className="space-y-6 p-6">
        {/* Cards superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>

        {/* Gráfico */}
        <Skeleton className="h-80 w-full rounded-2xl" />

        {/* Tabla */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100">
        🔴 Error de autenticación o servidor apagado. Por favor, refresca la
        sesión.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      {/* 📊 Resumen principal de ingresos por periodo */}
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart
          chartData={ingresos.map((ing) => {
            const nombreMes = ing.fecha
              ? new Date(ing.fecha).toLocaleDateString("es-ES", {
                  month: "short",
                })
              : "S/M";

            return {
              month: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
              clientesTop: Number(ing.monto) || 0,
              restoClientes: 0,
            };
          })}
        />
      </div>

      {/* 💵 Últimos ingresos registrados */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Últimos ingresos" items={ingresos.slice(0, 5)} />
      </div>

      {/* 🍕 Distribución por plataforma */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart
          chartData={
            (reportes?.distribucion as {
              plataforma: string;
              ingresos: number;
              fill?: string;
            }[]) || []
          }
        />
      </div>

      {/* ✅ Tareas pendientes del usuario logueado */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList initialTodos={tareas} onToggle={handleToggleTodo} />
      </div>

      {/* 📈 Evolución de rendimiento histórica */}
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart
          chartData={(reportes?.rendimiento as AreaChartItem[]) || []}
        />
      </div>

      {/* ⭐ Clientes destacados */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Clientes destacados" items={clientesTop} />
      </div>
    </div>
  );
}
