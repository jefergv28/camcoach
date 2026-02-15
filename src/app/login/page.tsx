"use client";

import { useState } from "react";
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
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: guarda sesión localStorage
    localStorage.setItem(
      "userCamCoach",
      JSON.stringify({ email, rol: "cliente" }),
    );
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Header opcional como landing/dashboard */}
      <div className="absolute top-0 left-0 right-0 border-b bg-primary-foreground/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg  flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  <img src="logo.svg" alt="" />
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

      {/* Formulario centrado - Mismo estilo cards dashboard */}
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
                    className="pl-10 h-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Link registro - Mismo estilo */}
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
