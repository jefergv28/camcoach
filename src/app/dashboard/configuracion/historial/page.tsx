"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { toast } from "sonner";

// URL de tu nuevo endpoint en el backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE = `${BASE_URL}/ingresos`;

type Actividad = {
  id: string | number;
  usuario: string;
  accion: string;
  tipo: "login" | "creacion" | "edicion" | "eliminacion" | "notificacion";
  fecha: string;
  ip: string;
  detalles: string;
};

export default function HistorialPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [loading, setLoading] = useState(true);

  // 1. CONSUMIR LA API REAL
  const cargarHistorial = async () => {
    try {
      const response = await fetch(API_BASE , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Tu carnet de acceso
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setActividades(data);
      } else {
        toast.error("No se pudo cargar el historial de actividades");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const actividadesFiltradas =
    filtroTipo === "todos"
      ? actividades
      : actividades.filter((a) => a.tipo === filtroTipo);

  // Determinamos el color del punto en la línea de tiempo según el tipo
  const getDotColor = (tipo: string) => {
    switch (tipo) {
      case "login":
        return "bg-blue-500";
      case "creacion":
        return "bg-green-500";
      case "eliminacion":
        return "bg-red-500";
      case "edicion":
        return "bg-orange-500";
      case "notificacion":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading)
    return <div className="p-6">Cargando historial del sistema...</div>;

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Historial de Actividad</h1>
          <p className="text-muted-foreground">
            Últimas acciones en CamCoach ({actividades.length} total).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recientes</CardTitle>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="login">Inicios Sesión</SelectItem>
              <SelectItem value="creacion">Creaciones</SelectItem>
              <SelectItem value="edicion">Ediciones</SelectItem>
              <SelectItem value="eliminacion">Eliminaciones</SelectItem>
              <SelectItem value="notificacion">Notificaciones</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-150 rounded-md border p-4">
            <Timeline>
              {actividadesFiltradas.map((actividad) => (
                <TimelineItem key={actividad.id}>
                  <TimelineOppositeContent className="flex w-32 flex-col text-right text-sm">
                    {/* Mostramos solo la fecha/hora legible */}
                    {new Date(actividad.fecha).toLocaleString("es-CO", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <Badge
                      variant="outline"
                      className="mt-1 w-max ml-auto capitalize"
                    >
                      {actividad.tipo}
                    </Badge>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot className={getDotColor(actividad.tipo)} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                              {actividad.usuario.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{actividad.usuario}</p>
                            <p className="text-sm text-muted-foreground">
                              {actividad.accion}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                          <span>IP: {actividad.ip || "127.0.0.1"}</span>
                          <span>{actividad.detalles}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            {actividadesFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay actividades registradas con este filtro.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
