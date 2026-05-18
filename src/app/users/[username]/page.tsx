"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CardList from "@/components/CardList";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Shield, User as UserIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLineChart from "@/components/AppLineChart";
import { toast } from "sonner";
import EditUser from "./EditUser";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN DEL TOKEN

// Tipo de dato basado en lo que devuelve FastAPI
type Usuario = {
  id: number;
  username: string;
  email: string;
  rol: "admin" | "cliente";
  is_active: boolean;
  cliente_id: number | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 1: Ruta correcta hacia el módulo de usuarios
const API_BASE = `${BASE_URL}/usuarios`;

const SingleUserPage = () => {
  const params = useParams();
  const userId = params?.id || "1";

  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario desde FastAPI
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Sesión no válida");
          setLoading(false);
          return;
        }

        // 🎯 CORRECCIÓN 2: Inyección segura del token y la barra "/" antes del ID
        const response = await fetch(`${API_BASE}/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast.error("Usuario no encontrado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-center text-lg animate-pulse">Cargando perfil...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-lg text-red-500 font-semibold">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Usuarios</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.username}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* USER BADGES CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm border">
            <h1 className="text-xl font-semibold">Insignias y Rol</h1>
            <div className="flex gap-4 mt-4">
              {/* Badge Dinámico de Estado */}
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={36}
                    className={`rounded-full border p-2 ${
                      user.is_active
                        ? "bg-blue-500/30 border-blue-500/50 text-blue-600"
                        : "bg-gray-500/30 border-gray-500/50 text-gray-600"
                    }`}
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">
                    {user.is_active ? "Usuario Activo" : "Usuario Inactivo"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Estado actual de la cuenta en el sistema.
                  </p>
                </HoverCardContent>
              </HoverCard>

              {/* Badge Dinámico de Rol (Admin o Cliente) */}
              {user.rol === "admin" ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield
                      size={36}
                      className="rounded-full bg-green-800/30 border-green-800/50 text-green-700 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Administrador</h1>
                    <p className="text-sm text-muted-foreground">
                      Tiene acceso total para gestionar clientes, eventos e
                      ingresos.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <HoverCard>
                  <HoverCardTrigger>
                    <UserIcon
                      size={36}
                      className="rounded-full bg-orange-500/30 border-orange-500/50 text-orange-600 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Cliente Asociado</h1>
                    <p className="text-sm text-muted-foreground">
                      Este usuario tiene un perfil de cliente asociado (ID:{" "}
                      {user.cliente_id || "Ninguno"}).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>

          {/* INFORMATION CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Información</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </SheetTrigger>
                {/* Aquí le pasamos el 'user' al componente hijo para que sepa qué editar */}
                <EditUser usuarioData={user} />
              </Sheet>
            </div>

            <div className="space-y-4 mt-4 text-sm">
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-muted-foreground">Completitud del perfil</p>
                <Progress value={user.cliente_id ? 100 : 50} />
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">
                  Usuario:
                </span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">
                  Email:
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">
                  Rol:
                </span>
                <Badge
                  variant={user.rol === "admin" ? "default" : "secondary"}
                  className="uppercase"
                >
                  {user.rol}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">
                  Estado:
                </span>
                <Badge variant={user.is_active ? "outline" : "destructive"}>
                  {user.is_active ? "Activo" : "Suspendido"}
                </Badge>
              </div>
            </div>
          </div>

          {/* CARD LIST CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm border">
            <CardList title="Actividad Reciente" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* USER CARD CONTAINER */}
          <div className="bg-primary-foreground p-6 rounded-lg space-y-4 shadow-sm border flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold capitalize">{user.username}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Cuenta creada en la plataforma de CAMCOAH con perfil de{" "}
                {user.rol}.
                {user.cliente_id
                  ? " Este usuario está vinculado a métricas y seguimientos de un cliente real."
                  : " Faltan datos de vinculación con un perfil de cliente."}
              </p>
            </div>
          </div>

          {/* CHART CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg shadow-sm border">
            <h1 className="text-xl font-semibold mb-4">
              Rendimiento / Actividad
            </h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;