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
    // Aquí iría tu lógica de fetch con el método PUT hacia FastAPI
    // fetch(`http://localhost:8000/usuarios/${usuarioData.id}`, { ... })

    console.log("Guardando datos:", formData);
    toast.success("Usuario actualizado correctamente");
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
        <Button onClick={handleSave} className="w-full">
          Guardar Cambios
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default EditUser;
