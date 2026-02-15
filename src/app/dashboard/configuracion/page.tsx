"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, Bell, Sun, Moon, Palette, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    nombre: "Nya",
    email: "nya@camcoach.com",
    telefono: "+57 300 1234567",
    notificaciones: { email: true, whatsapp: true, app: false },
    tema: "dark" as "light" | "dark" | "system",
    coloresPrimario: "#4facfe", // shadcn azul
    idioma: "es",
  });

  useEffect(() => {
    const saved = localStorage.getItem("configCamCoach");
    if (saved) setConfig(JSON.parse(saved));

    // Aplicar tema
    if (config.tema === "dark" || (config.tema === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const guardarConfig = () => {
    localStorage.setItem("configCamCoach", JSON.stringify(config));
    // Aplicar tema
    document.documentElement.classList.toggle('dark', config.tema === "dark" || (config.tema === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches));
    alert("¡Configuración guardada!");
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Personaliza CamCoach a tu medida.</p>
        </div>
        <Button onClick={guardarConfig}>
          <Save className="mr-2 h-4 w-4" /> Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
        </TabsList>

        {/* PERFIL */}
        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos de la asesora.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatar-nya.jpg" />
                  <AvatarFallback>NY</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">Cambiar Foto</Button>
                  <p className="text-sm text-muted-foreground">JPG/PNG max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" value={config.nombre} onChange={(e) => setConfig({...config, nombre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={config.email} onChange={(e) => setConfig({...config, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={config.telefono} onChange={(e) => setConfig({...config, telefono: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCIAS */}
        <TabsContent value="preferencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={config.idioma} onValueChange={(v) => setConfig({...config, idioma: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Color Primario</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={config.coloresPrimario}
                    onChange={(e) => setConfig({...config, coloresPrimario: e.target.value})}
                    className="h-10 w-10 rounded-full border cursor-pointer"
                  />
                  <span>{config.coloresPrimario}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICACIONES */}
        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email</Label>
                  <p className="text-sm text-muted-foreground">Recordatorios eventos, reportes mensuales.</p>
                </div>
                <Switch
                  checked={config.notificaciones.email}
                  onCheckedChange={(checked) => setConfig({...config, notificaciones: {...config.notificaciones, email: checked}})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Alertas urgentes clientes.</p>
                </div>
                <Switch
                  checked={config.notificaciones.whatsapp}
                  onCheckedChange={(checked) => setConfig({...config, notificaciones: {...config.notificaciones, whatsapp: checked}})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">En App</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones push navegador.</p>
                </div>
                <Switch
                  checked={config.notificaciones.app}
                  onCheckedChange={(checked) => setConfig({...config, notificaciones: {...config.notificaciones, app: checked}})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMA */}
        <TabsContent value="tema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema y Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={config.tema} onValueChange={(v: "light" | "dark" | "system") => setConfig({...config, tema: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light"><Sun className="mr-2 h-4 w-4" />Claro</SelectItem>
                    <SelectItem value="dark"><Moon className="mr-2 h-4 w-4" />Oscuro</SelectItem>
                    <SelectItem value="system"><Palette className="mr-2 h-4 w-4" />Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <Button variant={config.tema === "light" ? "default" : "outline"} onClick={() => setConfig({...config, tema: "light"})}>Claro</Button>
                <Button variant={config.tema === "dark" ? "default" : "outline"} onClick={() => setConfig({...config, tema: "dark"})}>Oscuro</Button>
                <Button variant={config.tema === "system" ? "default" : "outline"} onClick={() => setConfig({...config, tema: "system"})}>Auto</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
