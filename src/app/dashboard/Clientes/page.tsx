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

// AlertDialog para confirmación bonita
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

type ClienteFormData = {
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  plataformaPrincipal: string;
  estado: "activa" | "pausada";
  ingresosMes: number;
};

// Tipo Cliente (sin cambios)
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

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(
    undefined,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cargar clientes (sin cambios)
  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/clientes", {
          credentials: "include",
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
          alert("Error:" + err.message);
        } else {
          alert("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Columnas (sin cambios grandes, solo la eliminación usa AlertDialog)
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

          {/* Confirmación bonita con AlertDialog */}
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
                      const res = await fetch(
                        `http://localhost:8000/clientes/${row.original.id}`,
                        {
                          method: "DELETE",
                          credentials: "include",
                        },
                      );

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
                        toast.error("No se pudo eliminar al el cliente");
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
      const isEdit = !!editingCliente;
      const url = isEdit ? `/clientes/${editingCliente.id}` : "/clientes";
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

      const res = await fetch(`http://localhost:8000${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
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
        toast.success("Cliente actualizado con exito");
      } else {
        setClientes([...clientes, mappedSaved]);
        toast.success("Cliente creado correctamente");
      }

      setIsDialogOpen(false);
      setEditingCliente(undefined);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error al guardar cliente");
      }
    }
  };

  return (
    <div className="space-y-4">
      {loading && <div className="text-center py-10">Cargando clientes...</div>}
      {error && <div className="text-red-500 text-center py-10">{error}</div>}
      {!loading && !error && clientes.length === 0 && (
        <div className="text-center py-10">No hay clientes aún</div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-semibold">
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

      {/* TABLA */}
      {!loading && !error && clientes.length > 0 && (
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
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
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border/20 hover:bg-muted/50"
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

// ClienteForm (sin cambios)
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
