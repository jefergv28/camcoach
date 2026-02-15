"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
  activo: boolean;
  ultimoLogin: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    rol: "cliente" as "admin" | "cliente",
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Mock localStorage
    const data = localStorage.getItem("usuariosCamCoach");
    if (data) setUsuarios(JSON.parse(data));
    else {
      const mock: Usuario[] = [
        {
          id: "1",
          nombre: "Luna Star",
          email: "luna@camcoach.com",
          rol: "cliente",
          activo: true,
          ultimoLogin: "2026-02-14",
        },
        {
          id: "2",
          nombre: "Camila Fox",
          email: "camila@camcoach.com",
          rol: "cliente",
          activo: true,
          ultimoLogin: "2026-02-13",
        },
      ];

      localStorage.setItem("usuariosCamCoach", JSON.stringify(mock));
      setUsuarios(mock);
    }
  }, []);

  const guardarUsuarios = (nuevosUsuarios: Usuario[]) => {
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("usuariosCamCoach", JSON.stringify(nuevosUsuarios));
  };

  const crearUsuario = () => {
    const id = Date.now().toString();
    const passMock = Math.random().toString(36).slice(-8); // Pass random 8 chars
    const usuario: Usuario = {
      ...nuevoUsuario,
      id,
      activo: true,
      ultimoLogin: new Date().toISOString().split("T")[0],
    };
    guardarUsuarios([...usuarios, usuario]);
    alert(
      `¡Creado! Email: ${nuevoUsuario.email}\nPass temporal: ${passMock}\n(Cliente login: /login)`,
    );
    setNuevoUsuario({ nombre: "", email: "", rol: "cliente" });
  };

  const eliminarUsuario = (id: string) => {
    guardarUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const toggleActivo = (id: string) => {
    guardarUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
    );
  };

  const generarPass = () => {
    return Math.random().toString(36).slice(-8).toUpperCase();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Crea cuentas para clientes + control roles/permisos.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Usuario Cliente</DialogTitle>
              <DialogDescription>
                La asesora genera email/pass temporal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                type="email"
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                }
              />
              <Select
                value={nuevoUsuario.rol}
                onValueChange={(v: "admin" | "cliente") =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente (limitado)</SelectItem>
                  <SelectItem value="admin">Admin (todo acceso)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button onClick={crearUsuario}>Crear + Enviar Pass</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({usuarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          usuario.rol === "admin" ? "default" : "secondary"
                        }
                      >
                        {usuario.rol.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActivo(usuario.id)}
                      >
                        {usuario.activo ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{usuario.ultimoLogin}</TableCell>
                    <TableCell className="space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Nueva pass: ${generarPass()}`)}
                      >
                        Reset Pass
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground p-4 bg-muted/50 rounded-md">
        <strong>Roles:</strong> Cliente ve Calendario/Ingresos/Planes propios.
        Admin ve todo.
        <br />
        Pass temporal 8 chars (envía por WhatsApp). Login: /login (crear
        después).
      </div>
    </div>
  );
}
