"use client";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";

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

const AppSidebar = () => {
  const pathname = usePathname(); // ← DETECTA RUTA

  // ← OCULTA COMPLETO EN LANDING
  if (pathname === '/') {
    return (
      <div className="w-0 hidden lg:w-0 border-r-0" />  // Espacio vacío invisible
    );}

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
                  <Link href="/Planes-trabajo">
                    <ClipboardList />
                    <span>Planes de trabajo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/capacitaciones">
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
                      <Link href="/reportes">
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
                  <Link href="/configuracion/usuarios">
                    <Users2 />
                    <span>Usuarios</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>

              {/* Configuración */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/configuracion">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>Nya</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-nya.jpg" />
                    <AvatarFallback>NY</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Nya</p>
                    <p className="text-xs text-muted-foreground">
                      nya@camcoach.com
                    </p>
                  </div>
                </div>
                <Separator />
                <DropdownMenuItem asChild>
                  <Link href="/configuracion">
                    <User className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/configuracion/historial">
                    <Clock className="mr-2 h-4 w-4" />
                    Historial Actividad
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
