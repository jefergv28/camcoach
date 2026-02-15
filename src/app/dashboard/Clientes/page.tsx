// app/clientes/page.tsx
"use client";

import { useState } from "react";
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

// Tipo Cliente completo
type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  plataformaPrincipal: string;
  estado: "activa" | "pausada";
  ingresosMes: number;
  fechaUnion: string;
};

// Datos iniciales (luego del backend)
const dataEjemplo: Cliente[] = [
  {
    id: "1",
    nombre: "Luna Star",
    email: "luna@gmail.com",
    telefono: "+573001234567",
    whatsapp: "+573001234567",
    plataformaPrincipal: "Plataforma A",
    estado: "activa",
    ingresosMes: 1200,
    fechaUnion: "2025-01-15",
  },
  // ... más clientes
];

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>(dataEjemplo);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(
    undefined,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Columnas con acciones
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`¿Eliminar ${row.original.nombre}?`)) {
                setClientes(clientes.filter((c) => c.id !== row.original.id));
                alert("✅ Cliente actualizado");
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

  const handleSaveCliente = (data: Cliente) => {
    if (editingCliente) {
      // EDITAR
      setClientes(clientes.map((c) => (c.id === data.id ? data : c)));
    } else {
      // CREAR NUEVO
      setClientes([
        ...clientes,
        {
          ...data,
          id: crypto.randomUUID(), // genera id automático
        },
      ]);
    }

    setIsDialogOpen(false);
    setEditingCliente(undefined);
  };

  return (
    <div className="space-y-4">
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

      <DataTablePagination table={table} />
    </div>
  );
};

// Modal formulario (nuevo componente)
const ClienteForm = ({
  cliente,
  onSave,
  onCancel,
}: {
  cliente?: Cliente;
  onSave: (data: Cliente) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(
    cliente || {
      id: "",
      nombre: "",
      email: "",
      telefono: "",
      whatsapp: "",
      plataformaPrincipal: "",
      estado: "activa" as "activa" | "pausada",
      ingresosMes: 0,
      fechaUnion: "",
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
          onValueChange={(v) => setFormData({ ...formData, estado: v as any })}
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
