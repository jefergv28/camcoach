"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN PARA EL TOKEN
import { toast } from "sonner";

// Tipos para TypeScript
type ResumenCliente = {
  id: number;
  nombre: string;
  ingresos: number;
  eventos: number;
  retencion: number;
};

type ReporteData = {
  ingresos_totales: number;
  eventos_totales: number;
  tareas_completadas: number;
  retencion_promedio: number;
  clientes: ResumenCliente[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 1: Ruta correcta a Reportes
const API_BASE = `${BASE_URL}/reportes`;

const ReportesPage = () => {
  const [clienteFiltro, setClienteFiltro] = useState("todos");
  const [periodo, setPeriodo] = useState("mes");
  const [isMounted, setIsMounted] = useState(false); // 🎯 Escudo de hidratación

  // Estado inicial vacío esperando al backend
  const [reporteData, setReporteData] = useState<ReporteData>({
    ingresos_totales: 0,
    eventos_totales: 0,
    tareas_completadas: 0,
    retencion_promedio: 0,
    clientes: [],
  });

  // Fetch a la API de FastAPI
  useEffect(() => {
    setIsMounted(true);
    const cargarReporte = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        // 🎯 CORRECCIÓN 2: Inyección segura del token
        const response = await fetch(`${API_BASE}/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          // 🎯 Blindaje extra: Solo actualizamos si realmente llegaron clientes
          if (data && Array.isArray(data.clientes)) {
            setReporteData(data);
          }
        } else {
          toast.error("Error al obtener las métricas");
        }
      } catch (error) {
        console.error("Error al cargar los reportes:", error);
      }
    };
    cargarReporte();
  }, [periodo]); // Recarga si cambia el periodo

  // Filtrado dinámico seguro
  const clientesFiltrados = useMemo(() => {
    const clientesSeguros = reporteData?.clientes || [];
    if (clienteFiltro === "todos") return clientesSeguros;
    return clientesSeguros.filter(
      (c) => c.id.toString() === clienteFiltro,
    );
  }, [clienteFiltro, reporteData?.clientes]);

  // KPIs dinámicos seguros
  const kpis = useMemo(() => {
    if (clienteFiltro === "todos") {
      return {
        ingresos: reporteData?.ingresos_totales || 0,
        eventos: reporteData?.eventos_totales || 0,
        tareasCompletadas: reporteData?.tareas_completadas || 0,
        retencion: reporteData?.retencion_promedio || 0,
      };
    }

    const ingresos = clientesFiltrados.reduce((acc, c) => acc + (c.ingresos || 0), 0);
    const eventos = clientesFiltrados.reduce((acc, c) => acc + (c.eventos || 0), 0);
    const retencion =
      clientesFiltrados.length > 0
        ? Math.round(
            clientesFiltrados.reduce((acc, c) => acc + (c.retencion || 0), 0) /
              clientesFiltrados.length,
          )
        : 0;

    return {
      ingresos,
      eventos,
      tareasCompletadas: reporteData?.tareas_completadas || 0,
      retencion,
    };
  }, [clientesFiltrados, reporteData, clienteFiltro]);

  // Exportar PDF profesional protegido
  const generarPDF = () => {
    if (!clientesFiltrados || clientesFiltrados.length === 0) {
      toast.warning("No hay datos para exportar");
      return;
    }

    const contenido = `
      <html>
      <head>
        <title>Reporte CamCoach</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Reporte CamCoach</h1>
        <p><strong>Periodo:</strong> ${periodo.toUpperCase()}</p>
        <p><strong>Ingresos Totales:</strong> $${kpis.ingresos.toLocaleString("es-CO")}</p>
        <p><strong>Eventos:</strong> ${kpis.eventos}</p>
        <p><strong>Retención Promedio:</strong> ${kpis.retencion}%</p>

        <h2>Resumen Clientes</h2>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Ingresos</th>
              <th>Eventos</th>
              <th>Retención</th>
            </tr>
          </thead>
          <tbody>
            ${clientesFiltrados
              .map(
                (c) => `
              <tr>
                <td>${c.nombre}</td>
                <td>$${Number(c.ingresos).toLocaleString("es-CO")}</td>
                <td>${c.eventos}</td>
                <td>${c.retencion}%</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const nuevaPestana = window.open("", "_blank");
    nuevaPestana?.document.write(contenido);
    nuevaPestana?.document.close();
    setTimeout(() => {
      nuevaPestana?.print();
    }, 500);
  };

  // 🎯 Retorno de seguridad del escudo de hidratación
  if (!isMounted) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse font-medium">
        Cargando tableros de métricas... 📊
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Visualización consolidada para análisis y toma de decisiones.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Filtro Dinámico de Clientes */}
          <Select value={clienteFiltro} onValueChange={setClienteFiltro}>
            <SelectTrigger className="w-45 bg-background">
              <SelectValue placeholder="Todos clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {/* 🎯 CORRECCIÓN 3: ? opcional para que NUNCA colapse si viene vacío */}
              {reporteData?.clientes?.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-35 bg-background">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="anio">Año</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={generarPDF}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            📊 Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${kpis.ingresos.toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.eventos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {kpis.tareasCompletadas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retención Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {kpis.retencion}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">
            Ingresos por Período
          </h3>
          <AppBarChart chartData={[]} />
        </div>

        <div className="bg-card border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">
            Distribución Clientes
          </h3>
          <AppPieChart />
        </div>

        <div className="bg-card border p-4 rounded-lg lg:col-span-2 shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">
            Evolución Rendimiento
          </h3>
          <AppAreaChart />
        </div>
      </div>

      {/* Tabla */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Resumen Clientes</CardTitle>
          <CardDescription>
            Información consolidada por cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Retención</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 🎯 CORRECCIÓN 4: ? opcional garantizando mapeo seguro */}
              {!clientesFiltrados || clientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No hay datos disponibles para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                clientesFiltrados.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nombre}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${Number(c.ingresos).toLocaleString("es-CO")}
                    </TableCell>
                    <TableCell>{c.eventos}</TableCell>
                    <TableCell>
                      <Badge
                        variant={c.retencion > 85 ? "default" : "secondary"}
                      >
                        {c.retencion}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesPage;