"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Play,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Download,
  FileText,
} from "lucide-react";

type Prioridad = "baja" | "media" | "alta";

type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "progreso" | "completado";
  cliente: string;
  fechaLimite?: string;
  prioridad: "baja" | "media" | "alta";
};

type PlanTrabajo = {
  cliente: string;
  tareas: Tarea[];
};

const clientes = ["Luna Star", "Camila Fox", "Sofía Luna", "Valeria Dream"];

const planesIniciales: PlanTrabajo[] = [
  {
    cliente: "Luna Star",
    tareas: [
      {
        id: "1",
        titulo: "Revisar métricas semana",
        descripcion: "Analizar Instagram + TikTok",
        estado: "pendiente",
        prioridad: "alta",
        fechaLimite: "2026-02-16",
        cliente: "Luna Star",
      },
      {
        id: "2",
        titulo: "Crear contenido Reel",
        descripcion: "Trend baile + caption viral",
        estado: "progreso",
        prioridad: "media",
        cliente: "Luna Star",
      },
    ],
  },
  {
    cliente: "Camila Fox",
    tareas: [
      {
        id: "3",
        titulo: "Optimizar bio",
        descripcion: "Linktree + highlights",
        estado: "pendiente",
        prioridad: "media",
        cliente: "Camila Fox",
      },
    ],
  },
];

