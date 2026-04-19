"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner"; // Agregado para notificaciones

import * as XLSX from "xlsx";

// Tipos adaptados al Backend de FastAPI
type Ingreso = {
  id: number;
  fecha: string; // yyyy-mm-dd
  cliente_id: number;
  monto: number;
  descripcion?: string;
  metodo_pago: "efectivo" | "transferencia" | "tarjeta";
  estado: "pagado" | "pendiente";
};

type Cliente = {
  id: number;
  nombre: string;
};

const API_URL = "http://localhost:8000/ingresos/";

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
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ingresoEditando, setIngresoEditando] = useState<Ingreso | null>(null);
  const [periodo, setPeriodo] = useState<"diario" | "semanal" | "mensual">(
    "diario",
  );

  const handleExportExcel = () => {
    if (ingresos.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    // 1. Preparamos los datos limpios para el Excel
    const datosExportar = ingresos.map((ingreso) => ({
      Fecha: ingreso.fecha,
      Cliente: getNombreCliente(ingreso.cliente_id),
      "Método de Pago": ingreso.metodo_pago,
      Estado: ingreso.estado,
      Descripción: ingreso.descripcion || "Sin descripción",
      "Monto ($)": Number(ingreso.monto),
    }));

    // 2. Creamos la hoja y el libro de Excel
    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Ingresos");

    // 3. Generamos y descargamos el archivo
    XLSX.writeFile(libro, "Reporte_Ingresos_CAMCOAH.xlsx");
    toast.success("Excel descargado correctamente");
  };
  // Fetch a la API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resIngresos = await fetch(API_URL, { credentials: "include" });
        if (resIngresos.ok) setIngresos(await resIngresos.json());

        const resClientes = await fetch("http://localhost:8000/clientes/", {
          credentials: "include",
        });
        if (resClientes.ok) setClientes(await resClientes.json());
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        toast.error("Error al cargar los datos del servidor");
      }
    };
    cargarDatos();
  }, []);

  // Función para obtener nombre del cliente por ID
  const getNombreCliente = (id: number) => {
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.nombre : "Desconocido";
  };

  // Cálculos dinámicos
  const hoy = new Date().toISOString().split("T")[0];
  const totalIngresos = ingresos
    .filter((i) => i.estado === "pagado")
    .reduce((sum, i) => sum + Number(i.monto), 0);
  const ingresosHoy = ingresos
    .filter((i) => i.fecha === hoy && i.estado === "pagado")
    .reduce((sum, i) => sum + Number(i.monto), 0);

  // Gráfico (Datos estáticos de ejemplo por ahora, se puede dinamizar luego)
  const chartData = [
    { month: "Enero", clientesTop: 1860, restoClientes: 800 },
    { month: "Febrero", clientesTop: 2050, restoClientes: 1200 },
    { month: "Marzo", clientesTop: 2370, restoClientes: 1500 },
    { month: "Abril", clientesTop: 1730, restoClientes: 1100 },
    { month: "Mayo", clientesTop: 2090, restoClientes: 1300 },
    { month: "Junio", clientesTop: 2210, restoClientes: 1400 },
  ];

  const handleSaveIngreso = async (
    fecha: string,
    cliente_id: number,
    monto: number,
    metodo_pago: "efectivo" | "transferencia" | "tarjeta",
    estado: "pagado" | "pendiente",
    descripcion: string,
  ) => {
    const datosIngreso = {
      fecha,
      cliente_id,
      monto,
      metodo_pago,
      estado,
      descripcion,
    };

    try {
      const url =
        editMode && ingresoEditando
          ? `${API_URL}${ingresoEditando.id}`
          : API_URL;
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosIngreso),
        credentials: "include",
      });

      if (response.ok) {
        const ingresoServidor = await response.json();
        setIngresos(
          editMode
            ? ingresos.map((i) =>
                i.id === ingresoServidor.id ? ingresoServidor : i,
              )
            : [ingresoServidor, ...ingresos],
        );
        toast.success(editMode ? "Ingreso actualizado" : "Ingreso registrado");
      } else {
        toast.error("Error al guardar");
      }
    } catch {
      toast.error("Error de conexión");
    }

    setDialogOpen(false);
    setEditMode(false);
    setIngresoEditando(null);
  };

  const handleDeleteIngreso = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setIngresos(ingresos.filter((i) => i.id !== id));
        toast.success("Registro eliminado");
      }
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleEditIngreso = (ingreso: Ingreso) => {
    setIngresoEditando(ingreso);
    setEditMode(true);
    setDialogOpen(true);
  };

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
              setIngresoEditando(null);
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
              ${totalIngresos.toLocaleString("es-CO")}
            </CardTitle>
            <CardDescription>Total General (Pagado)</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-blue-600">
              ${ingresosHoy.toLocaleString("es-CO")}
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
        {/* GRÁFICO PRINCIPAL */}
        <div className="lg:col-span-2">
          <Card className="h-125">
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
                {ingresos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay ingresos registrados
                  </p>
                ) : (
                  [...ingresos]
                    .reverse()
                    .slice(0, 5)
                    .map((ingreso) => (
                      <div
                        key={ingreso.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted group transition-colors"
                      >
                        <div>
                          <div className="font-medium">
                            {getNombreCliente(ingreso.cliente_id)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ingreso.fecha} | {ingreso.metodo_pago}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-green-600">
                            ${Number(ingreso.monto).toLocaleString("es-CO")}
                          </div>
                          <Badge
                            variant={
                              ingreso.estado === "pagado"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              ingreso.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                          >
                            {ingreso.estado}
                          </Badge>
                        </div>
                      </div>
                    ))
                )}
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
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
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
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos.map((ingreso) => (
                <TableRow key={ingreso.id}>
                  <TableCell>{ingreso.fecha}</TableCell>
                  <TableCell className="font-medium">
                    {getNombreCliente(ingreso.cliente_id)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {ingreso.metodo_pago}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ingreso.estado === "pagado" ? "default" : "secondary"
                      }
                    >
                      {ingreso.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    ${Number(ingreso.monto).toLocaleString("es-CO")}
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
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// COMPONENTE DE FORMULARIO
const IngresoForm = ({
  onSave,
  clientes,
  ingresoEditando,
  editMode,
  onCancel,
}: any) => {
  const [fecha, setFecha] = useState(
    ingresoEditando?.fecha || new Date().toISOString().split("T")[0],
  );
  const [clienteId, setClienteId] = useState(
    ingresoEditando?.cliente_id?.toString() || "",
  );
  const [monto, setMonto] = useState(ingresoEditando?.monto?.toString() || "");
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "transferencia" | "tarjeta"
  >(ingresoEditando?.metodo_pago || "efectivo");
  const [estado, setEstado] = useState<"pagado" | "pendiente">(
    ingresoEditando?.estado || "pagado",
  );
  const [descripcion, setDescripcion] = useState(
    ingresoEditando?.descripcion || "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      fecha,
      Number(clienteId),
      Number(monto),
      metodoPago,
      estado,
      descripcion,
    );
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
        <Select value={clienteId} onValueChange={setClienteId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c: Cliente) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.nombre}
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
          placeholder="Ej. 250000"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Método de Pago</Label>
          <Select
            value={metodoPago}
            onValueChange={(v: any) => setMetodoPago(v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">💵 Efectivo</SelectItem>
              <SelectItem value="transferencia">🏦 Transferencia</SelectItem>
              <SelectItem value="tarjeta">💳 Tarjeta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Estado</Label>
          <Select value={estado} onValueChange={(v: any) => setEstado(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pagado">✅ Pagado</SelectItem>
              <SelectItem value="pendiente">⏳ Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Descripción (Opcional)</Label>
        <Input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Concepto del ingreso..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {editMode ? "Actualizar" : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default IngresosPage;
