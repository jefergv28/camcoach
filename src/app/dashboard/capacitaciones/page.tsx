"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  FileText,
  Presentation,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

type Capacitacion = {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: "video" | "presentacion" | "documento";
  url: string;
  estado: "disponible" | "proximamente";
};

const API_URL = "http://localhost:8000/capacitaciones/";

export default function CapacitacionesPage() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [capEditando, setCapEditando] = useState<Capacitacion | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "video" as Capacitacion["tipo"],
    url: "",
    estado: "disponible" as Capacitacion["estado"],
  });

  // 1. Cargar capacitaciones desde el Backend
  const cargarCapacitaciones = async () => {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCapacitaciones(data);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  // 2. Guardar (Crear o Editar)
  const handleSave = async () => {
    if (!formData.titulo) return;

    try {
      const url =
        editMode && capEditando ? `${API_URL}${capEditando.id}` : API_URL;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          editMode ? "Capacitación actualizada" : "Capacitación creada",
        );
        setDialogOpen(false);
        resetForm();
        cargarCapacitaciones();
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud");
    }
  };

  // 3. Eliminar
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta capacitación?")) return;
    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Capacitación eliminada");
        cargarCapacitaciones();
      }
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      tipo: "video",
      url: "",
      estado: "disponible",
    });
    setEditMode(false);
    setCapEditando(null);
  };

  const abrirEditar = (cap: Capacitacion) => {
    setCapEditando(cap);
    setFormData({
      titulo: cap.titulo,
      descripcion: cap.descripcion,
      tipo: cap.tipo,
      url: cap.url || "",
      estado: cap.estado,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const getIcon = (tipo: Capacitacion["tipo"]) => {
    if (tipo === "video")
      return <PlayCircle className="h-6 w-6 text-blue-500" />;
    if (tipo === "presentacion")
      return <Presentation className="h-6 w-6 text-orange-500" />;
    return <FileText className="h-6 w-6 text-emerald-500" />;
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <BookOpen className="h-10 w-10 bg-indigo-500/10 text-indigo-500 p-2.5 rounded-2xl" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Capacitaciones
            </h1>
            <p className="text-muted-foreground">
              Gestiona el material educativo para tus clientes
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" /> Nueva Capacitación
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capacitaciones.length === 0 ? (
          <div className="col-span-full text-center py-20 border-2 border-dashed rounded-3xl opacity-50">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">
              No hay capacitaciones registradas aún
            </p>
          </div>
        ) : (
          capacitaciones.map((cap) => (
            <Card
              key={cap.id}
              className="group hover:shadow-xl transition-all border-l-4 border-l-indigo-500 overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getIcon(cap.tipo)}
                    <h3 className="font-bold text-lg leading-tight">
                      {cap.titulo}
                    </h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      onClick={() => abrirEditar(cap)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(cap.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                  {cap.descripcion}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <Badge variant="secondary" className="capitalize">
                    {cap.tipo}
                  </Badge>

                  {cap.estado === "disponible" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(cap.url, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Ver recurso
                    </Button>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                      Próximamente
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* DIÁLOGO GESTIÓN */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editMode ? "Editar Capacitación" : "Nueva Capacitación"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título del Recurso *</Label>
              <Input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Ej: Marketing para Principiantes"
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción Corta</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="¿De qué trata este recurso?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Material</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, tipo: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">🎥 Video</SelectItem>
                    <SelectItem value="presentacion">
                      📊 Presentación
                    </SelectItem>
                    <SelectItem value="documento">📄 Documento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, estado: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">✅ Disponible</SelectItem>
                    <SelectItem value="proximamente">
                      ⏳ Próximamente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL del Recurso (YouTube, Drive, etc.)</Label>
              <Input
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
                disabled={formData.estado === "proximamente"}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
            >
              {editMode ? "Actualizar" : "Guardar Recurso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