export default function PlanesTrabajoPage() {
  const [planes, setPlanes] = useState<PlanTrabajo[]>(planesIniciales);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("Luna Star");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState<{
    titulo: string;
    descripcion: string;
    prioridad: Prioridad;
  }>({
    titulo: "",
    descripcion: "",
    prioridad: "media",
  });

  const planActual = planes.find((p) => p.cliente === clienteSeleccionado) || {
    cliente: clienteSeleccionado,
    tareas: [],
  };

  const agregarTarea = () => {
    const tarea: Tarea = {
      id: crypto.randomUUID(),
      ...nuevaTarea,
      estado: "pendiente",
      cliente: clienteSeleccionado,
    };

    setPlanes((prev) => {
      const existente = prev.find((p) => p.cliente === clienteSeleccionado);

      if (existente) {
        return prev.map((p) =>
          p.cliente === clienteSeleccionado
            ? { ...p, tareas: [tarea, ...p.tareas] }
            : p,
        );
      }

      return [...prev, { cliente: clienteSeleccionado, tareas: [tarea] }];
    });

    setNuevaTarea({ titulo: "", descripcion: "", prioridad: "media" });
    setDialogOpen(false);
  };

  const actualizarEstadoTarea = (id: string, nuevoEstado: Tarea["estado"]) => {
    setPlanes((prev) =>
      prev.map((plan) => ({
        ...plan,
        tareas: plan.tareas.map((t) =>
          t.id === id ? { ...t, estado: nuevoEstado } : t,
        ),
      })),
    );
  };

  const eliminarTarea = (id: string) => {
    setPlanes((prev) =>
      prev.map((plan) => ({
        ...plan,
        tareas: plan.tareas.filter((t) => t.id !== id),
      })),
    );
  };

  // ← GENERADOR PDF
  const generarPDF = () => {
    // Crear contenido HTML del PDF
    const contenido = `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #4facfe; padding-bottom: 20px; margin-bottom: 30px; }
            .cliente-titulo { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
            .fecha { color: #64748b; font-size: 14px; }
            .columnas { display: flex; gap: 30px; margin-top: 40px; }
            .columna { flex: 1; min-width: 280px; }
            .col-titulo { font-size: 20px; font-weight: bold; margin-bottom: 15px; padding: 10px 15px; border-radius: 8px; color: white; }
            .pendiente { background: linear-gradient(135deg, #f97316, #ea580c); }
            .progreso { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
            .completado { background: linear-gradient(135deg, #10b981, #059669); }
            .tarea { background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .tarea-titulo { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1e293b; }
            .tarea-desc { color: #64748b; margin-bottom: 12px; }
            .tarea-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
            .prioridad-alta { color: #dc2626; font-weight: 600; }
            .prioridad-media { color: #d97706; }
            .prioridad-baja { color: #059669; }
            .fecha-limite { background: #f8fafc; padding: 4px 8px; border-radius: 6px; border-left: 3px solid #3b82f6; }
            .pie { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px dashed #e2e8f0; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="cliente-titulo">📋 PLAN DE TRABAJO</div>
            <div class="cliente-titulo" style="font-size: 24px; color: #4facfe;">${planActual.cliente.toUpperCase()}</div>
            <div class="fecha">Generado el ${new Date().toLocaleDateString("es-CO")} - ${new Date().toLocaleTimeString("es-CO")}</div>
          </div>

          <div class="columnas">
            <div class="columna">
              <div class="col-titulo pendiente">⏳ PENDIENTE (${planActual.tareas.filter((t) => t.estado === "pendiente").length})</div>
              ${planActual.tareas
                .filter((t) => t.estado === "pendiente")
                .map(
                  (t) => `
                <div class="tarea">
                  <div class="tarea-titulo">${t.titulo}</div>
                  <div class="tarea-desc">${t.descripcion}</div>
                  <div class="tarea-footer">
                    <span class="prioridad-${t.prioridad}">${t.prioridad.toUpperCase()}</span>
                    ${t.fechaLimite ? `<span class="fecha-limite">📅 ${t.fechaLimite}</span>` : ""}
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="columna">
              <div class="col-titulo progreso">⚡ EN PROGRESO (${planActual.tareas.filter((t) => t.estado === "progreso").length})</div>
              ${planActual.tareas
                .filter((t) => t.estado === "progreso")
                .map(
                  (t) => `
                <div class="tarea">
                  <div class="tarea-titulo">${t.titulo}</div>
                  <div class="tarea-desc">${t.descripcion}</div>
                  <div class="tarea-footer">
                    <span class="prioridad-${t.prioridad}">${t.prioridad.toUpperCase()}</span>
                    ${t.fechaLimite ? `<span class="fecha-limite">📅 ${t.fechaLimite}</span>` : ""}
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="columna">
              <div class="col-titulo completado">✅ COMPLETADO (${planActual.tareas.filter((t) => t.estado === "completado").length})</div>
              ${planActual.tareas
                .filter((t) => t.estado === "completado")
                .map(
                  (t) => `
                <div class="tarea">
                  <div class="tarea-titulo">${t.titulo}</div>
                  <div class="tarea-desc">${t.descripcion}</div>
                  <div class="tarea-footer">
                    <span class="prioridad-${t.prioridad}">${t.prioridad.toUpperCase()}</span>
                    ${t.fechaLimite ? `<span class="fecha-limite">📅 ${t.fechaLimite}</span>` : ""}
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>

          <div class="pie">
            <div>📊 Total Tareas: ${planActual.tareas.length}</div>
            <div>Pendientes: ${planActual.tareas.filter((t) => t.estado === "pendiente").length} |
                Progreso: ${planActual.tareas.filter((t) => t.estado === "progreso").length} |
                Completadas: ${planActual.tareas.filter((t) => t.estado === "completado").length}</div>
            <div style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
              Generado por CamCoach - Plan de Trabajo ${planActual.cliente}
            </div>
          </div>
        </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([contenido], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Abrir en nueva pestaña para imprimir/guardar PDF
    const nuevaPestana = window.open("", "_blank");
    nuevaPestana?.document.write(contenido);
    nuevaPestana?.document.close();

    // Auto-imprimir
    setTimeout(() => {
      nuevaPestana?.print();
    }, 1000);
  };

  const TareaCard = ({ tarea }: { tarea: Tarea }) => {
    const getBadgeVariant = (estado: Tarea["estado"]) => {
      if (estado === "completado") return "default";
      if (estado === "progreso") return "secondary";
      return "outline";
    };

    const getIconoEstado = (estado: Tarea["estado"]) => {
      if (estado === "pendiente") return Clock;
      if (estado === "progreso") return Play;
      return CheckCircle;
    };

    const IconoEstado = getIconoEstado(tarea.estado);

    return (
      <Card className="p-4 hover:shadow-md transition-all group border-l-4 border-orange-400 hover:border-blue-500">
        <div className="flex justify-between items-start gap-3 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg leading-tight pr-2 truncate">
                {tarea.titulo}
              </h4>
              <Badge
                variant={getBadgeVariant(tarea.estado)}
                className="shrink-0"
              >
                {tarea.estado === "pendiente"
                  ? "⏳"
                  : tarea.estado === "progreso"
                    ? "⚡"
                    : "✅"}
              </Badge>
              {tarea.prioridad === "alta" && (
                <Badge variant="destructive" className="shrink-0">
                  🔥
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {tarea.descripcion}
            </p>
            {tarea.fechaLimite && (
              <div className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium inline-flex items-center gap-1">
                📅 {tarea.fechaLimite}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600"
              onClick={() => actualizarEstadoTarea(tarea.id, "progreso")}
              title="Iniciar"
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600"
              onClick={() => actualizarEstadoTarea(tarea.id, "completado")}
              title="Completar"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={() => eliminarTarea(tarea.id)}
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const columnas = [
    {
      titulo: "⏳ Pendiente",
      estado: "pendiente" as const,
      color: "border-orange-400 bg-orange-50/50",
      icono: Clock,
    },
    {
      titulo: "⚡ Progreso",
      estado: "progreso" as const,
      color: "border-blue-400 bg-blue-50/50",
      icono: Play,
    },
    {
      titulo: "✅ Completado",
      estado: "completado" as const,
      color: "border-green-400 bg-green-50/50",
      icono: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1
            className="
  text-4xl font-bold
  bg-gradient-to-r
  from-gray-900 to-gray-700
  dark:from-white dark:to-gray-400
  bg-clip-text text-transparent
"
          >
            Planes de Trabajo
          </h1>

          <p className="text-xl text-gray-600 mt-2">{clienteSeleccionado}</p>
        </div>

        <div className="flex gap-3 self-stretch">
          <Select
            value={clienteSeleccionado}
            onValueChange={setClienteSeleccionado}
          >
            <SelectTrigger className="w-64 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setDialogOpen(true)}
            className="h-12 px-8 gap-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nueva Tarea
          </Button>

          <Button
            onClick={generarPDF}
            className="h-12 px-8 gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl text-white font-semibold"
          >
            <Download className="h-5 w-5" />
            📄 PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnas.map((col) => {
          const Icono = col.icono;
          const tareas = planActual.tareas.filter(
            (t) => t.estado === col.estado,
          );

          return (
            <Card
              key={col.estado}
              className={`hover:shadow-xl transition-all ${col.color}`}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${col.estado === "pendiente" ? "bg-orange-100" : col.estado === "progreso" ? "bg-blue-100" : "bg-green-100"}`}
                  >
                    <Icono
                      className={`h-5 w-5 ${col.estado === "pendiente" ? "text-orange-600" : col.estado === "progreso" ? "text-blue-600" : "text-green-600"}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{col.titulo}</h3>
                    <div className="text-2xl font-black text-gray-900">
                      {tareas.length}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 pt-0 space-y-4 max-h-[500px] overflow-y-auto">
                {tareas.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icono className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Sin tareas</p>
                  </div>
                ) : (
                  tareas.map((t) => <TareaCard key={t.id} tarea={t} />)
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-2xl font-bold">Nueva Tarea</DialogTitle>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-lg font-semibold">Título *</Label>
              <Input
                value={nuevaTarea.titulo}
                onChange={(e) =>
                  setNuevaTarea({
                    ...nuevaTarea,
                    titulo: e.target.value,
                  })
                }
                className="mt-1 h-12 text-lg"
              />
            </div>
            <div>
              <Label className="text-lg font-semibold">Descripción</Label>
              <Input
                value={nuevaTarea.descripcion}
                onChange={(e) =>
                  setNuevaTarea({
                    ...nuevaTarea,
                    descripcion: e.target.value,
                  })
                }
                className="mt-1 h-12 text-lg"
              />
            </div>
            <div>
              <Label className="text-lg font-semibold">Prioridad</Label>
              <Select
                value={nuevaTarea.prioridad}
                onValueChange={(v: Prioridad) =>
                  setNuevaTarea({ ...nuevaTarea, prioridad: v })
                }
              >
                <SelectTrigger className="mt-1 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">
                    <div className="flex items-center gap-2">🟢 Baja</div>
                  </SelectItem>
                  <SelectItem value="media">
                    <div className="flex items-center gap-2">🟡 Media</div>
                  </SelectItem>
                  <SelectItem value="alta">
                    <div className="flex items-center gap-2">🔴 Alta</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-12 flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={agregarTarea}
              disabled={!nuevaTarea.titulo.trim()}
              className="h-12 flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl text-lg font-semibold"
            >
              💾 Crear Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
