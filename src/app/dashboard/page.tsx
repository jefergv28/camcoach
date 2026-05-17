"use client";

import React, { useState, useEffect } from "react";
import AppAreaChart, { AreaChartItem } from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";

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
export default function Homepage() {
  // Estados para almacenar la información real de cada router
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [reportes, setReportes] = useState<Reportes | null>(null);
  const [clientesTop, setClientesTop] = useState<Cliente[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarDashboardReal = async () => {
      try {
        // 🚀 PETICIÓN EN PARALELO: Apuntamos directo a los prefijos de tu main.py
        // Ajusta los sufijos (/resumen, /pendientes) según los nombres exactos de tus funciones @router.get
        const [resIngresos, resTareas, resReportes, resClientes] =
          await Promise.all([
            fetch("http://localhost:8000/ingresos/", {
              method: "GET",
              credentials: "include",
            }),
            fetch("http://localhost:8000/tareas/", {
              method: "GET",
              credentials: "include",
            }),
            fetch("http://localhost:8000/reportes/", {
              method: "GET",
              credentials: "include",
            }),
            fetch("http://localhost:8000/clientes/", {
              method: "GET",
              credentials: "include",
            }),
          ]);

        // Validamos que ninguno de tus controladores haya fallado
        if (
          !resIngresos.ok ||
          !resTareas.ok ||
          !resReportes.ok ||
          !resClientes.ok
        ) {
          throw new Error("Error en alguna de las rutas del backend");
        }

        // Parseamos las respuestas reales de la base de datos
        const dataIngresos = await resIngresos.json();
        const dataTareas = await resTareas.json();
        const dataReportes = await resReportes.json();
        const dataClientes = await resClientes.json();

        // Guardamos los datos en sus respectivos estados
        setIngresos(dataIngresos);
        setTareas(dataTareas);
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

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-100 text-slate-500 animate-pulse font-medium text-sm">
        Cargando métricas reales desde PostgreSQL... 📊
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
            //1 convertimos la fecha dde DB a formato corto mes
            const nombreMes = ing.fecha
              ? new Date(ing.fecha).toLocaleDateString("es-ES", {
                  month: "short",
                })
              : "S/M";

            return {
              //Nombre del mes para el eje  X del grafico
              month: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),

              // mapeamos el monto para el eje X del grafico
              clientesTop: Number(ing.monto) || 0,

              //propiedad obligatoria que pide el componente
              restoClientes: 0,
            };
          })}
        />
      </div>

      {/* 💵 Últimos ingresos registrados */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Últimos ingresos" items={ingresos.slice(0, 5)} />
      </div>

      {/* 🍕 Distribución por plataforma o modelo */}
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
        <TodoList initialTodos={tareas} />
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
