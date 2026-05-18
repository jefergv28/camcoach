"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Settings,
  Users2,
  ClipboardList,
  GraduationCap,
  Wallet,
  BarChart3,
  User2,
  ChevronUp,
  Plus,
  User,
  Clock,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie"; // 🎯 CORRECCIÓN CLAVE: Agregamos el import que faltaba

/* =========================
   MENÚ PRINCIPAL
========================= */
const appItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Clientes", url: "/dashboard/Clientes", icon: Users2 },
  { title: "Calendario", url: "/dashboard/Calendario", icon: Calendar },
  { title: "Ingresos", url: "/dashboard/Ingresos", icon: Wallet },
  { title: "Buscar", url: "/dashboard/Buscar", icon: Settings },
];
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 URL e inyección corregida apuntando a la ruta del perfil con "/" al final
const API_PERFIL = `${BASE_URL}/auth/me/`;

const AppSidebar = () => {
  const pathname = usePathname();

  // 🔄 Estado para almacenar la información del usuario en sesión
  const [usuario, setUsuario] = useState<{
    username: string;
    email: string;
  } | null>(null);

  // 1. CARGAR DATOS DEL USUARIO LOGUEADO
  useEffect(() => {
    const obtenerUsuarioActual = async () => {
      try {
        const token = Cookies.get("token"); // Lee la cookie de forma segura

        // ESCUDO: Si el token no está listo aún en el navegador, frenamos la petición
        if (!token) {
          console.log("[Sidebar] Esperando por el token unificado...");
          return;
        }

        const response = await fetch(API_PERFIL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envía el token de forma correcta
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data); // Guarda los datos reales del backend
        } else {
          console.error(
            "[Sidebar] El backend rechazó el token con estado:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error obteniendo el perfil del Sidebar:", error);
      }
    };

    // Solo pedimos los datos si no estamos en la Landing Page principal
    if (pathname !== "/") {
      obtenerUsuarioActual();
    }
  }, [pathname]);

  // 2. FUNCIÓN PARA CERRAR SESIÓN (LOGOUT)
  const handleLogout = () => {
    Cookies.remove("token"); // Borra la cookie unificada
    localStorage.removeItem("token");

    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Forzamos un refresco completo redirigiendo a la landing
    window.location.href = "/";
  };

  // Extraer iniciales dinámicas
  const getIniciales = (nombre: string) => {
    if (!nombre) return "U";
    return nombre.substring(0, 2).toUpperCase();
  };

  // Oculta completo en Landing
  if (pathname === "/") {
    return <div className="w-0 hidden lg:w-0 border-r-0" />;
  }

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={35} height={40} />
                <span className="text-lg font-semibold">CamCoach</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* ================= APPLICATION ================= */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ================= PROJECTS ================= */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus />
            <span className="sr-only">Nuevo</span>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/Planes-trabajo">
                    <ClipboardList />
                    <span>Planes de trabajo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/capacitaciones">
                    <GraduationCap />
                    <span>Capacitaciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ================= REPORTES ================= */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                Reportes
                <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/reportes">
                        <BarChart3 />
                        <span>Ver reportes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* ================= SETTINGS ================= */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Usuarios */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/configuracion/usuarios">
                    <Users2 />
                    <span>Usuarios</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge></SidebarMenuBadge>
              </SidebarMenuItem>

              {/* Configuración */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/configuracion">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER DINÁMICO Y FUNCIONAL ================= */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <User2 className="h-4 w-4 shrink-0" />
                    <span className="truncate font-medium">
                      {usuario ? usuario.username : "Cargando..."}
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-2 mb-2">
                  <Avatar className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20">
                    <AvatarFallback className="font-bold text-indigo-400 text-xs">
                      {getIniciales(usuario?.username || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate">
                      {usuario ? usuario.username : "Usuario CamCoach"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {usuario ? usuario.email : "cargando..."}
                    </p>
                  </div>
                </div>
                <Separator />
                <DropdownMenuItem asChild className="cursor-pointer mt-1">
                  <Link href="/dashboard/configuracion">
                    <User className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/configuracion/historial">
                    <Clock className="mr-2 h-4 w-4" />
                    Historial Actividad
                  </Link>
                </DropdownMenuItem>

                <Separator className="my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;