"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Edit3, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Evento = {
  id: number;
  fecha: string;
  hora?: string;
  titulo: string;
  cliente: string;
  descripcion?: string;
  miRecordatorio: boolean;
  notificarCliente: boolean;
  tipoNotifCliente?: "whatsapp" | "email" | "sms";
};

type Cliente = {
  id?: number;
  nombre: string;
  telefono?: string;
  email?: string;
};

const API_URL = "http://localhost:8000/eventos/";

const CalendarioPage = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(
    new Date(),
  );
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);

  // Cargar eventos y clientes
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEventos = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });
        if (resEventos.ok) setEventos(await resEventos.json());

        const resClientes = await fetch("http://localhost:8000/clientes/", {
          method: "GET",
          credentials: "include",
        });
        if (resClientes.ok) setClientes(await resClientes.json());
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      }
    };
    cargarDatos();
  }, []);

  const eventosDelDia = eventos.filter(
    (e) => e.fecha === fechaSeleccionada?.toISOString().split("T")[0],
  );

  const proximosEventos = [...eventos]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .filter(
      (e) => new Date(e.fecha) >= new Date(new Date().setHours(0, 0, 0, 0)),
    )
    .slice(0, 6);

  const handleSaveEvento = async (
    titulo: string,
    clienteNombre: string,
    descripcion?: string,
    hora?: string,
    miRecordatorio = false,
    notificarCliente = false,
    tipoNotifCliente?: "whatsapp" | "email" | "sms",
  ) => {
    if (!fechaSeleccionada || !titulo || !clienteNombre) return;

    const datosEvento = {
      titulo,
      fecha: fechaSeleccionada.toISOString().split("T")[0],
      hora,
      cliente: clienteNombre,
      descripcion,
      miRecordatorio,
      notificarCliente,
      tipoNotifCliente,
    };

    try {
      const url =
        editMode && eventoEditando ? `${API_URL}${eventoEditando.id}` : API_URL;
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEvento),
        credentials: "include",
      });

      if (response.ok) {
        const eventoServidor = await response.json();
        setEventos(
          editMode
            ? eventos.map((e) =>
                e.id === eventoServidor.id ? eventoServidor : e,
              )
            : [eventoServidor, ...eventos],
        );
        setDialogOpen(false);
        setEditMode(false);
        setEventoEditando(null);
        toast.success(editMode ? "Evento actualizado" : "Evento creado");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleDeleteEvento = async () => {
    if (!eventoAEliminar) return;
    try {
      const response = await fetch(`${API_URL}${eventoAEliminar.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setEventos(eventos.filter((e) => e.id !== eventoAEliminar.id));
        setDeleteDialogOpen(false);
        setEventoAEliminar(null);
        toast.success("Evento eliminado");
      } else {
        toast.error("No se pudo eliminar el evento ");
      }
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleEditEvento = (evento: Evento) => {
    setEventoEditando(evento);
    const [year, month, day] = evento.fecha.split("-").map(Number);
    setFechaSeleccionada(new Date(year, month - 1, day));
    setEditMode(true);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Bell className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Agenda
          </h1>
        </div>
        <Badge className="text-blue-600 dark:text-blue-200 border border-blue-200 dark:border-blue-500 bg-blue-50 dark:bg-blue-900 px-4 py-1">
          {eventos.length} Eventos
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="bg-card dark:bg-slate-800 border rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-center">
              Selecciona fecha
            </h3>
            <div className="mx-auto flex justify-center">
              <Calendar
                mode="single"
                selected={fechaSeleccionada}
                onSelect={(date) => {
                  setFechaSeleccionada(date);
                  setDialogOpen(true);
                  setEditMode(false);
                  setEventoEditando(null);
                }}
                className="w-full max-w-prose [--cell-size:80px]"
                showOutsideDays
              />
            </div>
          </div>
        </div>

        {/* Próximos eventos y eventos del día */}
        <div className="space-y-6">
          {/* Hoy */}
          <div className="bg-gray-300 dark:bg-blue-950/50 border border-orange-100 dark:border-b-blue-900 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-black dark:text-blue-50 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {fechaSeleccionada?.toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "short",
                })}
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-accent-foreground hover:bg-blue-500  dark:hover:bg-blue-900"
                onClick={() => {
                  setEditMode(false);
                  setEventoEditando(null);
                  setDialogOpen(true);
                }}
              >
                + Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {eventosDelDia.length === 0 ? (
                <p className="text-sm text-blue-400 dark:text-white italic text-center py-4">
                  No hay citas para este día
                </p>
              ) : (
                eventosDelDia.map((e) => (
                  <div
                    key={e.id}
                    className="bg-blue-200/50 dark:bg-slate-900 p-3 rounded-xl border border-b-pink-800 dark:border-b-pink-800 shadow-sm group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {e.titulo}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          👤 {e.cliente} {e.hora && `| 🕒 ${e.hora}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 hover:bg-red-100"
                          onClick={() => {
                            setEventoAEliminar(e); // <--- Aquí asignas el evento que vas a eliminar
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 hover:bg-blue-100"
                          onClick={() => handleEditEvento(e)} // <--- Aquí la usas
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Próximos eventos */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-blue-500" />
              Próximos en Agenda
            </h2>
            <div className="space-y-3">
              {proximosEventos.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-300 italic text-center py-4">
                  Agenda despejada
                </p>
              ) : (
                proximosEventos.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-400 transition-colors shadow-sm"
                  >
                    <div className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-[10px] font-bold px-2 py-1 rounded flex flex-col items-center min-w-11.25">
                      <span>
                        {new Date(e.fecha.replace(/-/g, "/"))
                          .toLocaleDateString("es-CO", { month: "short" })
                          .toUpperCase()}
                      </span>
                      <span className="text-sm">
                        {new Date(e.fecha.replace(/-/g, "/")).getDate()}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-xs truncate text-slate-700 dark:text-slate-200">
                        {e.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {e.cliente}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de Evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogTitle>{editMode ? "Editar Evento" : "Nueva Cita"}</DialogTitle>
          <EventoForm
            onSave={handleSaveEvento}
            clientes={clientes}
            eventoEditando={eventoEditando}
            editMode={editMode}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              {eventoAEliminar && (
                <>
                  Se eliminará <strong>{eventoAEliminar.titulo}</strong>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteEvento}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarioPage;

type EventoFormProps = {
  onSave: (
    titulo: string,

    cliente: string,

    descripcion?: string,

    hora?: string,

    miRecordatorio?: boolean,

    notificarCliente?: boolean,

    tipoNotifCliente?: "whatsapp" | "email" | "sms",
  ) => void;

  clientes: {
    id?: number;

    nombre: string;

    telefono?: string;

    email?: string;
  }[];

  eventoEditando: Evento | null;

  editMode: boolean;
};

const EventoForm = ({
  onSave,

  clientes,

  eventoEditando,

  editMode,
}: EventoFormProps) => {
  const [titulo, setTitulo] = useState(eventoEditando?.titulo || "");

  const [cliente, setCliente] = useState(eventoEditando?.cliente || "");

  const [descripcion, setDescripcion] = useState(
    eventoEditando?.descripcion || "",
  );

  const [hora, setHora] = useState(eventoEditando?.hora || "");

  const [miRecordatorio, setMiRecordatorio] = useState(
    eventoEditando?.miRecordatorio || false,
  );

  const [notificarCliente, setNotificarCliente] = useState(
    eventoEditando?.notificarCliente || false,
  );

  const [tipoNotifCliente, setTipoNotifCliente] = useState<
    "whatsapp" | "email" | "sms" | undefined
  >(eventoEditando?.tipoNotifCliente);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado", { titulo, cliente, descripcion, hora });
    onSave(
      titulo,

      cliente,

      descripcion,

      hora,

      miRecordatorio,

      notificarCliente,

      tipoNotifCliente,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        className="w-full border rounded p-2"
        placeholder="Título del evento"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <select
        className="w-full border rounded p-2 bg-background"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        required
      >
        <option value="" disabled>
          Seleccionar cliente
        </option>

        {clientes.map((c, index) => (
          <option key={c.id || index} value={c.nombre}>
            {c.nombre}
          </option>
        ))}
      </select>

      <input
        type="time"
        className="w-full border rounded p-2"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={miRecordatorio}
          onChange={(e) => setMiRecordatorio(e.target.checked)}
        />
        Recordatorio para mí
      </label>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={notificarCliente}
          onChange={(e) => setNotificarCliente(e.target.checked)}
        />
        Notificar cliente
      </label>

      {notificarCliente && (
        <select
          className="w-full border rounded p-2 bg-background"
          value={tipoNotifCliente || ""}
          onChange={(e) =>
            setTipoNotifCliente(e.target.value as "whatsapp" | "email" | "sms")
          }
        >
          <option value="" disabled>
            Tipo de notificación
          </option>

          <option value="whatsapp">WhatsApp</option>

          <option value="email">Email</option>

          <option value="sms">SMS</option>
        </select>
      )}

      <Button type="submit" className="w-full">
        {editMode ? "Actualizar Evento" : "Crear Evento"}
      </Button>
    </form>
  );
};
