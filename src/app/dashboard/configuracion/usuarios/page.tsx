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
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN CLAVE

type Usuario = {
  id: number;
  username: string;
  email: string;
  rol: "admin" | "cliente";
  is_active: boolean;
  cliente_id?: number;
};

type Cliente = {
  id: number;
  nombre: string;
};

// 🎯 CORRECCIÓN 1: Variables de entorno dinámicas y rutas correctas
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_USUARIOS = `${BASE_URL}/usuarios`;
const API_CLIENTES = `${BASE_URL}/clientes/`;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [credencialesDialog, setCredencialesDialog] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 🎯 Escudo de hidratación

  const [credenciales, setCredenciales] = useState({
    id: 0,
    email: "",
    pass: "",
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    rol: "cliente" as "admin" | "cliente",
    cliente_id: "",
  });

  // 1. CARGAR DATOS
  const cargarDatos = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const headersConfig = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 🎯 CORRECCIÓN 2: Inyección del token a ambas peticiones
      const [resUsers, resClients] = await Promise.all([
        fetch(`${API_USUARIOS}/`, { headers: headersConfig, credentials: "include" }),
        fetch(API_CLIENTES, { headers: headersConfig, credentials: "include" }),
      ]);

      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsuarios(Array.isArray(dataUsers) ? dataUsers : []);
      }

      if (resClients.ok) {
        const dataClients = await resClients.json();
        setClientes(Array.isArray(dataClients) ? dataClients : []);
      }

      if (resUsers.status === 401)
        toast.error("Sesión no autorizada o expirada");
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor de CamCoach");
    }
  };

  useEffect(() => {
    setIsMounted(true);
    cargarDatos();
  }, []);

  const generarPass = () => Math.random().toString(36).slice(-8);

  // 2. CREAR USUARIO
  const crearUsuario = async () => {
    if (nuevoUsuario.rol === "cliente" && !nuevoUsuario.cliente_id) {
      toast.warning("Debes seleccionar un cliente para este acceso.");
      return;
    }

    const passMock = generarPass();
    const payload = {
      ...nuevoUsuario,
      password: passMock,
      is_active: true,
      cliente_id: nuevoUsuario.cliente_id ? Number(nuevoUsuario.cliente_id) : null,
    };

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesión inválida");
        return;
      }

      const response = await fetch(`${API_USUARIOS}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (response.ok) {
        const usuarioCreado = await response.json();
        setCredenciales({
          id: usuarioCreado.id,
          email: nuevoUsuario.email,
          pass: passMock,
        });
        setCredencialesDialog(true);
        setNuevoUsuario({
          username: "",
          email: "",
          rol: "cliente",
          cliente_id: "",
        });
        setDialogOpen(false);
        cargarDatos();
        toast.success("Usuario creado y vinculado");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Error al crear usuario");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red");
    }
  };

  // 3. ELIMINAR
  const eliminarUsuario = async (id: number) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      // 🎯 CORRECCIÓN 3: Slash "/" agregado
      const response = await fetch(`${API_USUARIOS}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Usuario eliminado exitosamente");
        cargarDatos();
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar");
    }
  };

  // 4. CAMBIAR ESTADO
  const toggleActivo = async (usuario: Usuario) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      // 🎯 CORRECCIÓN 3: Slash "/" agregado
      const response = await fetch(`${API_USUARIOS}/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !usuario.is_active }),
        credentials: "include",
      });
      if (response.ok) {
        toast.success(
          `Usuario ${usuario.is_active ? "desactivado" : "activado"}`,
        );
        cargarDatos();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar estado");
    }
  };

  const copiarCredenciales = () => {
    const texto = `CamCoach Access:\nEmail: ${credenciales.email}\nPass: ${credenciales.pass}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast.success("Copiado al portapapeles");
  };

  if (!isMounted) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse font-medium">
        Cargando gestión de usuarios... ⚙️
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra los accesos de tus clientes.
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
            </Button>
          </DialogTrigger>
          {/* 🎯 CORRECCIÓN 4: aria-describedby para accesibilidad */}
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <DialogDescription>
                Genera credenciales vinculadas a un cliente registrado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre de Usuario"
                value={nuevoUsuario.username}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })
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
                value={nuevoUsuario.cliente_id}
                onValueChange={(v) =>
                  setNuevoUsuario({ ...nuevoUsuario, cliente_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={crearUsuario}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({usuarios?.length || 0})</CardTitle>
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
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No hay usuarios registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios?.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.username}</TableCell>
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
                          onClick={() => toggleActivo(usuario)}
                        >
                          {usuario.is_active ? (
                            <Eye className="h-4 w-4 text-blue-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="space-x-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => eliminarUsuario(usuario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG DE CREDENCIALES (MODAL DE ÉXITO) */}
      <Dialog open={credencialesDialog} onOpenChange={setCredencialesDialog}>
        {/* 🎯 CORRECCIÓN 4: aria-describedby para accesibilidad */}
        <DialogContent aria-describedby={undefined} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              ¡Credenciales Listas!
            </DialogTitle>
            <DialogDescription>
              Copia y envía estas credenciales al cliente de inmediato.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-900 p-4 rounded-md space-y-2 mt-2">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase font-semibold">
                Email
              </span>
              <span className="text-slate-50 font-mono text-sm">
                {credenciales.email}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase font-semibold">
                Contraseña
              </span>
              <span className="text-green-400 font-mono text-lg">
                {credenciales.pass}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4 flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setCredencialesDialog(false)}
            >
              Cerrar
            </Button>
            <Button onClick={copiarCredenciales} className="gap-2">
              {copiado ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiado ? "Copiado" : "Copiar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}