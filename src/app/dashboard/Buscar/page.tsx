"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Sparkles,
  User,
  DollarSign,
  CalendarIcon,
  Loader2,
  MessageSquare, // 🚀 Nuevo ícono para WhatsApp
  Eye, // 🚀 Nuevo ícono para ver perfil
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"; // 🚀 Para separar las acciones
import { toast } from "sonner";
import Link from "next/link";



const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE = `${BASE_URL}/ingresos`;

type ResultadoBusqueda = {
  id: string;
  modulo: "clientes" | "eventos" | "ingresos";
  titulo: string;
  subtitulo: string;
  badge: string;
  monto?: number;
  fecha?: string;
  detalles?: string;
};

export default function BuscadorPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [loading, setLoading] = useState(false);

  // 1. CARGAR RECOMENDACIONES GENERADAS POR EL BACKEND
  const cargarSugerenciasIA = async () => {
    try {
      const response = await fetch(`${API_BASE}/recomendaciones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRecomendaciones(data);
      }
    } catch (error) {
      console.error("Error al traer sugerencias IA:", error);
    }
  };

  // 2. EJECUTAR LA BÚSQUEDA DINÁMICA
  const buscar = async (textoAEvaluar = query) => {
    if (!textoAEvaluar.trim()) {
      toast.warning("Escribe algo para buscar");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/?q=${textoAEvaluar}&tipo=${tipoFiltro}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setResultados(data);
      } else {
        toast.error("Error en los filtros de búsqueda");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red al buscar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSugerenciasIA();
  }, []);

  const clickRecomendacion = (recomendacion: string) => {
    setQuery(recomendacion);
    if (recomendacion.includes("pausados")) {
      buscar("pausada");
    } else {
      buscar(recomendacion);
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-blue-500/30">
          <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Buscador Inteligente
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Explora todo tu ecosistema CamCoach administrado en tiempo real.
        </p>
      </div>

      {/* BUSCADOR PRINCIPAL */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe un nombre, estado, teléfono..."
              className="pl-12 pr-28 h-14 text-lg rounded-2xl border-2"
              onKeyDown={(e) => e.key === "Enter" && buscar()}
            />
            <Button
              onClick={() => buscar()}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-12 px-6 font-semibold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
          </div>

          {/* FILTRO MANUAL */}
          <div className="flex justify-center mt-6">
            <Select value={tipoFiltro} onValueChange={(v) => setTipoFiltro(v)}>
              <SelectTrigger className="w-64 rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">🔍 Todo</SelectItem>
                <SelectItem value="clientes">👥 Clientes</SelectItem>
                <SelectItem value="eventos">📅 Eventos</SelectItem>
                <SelectItem value="ingresos">💰 Ingresos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* RECOMENDACIONES IA */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-400" />
          Sugerencias del Asistente
        </h3>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {recomendaciones.map((rec, i) => (
            <Card
              key={i}
              className="group cursor-pointer hover:scale-[1.02] transition-all border-2 border-transparent hover:border-purple-500/50 bg-linear-to-r from-purple-500/5 to-blue-500/5"
              onClick={() => clickRecomendacion(rec)}
            >
              <CardContent className="p-6">
                <div className="text-sm font-medium text-purple-400 mb-2">
                  IA Analiza Base de Datos
                </div>
                <p className="text-lg font-semibold leading-tight text-white">
                  {rec}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* RESULTADOS DINÁMICOS */}
      {resultados.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Search className="h-8 w-8" />
            {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}{" "}
            encontrado{resultados.length !== 1 ? "s" : ""}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((item) => {
              // # 🛠️ TRUCO CORREGIDO: Extraemos solo los dígitos del texto del teléfono
              const numeroLimpio = item.detalles
                ? item.detalles.replace(/\D/g, "")
                : "";

              return (
                <Card
                  key={item.id}
                  className="hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
                >
                  <CardContent className="p-6 space-y-4 grow">
                    <div className="flex items-start justify-between">
                      {item.modulo === "ingresos" ? (
                        <DollarSign className="h-8 w-8 text-green-500" />
                      ) : item.modulo === "eventos" ? (
                        <CalendarIcon className="h-8 w-8 text-blue-500" />
                      ) : (
                        <User className="h-8 w-8 text-purple-500" />
                      )}
                      <Badge variant="outline" className="capitalize">
                        {item.badge}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1 truncate">
                        {item.titulo}
                      </h4>
                      {item.monto !== undefined && (
                        <div className="text-2xl font-bold text-green-500 mb-2">
                          ${item.monto.toLocaleString()}
                        </div>
                      )}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="truncate">{item.subtitulo}</div>
                        {item.fecha && <div>📅 {item.fecha}</div>}
                        {item.detalles && (
                          <div className="text-xs opacity-80 pt-1 truncate">
                            💡 {item.detalles}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  {/* 🚀 SECCIÓN DE ACCIONES RÁPIDAS (QUICK ACTIONS) CORREGIDA Y ESTILIZADA */}
                  {item.modulo === "clientes" && (
                    <div className="p-6 pt-0 mt-auto">
                      <Separator className="mb-4" />
                      <div className="flex gap-2 w-full">
                        {/* Botón Dinámico de WhatsApp con flex-1 */}
                        {numeroLimpio.length > 5 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs rounded-xl border-green-500/30 text-green-500 hover:bg-green-500/10 gap-1.5 font-medium"
                            asChild
                          >
                            <a
                              href={`https://wa.me/57${numeroLimpio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              WhatsApp
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="flex-1 text-xs rounded-xl gap-1.5 opacity-40"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Sin Teléfono
                          </Button>
                        )}

                        {/* Botón de navegación interna con flex-1 */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-xs rounded-xl gap-1.5 font-medium"
                          asChild
                        >
                          <Link href="/dashboard/Clientes">
                            <Eye className="h-3.5 w-3.5" />
                            Ver Módulo
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ESTADO VACÍO */}
      {query && resultados.length === 0 && !loading && (
        <Card className="text-center py-16 bg-linear-to-r from-blue-500/5 to-purple-500/5 border-2 border-dashed border-blue-500/20 max-w-4xl mx-auto rounded-2xl">
          <CardContent>
            <Search className="h-16 w-16 mx-auto mb-4 text-purple-400/60 opacity-70" />
            <h3 className="text-2xl font-bold mb-2 text-white">
              No encontramos coincidences para tu búsqueda
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              El asistente inteligente no detectó registros con el término{" "}
              <strong className="text-purple-400">&quot;{query}&quot;</strong>{" "}
              en tu cuenta de administrador.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setResultados([]);
                }}
                className="rounded-xl"
              >
                Limpiar pantalla
              </Button>
              <Button
                onClick={() => buscar("activa")}
                className="rounded-xl bg-purple-600 hover:bg-purple-700"
              >
                Ver clientes activos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
