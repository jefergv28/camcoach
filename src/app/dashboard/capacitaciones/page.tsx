"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Presentation } from "lucide-react";

type Capacitacion = {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "video" | "presentacion" | "documento";
  url: string;
  estado: "disponible" | "proximamente";
};

const capacitaciones: Capacitacion[] = [
  {
    id: "1",
    titulo: "Introducción al Marketing Digital",
    descripcion: "Conceptos básicos para potenciar tu marca personal",
    tipo: "video",
    url: "https://www.youtube.com/watch?v=xxxx",
    estado: "disponible",
  },
  {
    id: "2",
    titulo: "Gestión de Contenido",
    descripcion: "Cómo planear y organizar contenido semanal",
    tipo: "presentacion",
    url: "https://docs.google.com/presentation/d/xxxx",
    estado: "disponible",
  },
  {
    id: "3",
    titulo: "Monetización de Redes",
    descripcion: "Estrategias para generar ingresos",
    tipo: "documento",
    url: "#",
    estado: "proximamente",
  },
];

export default function CapacitacionesPage() {
  const getIcon = (tipo: Capacitacion["tipo"]) => {
    if (tipo === "video") return <PlayCircle className="h-6 w-6" />;
    if (tipo === "presentacion") return <Presentation className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Capacitaciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {capacitaciones.map((cap) => (
          <Card key={cap.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {getIcon(cap.tipo)}
                <h3 className="font-semibold text-lg">{cap.titulo}</h3>
              </div>

              <p className="text-sm text-muted-foreground">{cap.descripcion}</p>

              <div className="flex justify-between items-center">
                <Badge variant="outline">{cap.tipo}</Badge>

                {cap.estado === "disponible" ? (
                  <Button
                    size="sm"
                    onClick={() => window.open(cap.url, "_blank")}
                  >
                    Ver capacitación
                  </Button>
                ) : (
                  <Badge variant="secondary">Próximamente</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
