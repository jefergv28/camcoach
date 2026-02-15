"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  User,
  Clock,
  MessageCircle,
  Mail,
  Edit3,
  Trash2,
  X,
  Phone,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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

type Evento = {
  id: string;
  fecha: string;
  hora?: string;
  titulo: string;
  cliente: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  miRecordatorio: boolean;
  notificarCliente: boolean;
  tipoNotifCliente?: "whatsapp" | "email" | "sms";
};

const CalendarioPage = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<
    Date | undefined
  >();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);

  const clientesData = [
    {
      nombre: "Luna Star",
      telefono: "+573001234567",
      email: "luna@example.com",
    },
    {
      nombre: "Camila Fox",
      telefono: "+573009876543",
      email: "camila@example.com",
    },
    {
      nombre: "Sofía Luna",
      telefono: "+573001112223",
      email: "sofia@example.com",
    },
    {
      nombre: "Valeria Dream",
      telefono: "+573004445556",
      email: "valeria@example.com",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("eventosCalendario");
    if (saved) setEventos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("eventosCalendario", JSON.stringify(eventos));
  }, [eventos]);

  const eventosDelDia = eventos.filter(
    (e) => e.fecha === fechaSeleccionada?.toISOString().split("T")[0],
  );

  const handleSaveEvento = (
    titulo: string,
    clienteNombre: string,
    descripcion?: string,
    hora?: string,
    miRecordatorio = false,
    notificarCliente = false,
    tipoNotifCliente?: "whatsapp" | "email" | "sms",
  ) => {
    if (!fechaSeleccionada || !titulo || !clienteNombre) return;

    const clienteData = clientesData.find((c) => c.nombre === clienteNombre);

    if (editMode && eventoEditando) {
      // EDITAR
      setEventos(
        eventos.map((e) =>
          e.id === eventoEditando.id
            ? {
                ...e,
                titulo,
                cliente: clienteNombre,
                telefono: clienteData?.telefono,
                email: clienteData?.email,
                descripcion,
                hora,
                miRecordatorio,
                notificarCliente,
                tipoNotifCliente,
              }
            : e,
        ),
      );
    } else {
      // NUEVO
      const nuevoEvento: Evento = {
        id: crypto.randomUUID(),
        fecha: fechaSeleccionada.toISOString().split("T")[0],
        hora,
        titulo,
        cliente: clienteNombre,
        telefono: clienteData?.telefono,
        email: clienteData?.email,
        descripcion,
        miRecordatorio,
        notificarCliente,
        tipoNotifCliente,
      };
      setEventos([nuevoEvento, ...eventos]);
    }

    setDialogOpen(false);
    setEditMode(false);
    setEventoEditando(null);
  };

  const handleEditEvento = (evento: Evento) => {
    setEventoEditando(evento);
    setFechaSeleccionada(new Date(evento.fecha));
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteEvento = () => {
    if (eventoAEliminar) {
      setEventos(eventos.filter((e) => e.id !== eventoAEliminar.id));
      setDeleteDialogOpen(false);
      setEventoAEliminar(null);
    }
  };

  const handleNotificarAhora = (evento: Evento) => {
    const clienteData = clientesData.find((c) => c.nombre === evento.cliente);
    if (!clienteData || !evento.tipoNotifCliente) return;

    if (evento.tipoNotifCliente === "whatsapp") {
      window.open(
        `https://wa.me/${clienteData.telefono?.replace("+57", "57") || ""}?text=🔔 *Recordatorio Evento*: ${evento.titulo}%0A${evento.fecha} ${evento.hora || ""}`,
      );
    } else if (evento.tipoNotifCliente === "email") {
      window.location.href = `mailto:${clienteData.email || ""}?subject=Recordatorio: ${evento.titulo}`;
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Bell className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Calendario de Eventos</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-2xl p-8 shadow-xl">
            <h3 className="text-lg font-semibold mb-6 text-center">
              Selecciona fecha
            </h3>
            <div className="mx-auto">
              <Calendar
                mode="single"
                selected={fechaSeleccionada}
                onSelect={(date) => {
                  setFechaSeleccionada(date);
                  setDialogOpen(true);
                  setEditMode(false);
                  setEventoEditando(null);
                }}
                className="w-full max-w-none [--cell-size:90px]"
                showOutsideDays
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">
              {fechaSeleccionada?.toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) || "Selecciona fecha"}
            </h2>
          </div>

          {eventosDelDia.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay eventos</p>
              <p className="text-sm">¡Agrega el primero!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto p-2 rounded-xl bg-muted/30">
              {eventosDelDia.map((e) => (
                <div
                  key={e.id}
                  className="bg-card p-4 rounded-xl border hover:shadow-md group relative"
                >
                  {/* BOTONES ACCIONES */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-background p-1 rounded-full shadow-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-0 hover:bg-blue-100"
                      onClick={() => handleEditEvento(e)}
                      title="Editar"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-0 hover:bg-red-100"
                      onClick={() => {
                        setEventoAEliminar(e);
                        setDeleteDialogOpen(true);
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="pl-12">
                    {" "}
                    {/* Padding para botones */}
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="default"
                        className="font-semibold px-3 py-1"
                      >
                        {e.titulo}
                      </Badge>
                      <div className="flex gap-1">
                        {e.miRecordatorio && (
                          <Bell className="h-4 w-4 text-yellow-500" />
                        )}
                        {e.notificarCliente &&
                          e.tipoNotifCliente === "whatsapp" && (
                            <MessageCircle
                              className="h-4 w-4 text-green-500 cursor-pointer hover:scale-110"
                              onClick={() => handleNotificarAhora(e)}
                            />
                          )}
                        {e.notificarCliente &&
                          e.tipoNotifCliente === "email" && (
                            <Mail
                              className="h-4 w-4 text-blue-500 cursor-pointer hover:scale-110"
                              onClick={() => handleNotificarAhora(e)}
                            />
                          )}
                      </div>
                    </div>
                    <div className="text-sm mb-1">
                      👤 <span className="font-medium">{e.cliente}</span>
                      {e.hora && <span> | 🕒 {e.hora}</span>}
                    </div>
                    {e.descripcion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {e.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIALOGO CREAR/EDITAR */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {editMode ? "Editar Evento" : "Nuevo Evento"}
          </DialogTitle>
          <EventoForm
            onSave={handleSaveEvento}
            clientes={clientesData}
            eventoEditando={eventoEditando}
            editMode={editMode}
          />
        </DialogContent>
      </Dialog>

      {/* CONFIRMAR BORRAR */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              {eventoAEliminar && (
                <>
                  Se eliminará "<strong>{eventoAEliminar.titulo}</strong>" de{" "}
                  {eventoAEliminar.cliente}.
                  <br />
                  Esta acción no se puede deshacer.
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

interface ClienteData {
  nombre: string;
  telefono: string;
  email: string;
}

interface EventoFormProps {
  onSave: (
    titulo: string,
    clienteNombre: string,
    descripcion?: string,
    hora?: string,
    miRecordatorio?: boolean,
    notificarCliente?: boolean,
    tipoNotifCliente?: "whatsapp" | "email" | "sms",
  ) => void;
  clientes: ClienteData[];
  eventoEditando?: Evento | null;
  editMode: boolean;
}

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
    "whatsapp" | "email" | "sms"
  >((eventoEditando?.tipoNotifCliente as any) || "whatsapp");

  const clienteSeleccionado = clientes.find((c) => c.nombre === cliente);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      titulo,
      cliente,
      descripcion || undefined,
      hora || undefined,
      miRecordatorio,
      notificarCliente,
      tipoNotifCliente,
    );
  };

  const handleCancel = () => {
    // Reset form
    setTitulo("");
    setCliente("");
    setDescripcion("");
    setHora("");
    setMiRecordatorio(false);
    setNotificarCliente(false);
    setTipoNotifCliente("whatsapp");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Título *</Label>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ej: Sesión coaching"
        />
      </div>

      <div>
        <Label>Cliente *</Label>
        <Select value={cliente} onValueChange={setCliente} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c) => (
              <SelectItem key={c.nombre} value={c.nombre}>
                {c.nombre}{" "}
                {c.telefono && (
                  <span className="text-xs text-muted-foreground ml-2">
                    📱{c.telefono.slice(-10)}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Hora</Label>
        <Input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      {/* MIS RECORDATORIOS */}
      <div className="p-3 rounded-lg border bg-muted/50">
        <label className="flex items-center space-x-2 mb-2 cursor-pointer">
          <Checkbox
            checked={miRecordatorio}
            onCheckedChange={(checked) => setMiRecordatorio(checked === true)}
          />
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">
              Mi recordatorio (notificación en mi navegador)
            </span>
          </div>
        </label>
      </div>

      {/* NOTIFICAR CLIENTE */}
      <div className="p-3 rounded-lg border bg-green-50/50 border-green-200">
        <label className="flex items-center space-x-2 mb-3 cursor-pointer">
          <Checkbox
            checked={notificarCliente}
            onCheckedChange={(checked) => {
              setNotificarCliente(!!checked);
              if (!checked) setTipoNotifCliente("whatsapp");
            }}
          />
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-800">
              📱 Notificar al cliente ahora
            </span>
          </div>
        </label>

        {notificarCliente && clienteSeleccionado && (
          <div className="space-y-2 ml-6">
            <p className="text-xs text-green-700">
              Enviará a:{" "}
              <strong>
                {clienteSeleccionado.telefono || clienteSeleccionado.email}
              </strong>
            </p>
            <Select
              value={tipoNotifCliente}
              onValueChange={(v: any) => setTipoNotifCliente(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WhatsApp (recomendado)
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="sms" disabled>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    SMS (próximamente)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {editMode ? "💾 Actualizar" : "💾 Guardar Evento"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleCancel}
        >
          {editMode ? "Cancelar" : "Cancelar"}
        </Button>
      </div>
    </form>
  );
};

export default CalendarioPage;
