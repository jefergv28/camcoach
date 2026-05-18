"use client";

import { useEffect, useState } from "react";
import { Clock, LogOut, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie"; // 🎯 CORRECCIÓN 1: Importamos js-cookie para manejo de sesión unificada

interface UserInfo {
  email: string;
  rol: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// 🎯 CORRECCIÓN 2: Apuntamos al endpoint de autenticación real y forzamos el "/" final
const API_PERFIL = `${BASE_URL}/auth/me/`;

const Navbar = () => {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar info del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token"); // 🎯 CORRECCIÓN 3: Leemos el token real de las cookies

        // ESCUDO: Si el token no está listo en el navegador, evitamos peticiones vacías
        if (!token) {
          console.log("[Navbar] Esperando por el token unificado...");
          return;
        }

        const res = await fetch(API_PERFIL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 🎯 Inyección obligatoria de credenciales
          },
          credentials: "include",
          mode: "cors",
        });

        if (!res.ok) {
          throw new Error("No autorizado");
        }

        const data = await res.json();
        // Soportamos si tu backend devuelve 'rol' o 'role'
        setUser({ email: data.email, rol: data.rol || data.role || "user" });
      } catch (err) {
        console.error("Error fetching user en Navbar:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    if (pathname !== "/") {
      fetchUser();
    }
  }, [pathname]);

  // Oculta navbar en landing
  if (pathname === "/") {
    return <div className="h-0 border-b-0" />;
  }

  // Logout
  const handleLogout = () => {
    // 🎯 CORRECCIÓN 4: Eliminamos la cookie unificada correcta y limpiamos localStorage
    Cookies.remove("token");
    localStorage.removeItem("token");

    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "camcoach_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Forzamos reseteo de la memoria del cliente redirigiendo a la raíz
    window.location.href = "/";
  };

  // Iniciales para Avatar
  const getInitials = (email: string) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link href="/dashboard" className="text-lg font-bold text-foreground">
          CamCoach
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-9 w-9 border hover:opacity-85 transition-opacity">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="bg-primary/5 font-semibold text-xs text-muted-foreground">
                {loadingUser ? "..." : user ? getInitials(user.email) : "???"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                  {loadingUser ? "Cargando..." : user ? user.email.split("@")[0] : "Invitado"}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {loadingUser ? "..." : user ? `${user.email} (${user.rol})` : "No autenticado"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/configuracion">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/configuracion/historial">
                <Clock className="h-4 w-4 mr-2" />
                Historial Actividad
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;