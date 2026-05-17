"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE = `${BASE_URL}/ingresos`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Llamada al backend de FastAPI
      const response = await fetch(`${API_BASE} /auth/login`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Credenciales incorrectas");
      }

      const data = await response.json();

      // 2. GUARDAR EL TOKEN EN COOKIES
      // Es vital que el nombre 'token' coincida con lo que busca tu middleware
      if (data.access_token) {
        Cookies.set("token", data.access_token, {
          expires: 1, // 1 día de duración
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        setSuccess("¡Inicio de sesión exitoso! Redirigiendo...");

        // 3. Redirección con refresco para que el Middleware se active
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("No se recibió el token del servidor");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al conectar con el servidor";
      console.error("Error completo en login:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Header / Logo */}
      <div className="absolute top-0 left-0 right-0 border-b bg-primary-foreground/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="CamCoach Logo"
                  width={32} // Propiedad obligatoria
                  height={32} // Propiedad obligatoria
                  priority // Indica que es una imagen importante (LCP)
                  className="object-contain"
                />
              </div>
              <Link href="/" className="text-xl font-bold text-foreground">
                CamCoach
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <Card className="bg-primary-foreground border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              Bienvenida
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Inicia sesión en tu cuenta CamCoach
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Alerta de Error */}
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Alerta de Éxito */}
              {success && (
                <div className="bg-green-500/15 text-green-600 text-sm p-3 rounded-md flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-10 h-12 bg-background/50 border-border text-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-background/50 border-border text-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
