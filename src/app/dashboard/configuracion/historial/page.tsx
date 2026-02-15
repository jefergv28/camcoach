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
import {
  User,
  CalendarIcon,
  Activity,
  Mail,
  Phone,
  FileText,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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

type Actividad = {
  id: string;
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

  useEffect(() => {
    // Mock localStorage
    const data = localStorage.getItem("historialCamCoach");
    if (data) {
      try {
        const parsedData = JSON.parse(data);

        // ✅ Validar y tipar los datos correctamente
        const actividadesTipadas: Actividad[] = parsedData.map((item: any) => ({
          id: item.id,
          usuario: item.usuario,
          accion: item.accion,
          // Asegurar que el tipo sea uno de los valores permitidos
          tipo: validarTipo(item.tipo),
          fecha: item.fecha,
          ip: item.ip,
          detalles: item.detalles,
        }));

        setActividades(actividadesTipadas);
      } catch (error) {
        console.error("Error parsing data:", error);
        // Si hay error, usar datos mock
        usarDatosMock();
      }
    } else {
      usarDatosMock();
    }
  }, []);

  // Función para validar el tipo
  function validarTipo(
    tipo: string,
  ): "login" | "creacion" | "edicion" | "eliminacion" | "notificacion" {
    const tiposValidos = [
      "login",
      "creacion",
      "edicion",
      "eliminacion",
      "notificacion",
    ] as const;

    if (tiposValidos.includes(tipo as any)) {
      return tipo as
        | "login"
        | "creacion"
        | "edicion"
        | "eliminacion"
        | "notificacion";
    }

    // Valor por defecto si no es válido
    return "login";
  }

  // Función para usar datos mock
  function usarDatosMock() {
    const mock: Actividad[] = [
      {
        id: "1",
        usuario: "Nya",
        accion: "Inició sesión",
        tipo: "login",
        fecha: "2026-02-14 20:45",
        ip: "192.168.1.1",
        detalles: "Desde Huila, CO",
      },
      {
        id: "2",
        usuario: "Nya",
        accion: "Creó usuario Luna Star",
        tipo: "creacion",
        fecha: "2026-02-14 20:30",
        ip: "192.168.1.1",
        detalles: "Rol: cliente",
      },
      {
        id: "3",
        usuario: "Luna Star",
        accion: "Vio calendario",
        tipo: "edicion",
        fecha: "2026-02-14 19:15",
        ip: "200.1.2.3",
        detalles: "Evento agregado",
      },
      {
        id: "4",
        usuario: "Nya",
        accion: "Generó reporte PDF",
        tipo: "notificacion",
        fecha: "2026-02-14 18:50",
        ip: "192.168.1.1",
        detalles: "Ingresos Feb",
      },
      {
        id: "5",
        usuario: "Camila Fox",
        accion: "Completó tarea",
        tipo: "edicion",
        fecha: "2026-02-14 17:20",
        ip: "200.4.5.6",
        detalles: "Reel viral",
      },
    ];

    localStorage.setItem("historialCamCoach", JSON.stringify(mock));
    setActividades(mock);
  }

  const actividadesFiltradas =
    filtroTipo === "todos"
      ? actividades
      : actividades.filter((a) => a.tipo === filtroTipo);

  const agregarActividad = (nueva: Actividad) => {
    const actualizadas = [
      { ...nueva, id: Date.now().toString() },
      ...actividades,
    ].slice(0, 50); // Top 50
    setActividades(actualizadas);
    localStorage.setItem("historialCamCoach", JSON.stringify(actualizadas));
  };

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
            <SelectTrigger className="w-[180px]">
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
          <ScrollArea className="h-[600px] rounded-md border">
            <Timeline>
              {actividadesFiltradas.slice(0, 20).map((actividad) => (
                <TimelineItem key={actividad.id}>
                  <TimelineOppositeContent className="flex w-[150px] flex-col text-right text-sm">
                    {actividad.fecha}
                    <Badge variant="outline" className="mt-1">
                      {actividad.tipo}
                    </Badge>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot
                      className={`bg-${actividad.tipo === "login" ? "blue" : actividad.tipo === "creacion" ? "green" : "orange"}-500`}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-1">
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                                {actividad.usuario.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="font-medium">{actividad.usuario}</p>
                            <p className="text-sm text-muted-foreground">
                              {actividad.accion}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>IP: {actividad.ip}</span>
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
                <p>No hay actividades con este filtro.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-2">
          💡 <strong>Auto-log:</strong> Cada login/creación/edición se guarda
          automáticamente.
          <br /> Max 50 eventos (más viejos se borran). Filtra por tipo/fecha.
        </CardContent>
      </Card>
    </div>
  );
}
