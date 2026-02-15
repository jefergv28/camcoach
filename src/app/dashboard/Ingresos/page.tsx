"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";

// Datos ejemplo (editable)
const ingresosIniciales: Ingreso[] = [
  {
    id: "1",
    fecha: "2026-02-10",
    cliente: "Luna Star",
    monto: 250000,
    tipo: "sesión",
  },
  {
    id: "2",
    fecha: "2026-02-10",
    cliente: "Camila Fox",
    monto: 180000,
    tipo: "producto",
  },
  {
    id: "3",
    fecha: "2026-02-12",
    cliente: "Sofía Luna",
    monto: 320000,
    tipo: "sesión",
  },
  {
    id: "4",
    fecha: "2026-02-13",
    cliente: "Valeria Dream",
    monto: 150000,
    tipo: "producto",
  },
  {
    id: "5",
    fecha: "2026-02-14",
    cliente: "Luna Star",
    monto: 280000,
    tipo: "sesión",
  },
];

type Ingreso = {
  id: string;
  fecha: string; // yyyy-mm-dd
  cliente: string;
  monto: number;
  tipo: "sesión" | "producto" | "suscripción";
};

// ← Configuración colores IGUAL al ejemplo
const chartConfig: ChartConfig = {
  clientesTop: {
    label: "Clientes Top",
    color: "hsl(var(--chart-1))",
  },
  restoClientes: {
    label: "Resto Clientes",
    color: "hsl(var(--chart-4))",
  },
};

const IngresosPage = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>(ingresosIniciales);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ingresoEditando, setIngresoEditando] = useState<Ingreso | null>(null);
  const [periodo, setPeriodo] = useState<"diario" | "semanal" | "mensual">(
    "diario",
  );

  // Datos para gráfico mensual (igual estructura ejemplo)
  const chartData = [
    { month: "Enero", clientesTop: 1860, restoClientes: 800 },
    { month: "Febrero", clientesTop: 2050, restoClientes: 1200 },
    { month: "Marzo", clientesTop: 2370, restoClientes: 1500 },
    { month: "Abril", clientesTop: 1730, restoClientes: 1100 },
    { month: "Mayo", clientesTop: 2090, restoClientes: 1300 },
    { month: "Junio", clientesTop: 2210, restoClientes: 1400 },
  ];

  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const ingresosHoy = ingresos
    .filter((i) => i.fecha === "2026-02-14")
    .reduce((sum, i) => sum + i.monto, 0);

  const handleSaveIngreso = (
    fecha: string,
    cliente: string,
    monto: number,
    tipo: "sesión" | "producto" | "suscripción",
  ) => {
    if (editMode && ingresoEditando) {
      setIngresos(
        ingresos.map((i) =>
          i.id === ingresoEditando.id
            ? { ...i, fecha, cliente, monto, tipo }
            : i,
        ),
      );
    } else {
      setIngresos([
        ...ingresos,
        {
          id: crypto.randomUUID(),
          fecha,
          cliente,
          monto,
          tipo,
        },
      ]);
    }
    setDialogOpen(false);
    setEditMode(false);
    setIngresoEditando(null);
  };

  const handleDeleteIngreso = (id: string) => {
    setIngresos(ingresos.filter((i) => i.id !== id));
  };

  const handleEditIngreso = (ingreso: Ingreso) => {
    setIngresoEditando(ingreso);
    setEditMode(true);
    setDialogOpen(true);
  };

  const clientes = [
    "Luna Star",
    "Camila Fox",
    "Sofía Luna",
    "Valeria Dream",
    "Nuevo Cliente",
  ];

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DollarSign className="h-10 w-10 bg-green-500/10 text-green-500 p-3 rounded-2xl" />
          <div>
            <h1 className="text-3xl font-bold">Ingresos</h1>
            <p className="text-muted-foreground">
              Gestiona tus ingresos diarios, semanales y mensuales
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">📅 Diario</SelectItem>
              <SelectItem value="semanal">📊 Semanal</SelectItem>
              <SelectItem value="mensual">📈 Mensual</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditMode(false);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" /> Nuevo Ingreso
          </Button>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-green-600">
              ${totalIngresos.toLocaleString()}
            </CardTitle>
            <CardDescription>Total General</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-blue-600">
              ${ingresosHoy.toLocaleString()}
            </CardTitle>
            <CardDescription>
              Hoy {new Date().toLocaleDateString("es-CO")}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{ingresos.length}</CardTitle>
            <CardDescription>Total Transacciones</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* GRÁFICO PRINCIPAL - IGUAL AL EJEMPLO */}
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <CardTitle>Ingresos por Clientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full p-8"
              >
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="clientesTop" fill="var(--chart-1)" radius={4} />
                  <Bar
                    dataKey="restoClientes"
                    fill="var(--chart-4)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* TABLA RECIENTES */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Últimos Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ingresos
                  .slice(-5)
                  .reverse()
                  .map((ingreso) => (
                    <div
                      key={ingreso.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted group"
                    >
                      <div>
                        <div className="font-medium">{ingreso.cliente}</div>
                        <div className="text-sm text-muted-foreground">
                          {ingreso.fecha}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          ${ingreso.monto.toLocaleString()}
                        </div>
                        <Badge variant="outline">{ingreso.tipo}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TABLA COMPLETA */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Todos los Ingresos</CardTitle>
            <Button variant="outline" size="sm">
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos.map((ingreso) => (
                <TableRow key={ingreso.id}>
                  <TableCell>{ingreso.fecha}</TableCell>
                  <TableCell>{ingreso.cliente}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ingreso.tipo === "sesión" ? "default" : "secondary"
                      }
                    >
                      {ingreso.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    ${ingreso.monto.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditIngreso(ingreso)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteIngreso(ingreso.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOGO NUEVO/EDITAR */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>
            {editMode ? "Editar Ingreso" : "Nuevo Ingreso"}
          </DialogTitle>
          <IngresoForm
            onSave={handleSaveIngreso}
            clientes={clientes}
            ingresoEditando={ingresoEditando}
            editMode={editMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const IngresoForm = ({ onSave, clientes, ingresoEditando, editMode }: any) => {
  const [fecha, setFecha] = useState(
    ingresoEditando?.fecha || new Date().toISOString().split("T")[0],
  );
  const [cliente, setCliente] = useState(ingresoEditando?.cliente || "");
  const [monto, setMonto] = useState(ingresoEditando?.monto?.toString() || "");
  const [tipo, setTipo] = useState<"sesión" | "producto" | "suscripción">(
    (ingresoEditando?.tipo as any) || "sesión",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fecha, cliente, parseInt(monto), tipo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Fecha</Label>
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Cliente</Label>
        <Select value={cliente} onValueChange={setCliente} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c: string) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Monto ($)</Label>
        <Input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="250000"
          required
        />
      </div>
      <div>
        <Label>Tipo</Label>
        <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sesión">💬 Sesión</SelectItem>
            <SelectItem value="producto">🛍️ Producto</SelectItem>
            <SelectItem value="suscripción">🔄 Suscripción</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {editMode ? "Actualizar" : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            /* reset form */
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default IngresosPage;
