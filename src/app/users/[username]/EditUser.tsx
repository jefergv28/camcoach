"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN DEL TOKEN

// 1. Definimos el mismo tipo de dato que usamos en la página principal
type Usuario = {
  id: number;
  username: string;
  email: string;
  rol: "admin" | "cliente";
  is_active: boolean;
  cliente_id: number | null;
};

// 2. Le decimos a TypeScript que este componente recibe 'usuarioData'
type EditUserProps = {
  usuarioData: Usuario;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 1: Ruta correcta a usuarios
const API_BASE = `${BASE_URL}/usuarios`;

// 3. Desestructuramos el prop en la función del componente
const EditUser = ({ usuarioData }: EditUserProps) => {
  // 4. Usamos los datos del usuario para inicializar el estado del formulario
  const [formData, setFormData] = useState({
    username: usuarioData.username,
    email: usuarioData.email,
    rol: usuarioData.rol,
    is_active: usuarioData.is_active,
  });

  const handleSave = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesión inválida");
        return;
      }

      // 🎯 CORRECCIÓN 2: Inyección del token y credentials
      const response = await fetch(`${API_BASE}/${usuarioData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      toast.success("Usuario actualizado correctamente");

      // Opcional: Podrías forzar una recarga limpia aquí si quieres que los datos en SingleUserPage se refresquen de inmediato
      // window.location.reload();

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar usuario");
    }
  };

  return (
    <SheetContent className="sm:max-w-106.25">
      <SheetHeader>
        <SheetTitle>Editar Usuario</SheetTitle>
        <SheetDescription>
          Haz cambios en el perfil de {usuarioData.username} aquí. Haz clic en
          guardar cuando termines.
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-6 py-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="rol">Rol del Sistema</Label>
          <Select
            value={formData.rol}
            onValueChange={(value: "admin" | "cliente") =>
              setFormData({ ...formData, rol: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4 mt-2">
          <div className="space-y-0.5">
            <Label className="text-base">Estado de la cuenta</Label>
            <p className="text-sm text-muted-foreground">
              {formData.is_active
                ? "El usuario puede iniciar sesión."
                : "La cuenta está suspendida."}
            </p>
          </div>
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_active: checked })
            }
          />
        </div>
      </div>

      <SheetFooter>
        <Button onClick={handleSave} className="w-full bg-slate-900 text-white hover:bg-slate-800">
          Guardar Cambios
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default EditUser;