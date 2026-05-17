"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// 🚀 Cargamos dinámicamente los gráficos y listas para evitar que rompan el prerenderizado estático en Vercel
const AppBarChart = dynamic(() => import("@/components/AppBarChart"), {
  ssr: false,
});
const AppPieChart = dynamic(() => import("@/components/AppPieChart"), {
  ssr: false,
});
const AppAreaChart = dynamic(() => import("@/components/AppAreaChart"), {
  ssr: false,
});
const CardList = dynamic(() => import("@/components/CardList"), { ssr: false });
const TodoList = dynamic(() => import("@/components/TodoList"), { ssr: false });

export default function LandingPage() {
  // Función simulada para cumplir con el contrato interactivo de la prop de TodoList
  const handleDummyToggle = (id: number) => {
    console.log("Acción interactiva simulada en la Landing para el ID:", id);
  };

  return (
    <div className="min-h-screen">
      {/* Header igual que dashboard */}
      <header className="border-b bg-primary-foreground/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  <Image
                    src="/logo.png"
                    alt="CamCoach"
                    width={200}
                    height={200}
                    priority // 🔥 Optimización de Next.js para imágenes por encima del pliegue (LCP)
                  />
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                CamCoach
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mismo estilo cards */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Hero principal */}
        <div className="bg-primary-foreground p-6 lg:p-8 rounded-lg text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            CamCoach - Tu Dashboard Profesional
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
            Gestión completa de clientes, ingresos, calendarios y reportes. Todo
            en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                ¡Empieza Gratis!
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview del Dashboard - EXACTO estilo Homepage */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Así se ve tu Dashboard
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
            {/* Ingresos por periodo */}
            <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
              <h3 className="font-bold mb-4 text-foreground">
                Ingresos por Período
              </h3>
              <AppBarChart chartData={[]} />
            </div>

            {/* Últimos ingresos */}
            <div className="bg-primary-foreground p-4 rounded-lg">
              <CardList title="Últimos Ingresos" items={[]} />
            </div>

            {/* Distribución */}
            <div className="bg-primary-foreground p-4 rounded-lg">
              <AppPieChart chartData={[]} />
            </div>

            {/* Tareas */}
            <div className="bg-primary-foreground p-4 rounded-lg">
              {/* 🎯 Pasamos la función dummy limpia para que Next.js compile sin errores */}
              <TodoList onToggle={handleDummyToggle} initialTodos={[]} />
            </div>

            {/* Evolución */}
            <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
              <AppAreaChart chartData={[]} />
            </div>

            {/* Clientes destacados */}
            <div className="bg-primary-foreground p-4 rounded-lg">
              <CardList title="Clientes Destacados" items={[]} />
            </div>
          </div>
        </section>

        {/* Features - Lista simple como tu original pero con cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              👥 Clientes
            </h3>
            <p className="text-muted-foreground">
              Gestión completa con perfiles detallados.
            </p>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              📅 Calendario
            </h3>
            <p className="text-muted-foreground">
              Agenda inteligente con notificaciones.
            </p>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              💰 Ingresos
            </h3>
            <p className="text-muted-foreground">
              Control total de ganancias por cliente.
            </p>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              📊 Reportes
            </h3>
            <p className="text-muted-foreground">
              Exporta PDF con métricas clave.
            </p>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              🎓 Capacitaciones
            </h3>
            <p className="text-muted-foreground">
              Contenidos y seguimiento personalizado.
            </p>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              ⚙️ Configuración
            </h3>
            <p className="text-muted-foreground">
              Personaliza todo a tu medida.
            </p>
          </div>
        </section>

        {/* CTA Final */}
        <div className="bg-primary-foreground p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Crea tu cuenta gratis y transforma tu gestión.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg">
              ¡Comienza Ahora!
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
