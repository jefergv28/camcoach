"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface UserInfo {
  email: string;
  rol: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar info del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          method: "GET",
          credentials: "include", // envía la cookie httpOnly
          mode: "cors",
        });

        if (!res.ok) {
          throw new Error("No autorizado");
        }

        const data = await res.json();
        setUser({ email: data.email, rol: data.rol });
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
        // Opcional: redirigir si falla gravemente
        // router.replace("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  // Oculta navbar en landing
  if (pathname === "/") {
    return <div className="h-0 border-b-0" />;
  }

  // Logout
  const handleLogout = () => {
    // Forzamos expiración de la cookie (client-side no borra httpOnly directamente, pero esto funciona)
    document.cookie =
      "camcoach_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh(); // Refresca para que middleware detecte
  };

  // Iniciales para Avatar
  const getInitials = (email: string) => {
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
        <Link href="/dashboard" className="text-lg font-bold">
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
          <DropdownMenuTrigger>
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback>
                {loadingUser ? "..." : user ? getInitials(user.email) : "???"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>
              {loadingUser
                ? "Cargando..."
                : user
                  ? `${user.email.split("@")[0]} (${user.rol})`
                  : "No autenticado"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracion">
                <Settings className="h-4 w-4 mr-2" />
                Ajustes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracion/historial">
                <Clock className="h-4 w-4 mr-2" />
                Historial Actividad
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer"
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
