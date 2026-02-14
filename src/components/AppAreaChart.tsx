"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  clientesTop: {  // ← Cambió de modelosTop
    label: "Clientes top",
    color: "var(--chart-2)",
  },
  restoClientes: {  // ← Cambió de restoModelos
    label: "Resto de clientes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Datos de ejemplo: ingresos por mes - CAMBIADO
const chartData = [
  { month: "Enero", clientesTop: 1860, restoClientes: 800 },   // ← Cambió
  { month: "Febrero", clientesTop: 3050, restoClientes: 2000 },
  { month: "Marzo", clientesTop: 2370, restoClientes: 1200 },
  { month: "Abril", clientesTop: 1730, restoClientes: 1900 },
  { month: "Mayo", clientesTop: 2090, restoClientes: 1300 },
  { month: "Junio", clientesTop: 2140, restoClientes: 1400 },
];

const AppAreaChart = () => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Evolución de ingresos</h1>  {/* ← Ya era genérico */}
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart accessibilityLayer data={chartData}>
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
          <defs>
            <linearGradient id="fillTop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-clientesTop)"  // ← Cambió
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-clientesTop)"  // ← Cambió
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillResto" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-restoClientes)"  // ← Cambió
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-restoClientes)"  // ← Cambió
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="restoClientes"  // ← Cambió
            type="natural"
            fill="url(#fillResto)"
            fillOpacity={0.4}
            stroke="var(--color-restoClientes)"  // ← Cambió
            stackId="a"
          />
          <Area
            dataKey="clientesTop"  // ← Cambió
            type="natural"
            fill="url(#fillTop)"
            fillOpacity={0.4}
            stroke="var(--color-clientesTop)"  // ← Cambió
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppAreaChart;
