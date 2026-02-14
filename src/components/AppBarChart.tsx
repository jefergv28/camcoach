"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Configuración de series (leyenda y colores) - CAMBIADO
const chartConfig = {
  clientesTop: {
    // ← Cambió de modelosTop
    label: "Ingresos clientes top", // ← Cambió
    color: "var(--chart-1)",
  },
  restoClientes: {
    // ← Cambió de restoModelos
    label: "Resto de clientes", // ← Cambió
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

// Datos de ejemplo (luego los reemplazas por datos reales del backend) - CAMBIADO
const chartData = [
  { month: "Enero", clientesTop: 1860, restoClientes: 800 }, // ← Cambió
  { month: "Febrero", clientesTop: 2050, restoClientes: 1200 },
  { month: "Marzo", clientesTop: 2370, restoClientes: 1500 },
  { month: "Abril", clientesTop: 1730, restoClientes: 1100 },
  { month: "Mayo", clientesTop: 2090, restoClientes: 1300 },
  { month: "Junio", clientesTop: 2210, restoClientes: 1400 },
];

const AppBarChart = () => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">
        Ingresos mensuales por clientes {/* ← Cambió de "modelos" */}
      </h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="clientesTop" fill="var(--chart-1)" radius={4} />{" "}
          {/* ← Cambió */}
          <Bar dataKey="restoClientes" fill="var(--chart-4)" radius={4} />{" "}
          {/* ← Cambió */}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;
