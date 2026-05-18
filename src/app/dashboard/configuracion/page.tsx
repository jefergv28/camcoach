"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Moon, Palette, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN CLAVE

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 1: Ruta corregida. Ajusta a "/configuracion" si así se llama en tu FastAPI
const API_PERFIL = `${BASE_URL}/configuracion`;

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    nombre: "",
    email: "",
    telefono: "",
    notificaciones: { email: false, whatsapp: false, app: false },
    tema: "dark" as "light" | "dark" | "system",
    idioma: "es",
  });

  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // 🎯 Escudo de hidratación

  // 1. OBTENER LOS DATOS REALES DEL USUARIO LOGUEADO
  const cargarConfiguracion = async () => {
    try {
      const token = Cookies.get("token"); // 🎯 CORRECCIÓN 2: Leemos el token de la Cookie
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(API_PERFIL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setConfig((prev) => ({
          ...prev,
          ...data,
          notificaciones: data.notificaciones || prev.notificaciones // Blindaje por si viene null
        }));
      } else {
        toast.error("No se pudo cargar tu perfil");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Leer tema local si existe
  useEffect(() => {
    setIsMounted(true);
    cargarConfiguracion();
    const temaGuardado = localStorage.getItem("temaCamCoach");
    if (temaGuardado) {
      setConfig((prev) => ({
        ...prev,
        tema: temaGuardado as "light" | "dark" | "system",
      }));
    }
  }, []);

  // Efecto visual para cambiar el tema en el navegador
  useEffect(() => {
    if (!isMounted) return;
    if (
      config.tema === "dark" ||
      (config.tema === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [config.tema, isMounted]);

  // 2. GUARDAR LOS CAMBIOS EN LA BASE DE DATOS
  const guardarConfig = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesión inválida");
        return;
      }

      const response = await fetch(API_PERFIL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🎯 CORRECCIÓN 3: Faltaba enviar el token aquí
        },
        body: JSON.stringify(config),
        credentials: "include",
      });

      if (response.ok) {
        localStorage.setItem("temaCamCoach", config.tema);
        toast.success("¡Configuración guardada exitosamente!");
      } else {
        toast.error("Error al guardar los cambios");
      }
    } catch (error) {
      console.error(error);
      toast.error("Fallo de red al guardar");
    }
  };

  const getIniciales = (nombre: string) => {
    if (!nombre) return "U";
    return nombre.substring(0, 2).toUpperCase();
  };

  // 🎯 Escudo de hidratación visual
  if (!isMounted || loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse font-medium">
        Cargando configuración del sistema... ⚙️
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu perfil de CamCoach.
          </p>
        </div>
        <Button
          onClick={guardarConfig}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Save className="mr-2 h-4 w-4" /> Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-background">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
        </TabsList>

        {/* PERFIL */}
        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Estos son los datos vinculados a tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 bg-indigo-500/10 border-2 border-indigo-500/20">
                  <AvatarFallback className="text-2xl font-bold text-indigo-400">
                    {getIniciales(config.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Para cambiar tu foto de perfil, comunícate con el
                    administrador del sistema.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={config.nombre}
                    onChange={(e) =>
                      setConfig({ ...config, nombre: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo Electrónico (Solo Lectura)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono de Contacto</Label>
                  <Input
                    id="telefono"
                    value={config.telefono || ""}
                    placeholder="Ej: +57 300..."
                    onChange={(e) =>
                      setConfig({ ...config, telefono: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICACIONES SIMPLIFICADAS */}
        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
              <CardDescription>
                Controla cómo quieres que CamCoach te avise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                <div className="space-y-1">
                  <Label className="text-base font-bold">
                    Notificaciones en el Navegador
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas push cuando haya actualizaciones en el
                    inventario o reportes.
                  </p>
                </div>
                <Switch
                  checked={config.notificaciones?.app || false}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      notificaciones: {
                        ...config.notificaciones,
                        app: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMA */}
        <TabsContent value="tema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>
                Ajusta cómo ves el panel de administración.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-sm">
                <Label>Tema Visual</Label>
                <Select
                  value={config.tema}
                  onValueChange={(v: "light" | "dark" | "system") =>
                    setConfig({ ...config, tema: v })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <Sun className="mr-2 h-4 w-4 inline-block" /> Claro
                    </SelectItem>
                    <SelectItem value="dark">
                      <Moon className="mr-2 h-4 w-4 inline-block" /> Oscuro
                    </SelectItem>
                    <SelectItem value="system">
                      <Palette className="mr-2 h-4 w-4 inline-block" />{" "}
                      Automático
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}