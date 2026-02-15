"use client";

import { useMemo, useState } from "react";
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
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportesPage = () => {
  const [clienteFiltro, setClienteFiltro] = useState("todos");
  const [periodo, setPeriodo] = useState("mes");

  // Datos mock
  const clientesData = [
    { id: 1, nombre: "Luna Star", ingresos: 7500, eventos: 25, retencion: 92 },
    { id: 2, nombre: "Camila Fox", ingresos: 5000, eventos: 20, retencion: 78 },
  ];

  // Filtrado dinámico
  const clientesFiltrados = useMemo(() => {
    if (clienteFiltro === "todos") return clientesData;
    return clientesData.filter((c) =>
      c.nombre.toLowerCase().includes(clienteFiltro),
    );
  }, [clienteFiltro]);

  // KPIs dinámicos
  const kpis = useMemo(() => {
    const ingresos = clientesFiltrados.reduce((acc, c) => acc + c.ingresos, 0);
    const eventos = clientesFiltrados.reduce((acc, c) => acc + c.eventos, 0);
    const retencion =
      clientesFiltrados.length > 0
        ? Math.round(
            clientesFiltrados.reduce((acc, c) => acc + c.retencion, 0) /
              clientesFiltrados.length,
          )
        : 0;

    return {
      ingresos,
      eventos,
      tareasCompletadas: 32,
      retencion,
    };
  }, [clientesFiltrados]);

  // Exportar PDF profesional
  const generarPDF = () => {
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
        <p><strong>Ingresos Totales:</strong> $${kpis.ingresos.toLocaleString()}</p>
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
                <td>$${c.ingresos.toLocaleString()}</td>
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
    nuevaPestana?.print();
  };

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
          <Select value={clienteFiltro} onValueChange={setClienteFiltro}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="luna">Luna</SelectItem>
              <SelectItem value="camila">Camila</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="anio">Año</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={generarPDF}>📊 Exportar PDF</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${kpis.ingresos.toLocaleString()}
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
            <div className="text-2xl font-bold">{kpis.tareasCompletadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retención Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.retencion}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Ingresos por Período</h3>
          <AppBarChart />
        </div>

        <div className="bg-card border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Distribución Clientes</h3>
          <AppPieChart />
        </div>

        <div className="bg-card border p-4 rounded-lg lg:col-span-2">
          <h3 className="font-semibold mb-4">Evolución Rendimiento</h3>
          <AppAreaChart />
        </div>
      </div>

      {/* Tabla */}
      <Card>
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
              {clientesFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell>${c.ingresos.toLocaleString()}</TableCell>
                  <TableCell>{c.eventos}</TableCell>
                  <TableCell>
                    <Badge variant={c.retencion > 85 ? "default" : "secondary"}>
                      {c.retencion}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesPage;
