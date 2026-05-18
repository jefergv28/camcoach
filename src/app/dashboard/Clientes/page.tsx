"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/TablePagination";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Cookies from "js-cookie"; // 🎯 Recuperación de sesión segura

type ClienteFormData = {
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  plataformaPrincipal: string;
  estado: "activa" | "pausada";
  ingresosMes: number;
};

type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  plataformaPrincipal: string;
  estado: "activa" | "pausada";
  ingresosMes: number;
  fechaUnion: string;
};

type ClienteAPI = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  whatsapp?: string;
  plataforma_principal: string;
  estado: "activa" | "pausada";
  ingresos_mes: number;
  fecha_union: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 1: Forzamos la barra inclinada al final para emparejar con el 307 que vimos en los logs
const API_BASE = `${BASE_URL}/clientes/`;

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(
    undefined,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cargar clientes con cabeceras Bearer blindadas
  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");

        // 🎯 ESCUDO: Detener petición si el token no se ha cargado en el navegador aún
        if (!token) {
          console.log("[Clientes] Token no definido aún.");
          return;
        }

        // Al usar API_BASE directo, ya le pega a `${BASE_URL}/clientes/`
        const res = await fetch(API_BASE, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Inyección de seguridad unificada
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Sesión expirada. Inicia sesión de nuevo.");
          }
          throw new Error("Error al cargar clientes");
        }

        const data = await res.json();
        const mapped: Cliente[] = data.map((item: ClienteAPI) => ({
          id: item.id,
          nombre: item.nombre,
          email: item.email,
          telefono: item.telefono || "",
          whatsapp: item.whatsapp || "",
          plataformaPrincipal: item.plataforma_principal,
          estado: item.estado,
          ingresosMes: item.ingresos_mes,
          fechaUnion: item.fecha_union,
        }));
        setClientes(mapped);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const columns: ColumnDef<Cliente>[] = [
    { accessorKey: "nombre", header: "Cliente" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "telefono", header: "Teléfono" },
    { accessorKey: "whatsapp", header: "WhatsApp" },
    { accessorKey: "plataformaPrincipal", header: "Plataforma" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          variant={row.original.estado === "activa" ? "default" : "secondary"}
        >
          {row.original.estado === "activa" ? "Activa" : "Pausada"}
        </Badge>
      ),
    },
    {
      accessorKey: "ingresosMes",
      header: "Ingresos mes",
      cell: ({ row }) => `$${row.getValue("ingresosMes")?.toLocaleString()}`,
    },
    {
      accessorKey: "fechaUnion",
      header: "Desde",
      cell: ({ row }) =>
        new Date(row.getValue("fechaUnion")).toLocaleDateString(),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingCliente(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto eliminará permanentemente a{" "}
                  <strong>{row.original.nombre}</strong>. Esta acción no se
                  puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      const token = Cookies.get("token");
                      // 🎯 CORRECCIÓN 2: Al terminar API_BASE en "/", la ruta dinámica queda limpia como /clientes/id
                      const res = await fetch(`${API_BASE}${row.original.id}`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                          "Authorization": `Bearer ${token}`,
                        },
                      });

                      if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.detail || "Error al eliminar");
                      }

                      setClientes(
                        clientes.filter((c) => c.id !== row.original.id),
                      );
                      toast.success("Cliente eliminado correctamente");
                    } catch (err: unknown) {
                      if (err instanceof Error) {
                        toast.error(err.message || "No se pudo eliminar al cliente");
                      }
                    }
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: clientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSaveCliente = async (formData: ClienteFormData) => {
    try {
      const token = Cookies.get("token");
      const isEdit = !!editingCliente;

      // 🎯 CORRECCIÓN 3: Construcción de endpoints basándonos en la barra final de API_BASE
      // Editar -> /clientes/id  |  Crear -> /clientes/ (removiendo el último slash si el backend prefiere exactitud, pero al dejarlo así entra directo sin 307)
      const url = isEdit ? `${API_BASE}${editingCliente.id}` : `${API_BASE}`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        whatsapp: formData.whatsapp,
        plataforma_principal: formData.plataformaPrincipal,
        estado: formData.estado,
        ingresos_mes: Number(formData.ingresosMes) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Error al guardar cliente");
      }

      const saved = await res.json();

      const mappedSaved = {
        id: saved.id,
        nombre: saved.nombre,
        email: saved.email,
        telefono: saved.telefono || "",
        whatsapp: saved.whatsapp || "",
        plataformaPrincipal: saved.plataforma_principal,
        estado: saved.estado,
        ingresosMes: saved.ingresos_mes,
        fechaUnion: saved.fecha_union,
      };

      if (isEdit) {
        setClientes(
          clientes.map((c) => (c.id === mappedSaved.id ? mappedSaved : c)),
        );
        toast.success("Cliente actualizado con éxito");
      } else {
        setClientes([...clientes, mappedSaved]);
        toast.success("Cliente creado correctamente");
      }

      setIsDialogOpen(false);
      setEditingCliente(undefined);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error al guardar cliente");
      }
    }
  };

  return (
    <div className="space-y-4">
      {loading && <div className="text-center py-10 text-slate-500 animate-pulse font-medium">Cargando clientes reales... 👥</div>}
      {error && <div className="text-red-500 text-center py-10 text-xs bg-red-50 rounded-xl border border-red-100">{error}</div>}
      {!loading && !error && clientes.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No hay clientes aún</div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <ClienteForm
              cliente={editingCliente}
              onSave={handleSaveCliente}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCliente(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!loading && !error && clientes.length > 0 && (
        <div className="rounded-lg border border-border/40 overflow-hidden bg-primary-foreground">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/20">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-foreground">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/20 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DataTablePagination table={table} />
    </div>
  );
};

const ClienteForm = ({
  cliente,
  onSave,
  onCancel,
}: {
  cliente?: Cliente;
  onSave: (data: ClienteFormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(
    cliente || {
      nombre: "",
      email: "",
      telefono: "",
      whatsapp: "",
      plataformaPrincipal: "",
      estado: "activa" as "activa" | "pausada",
      ingresosMes: 0,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre</Label>
        <Input
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label>Teléfono</Label>
        <Input
          value={formData.telefono}
          onChange={(e) =>
            setFormData({ ...formData, telefono: e.target.value })
          }
        />
      </div>
      <div>
        <Label>WhatsApp</Label>
        <Input
          value={formData.whatsapp}
          onChange={(e) =>
            setFormData({ ...formData, whatsapp: e.target.value })
          }
        />
      </div>
      <div>
        <Label>Plataforma Principal</Label>
        <Input
          value={formData.plataformaPrincipal}
          onChange={(e) =>
            setFormData({ ...formData, plataformaPrincipal: e.target.value })
          }
        />
      </div>
      <div>
        <Label>Estado</Label>
        <Select
          value={formData.estado}
          onValueChange={(v: "activa" | "pausada") =>
            setFormData({ ...formData, estado: v })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activa">Activa</SelectItem>
            <SelectItem value="pausada">Pausada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {cliente ? "Guardar" : "Crear"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ClientesPage;