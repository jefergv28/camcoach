"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Sparkles,
  User,
  DollarSign,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const clientes = [
  {
    nombre: "Luna Star",
    telefono: "+573001234567",
    ingresos: 2500000,
    estado: "activa",
  },
  {
    nombre: "Camila Fox",
    telefono: "+573009876543",
    ingresos: 1800000,
    estado: "pausada",
  },
  {
    nombre: "Sofía Luna",
    telefono: "+573001112223",
    ingresos: 3200000,
    estado: "activa",
  },
];

const eventos = [
  {
    titulo: "Sesión Luna Star",
    cliente: "Luna Star",
    fecha: "2026-02-14",
    hora: "15:00",
  },
  {
    titulo: "Reunión Camila",
    cliente: "Camila Fox",
    fecha: "2026-02-15",
    hora: "10:30",
  },
];

const ingresosRecientes = [
  { cliente: "Luna Star", monto: 280000, fecha: "2026-02-14", tipo: "sesión" },
  { cliente: "Sofía Luna", monto: 320000, fecha: "2026-02-12", tipo: "sesión" },
];

const BuscadorPage = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<
    "todo" | "clientes" | "eventos" | "ingresos"
  >("todo");
  const [loading, setLoading] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<
    "clientes" | "eventos" | "ingresos" | null
  >(null);

  useEffect(() => {
    // Recomendaciones IA automáticas
    const recs = [];
    if (clientes.some((c) => c.estado === "pausada"))
      recs.push("Contactar clientes pausados");
    if (ingresosRecientes[0]?.monto < 200000)
      recs.push("Aumentar precios sesiones");
    if (eventos.length > 5) recs.push("Revisar agenda semana");
    setRecomendaciones(recs.slice(0, 3));
  }, []);

  const buscar = async () => {
    setLoading(true);
    setTimeout(() => {
      const resultadosFiltrados = [
        ...(tipoFiltro === "todo" || tipoFiltro === "clientes"
          ? clientes.filter((c) =>
              c.nombre.toLowerCase().includes(query.toLowerCase()),
            )
          : []),
        ...(tipoFiltro === "todo" || tipoFiltro === "eventos"
          ? eventos.filter(
              (e) =>
                e.titulo.toLowerCase().includes(query.toLowerCase()) ||
                e.cliente.toLowerCase().includes(query.toLowerCase()),
            )
          : []),
        ...(tipoFiltro === "todo" || tipoFiltro === "ingresos"
          ? ingresosRecientes.filter((i) =>
              i.cliente.toLowerCase().includes(query.toLowerCase()),
            )
          : []),
      ];
      setResultados(resultadosFiltrados);
      setLoading(false);
    }, 800);
  };

  const clickRecomendacion = (recomendacion: string) => {
    setQuery(recomendacion);
    buscar();
  };

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-blue-500/30">
          <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Buscador Inteligente
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Busca clientes, eventos, ingresos...{" "}
          <strong>¡IA te da recomendaciones automáticas!</strong>
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
              placeholder="Buscar cliente, evento, ingreso... o usa recomendaciones IA ↓"
              className="pl-12 pr-28 h-14 text-lg rounded-2xl border-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-xl"
              onKeyDown={(e) => e.key === "Enter" && buscar()}
            />
            <Button
              onClick={buscar}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-12 px-6 font-semibold shadow-lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
          </div>

          {/* FILTRO */}
          <div className="flex justify-center mt-6">
            <Select
              value={tipoFiltro}
              onValueChange={(v: any) => setTipoFiltro(v)}
            >
              <SelectTrigger className="w-64 rounded-xl border-2 bg-white/50 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-sm rounded-xl">
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
          <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          Recomendaciones IA
        </h3>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {recomendaciones.map((rec, i) => (
            <Card
              key={i}
              className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-2 border-transparent hover:border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
              onClick={() => clickRecomendacion(rec)}
            >
              <CardContent className="p-6">
                <div className="text-sm font-medium text-purple-400 mb-2 opacity-0 group-hover:opacity-100 transition-all">
                  IA Sugiere
                </div>
                <p className="text-lg font-semibold text-white leading-tight">
                  {rec}
                </p>
              </CardContent>
            </Card>
          ))}
          {recomendaciones.length === 0 && (
            <Card className="col-span-full text-center py-12 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>¡Todo al día! Usa el buscador arriba.</p>
            </Card>
          )}
        </div>
      </div>

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Search className="h-8 w-8" />
            {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}{" "}
            para "{query}"
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((resultado: any, i) => (
              <Card key={i} className="hover:shadow-xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    {resultado.monto ? (
                      <DollarSign className="h-8 w-8 text-green-500 mt-1" />
                    ) : resultado.fecha ? (
                      <CalendarIcon className="h-8 w-8 text-blue-500 mt-1" />
                    ) : (
                      <User className="h-8 w-8 text-purple-500 mt-1" />
                    )}
                    <Badge
                      variant="outline"
                      className="group-hover:scale-105 transition-transform"
                    >
                      {resultado.tipo || resultado.estado || "Cliente"}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-xl mb-1">
                    {resultado.nombre || resultado.titulo || resultado.cliente}
                  </h4>
                  {resultado.monto && (
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${resultado.monto?.toLocaleString?.()}
                    </div>
                  )}
                  <div className="space-y-1 text-sm text-gray-600">
                    {resultado.telefono && <div>📱 {resultado.telefono}</div>}
                    {resultado.fecha && (
                      <div>
                        📅 {resultado.fecha}{" "}
                        {resultado.hora && `| ${resultado.hora}`}
                      </div>
                    )}
                    {resultado.ingresos && (
                      <div>💰 ${resultado.ingresos?.toLocaleString?.()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {query && resultados.length === 0 && !loading && (
        <Card className="text-center py-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/30">
          <Search className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
          <h3 className="text-2xl font-bold mb-2 text-white">
            No se encontraron resultados
          </h3>
          <p className="text-gray-400 mb-6">Prueba con otro término o filtro</p>
          <Button variant="outline" onClick={() => setQuery("")}>
            Limpiar
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BuscadorPage;
