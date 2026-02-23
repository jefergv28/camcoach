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
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.detail.includes("registrado")) {
          throw new Error("El email ya está registrado. Prueba con otro.");
        } else if (response.status === 422) {
          throw new Error("Datos inválidos. Verifica el email y la contraseña (mínimo 8 caracteres).");
        } else {
          throw new Error(data.detail || "Error al crear la cuenta");
        }
      }

      // Éxito: el backend devuelve el usuario creado
      setSuccess("¡Cuenta creada exitosamente! Ahora inicia sesión.");

      // Limpia el form
      setNombre("");
      setEmail("");
      setPassword("");

      // Redirigir al login después de 2 segundos (o inmediato si prefieres)
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b bg-primary-foreground/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  <img src="logo.svg" alt="CamCoach Logo" />
                </span>
              </div>
              <Link
                href="http://localhost:3000/"
                className="text-xl font-bold text-foreground"
              >
                CamCoach
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-md">
        <Card className="bg-primary-foreground border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              ¡Únete a CamCoach!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Crea tu cuenta gratis en segundos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Mensajes de éxito o error */}
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm p-3 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {/* Campo Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tu nombre completo"
                    className="pl-10 h-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-10 h-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
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
                {loading ? "Creando cuenta..." : "Registrarse Gratis"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}