"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// 1. TIPADO ESTRICTO
export interface AreaChartItem {
  month?: string;
  clientesTop?: number;
  restoClientes?: number;
  fecha?: string;
  montoTop?: number;
  montoResto?: number;
}

interface AppAreaChartProps {
  chartData?: AreaChartItem[];
}

// Configuración del gráfico
const chartConfig = {
  clientesTop: {
    label: "Clientes top",
    color: "var(--chart-2)",
  },
  restoClientes: {
    label: "Resto de clientes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// 2. DATOS DE PRUEBA CORREGIDOS (FIX ERROR CRÍTICO)
const defaultChartData: AreaChartItem[] = [
  { month: "Enero", clientesTop: 1860, restoClientes: 800 },
  { month: "Febrero", clientesTop: 3050, restoClientes: 2000 },
  { month: "Marzo", clientesTop: 2370, restoClientes: 1200 },

  // ❌ FIX: antes tenías { 1730: 2000 } (esto rompía TS)
  { month: "Abril", clientesTop: 1730, restoClientes: 1900 },

  { month: "Mayo", clientesTop: 2090, restoClientes: 1300 },
  { month: "Junio", clientesTop: 2140, restoClientes: 1400 },
];

// 3. COMPONENTE
const AppAreaChart = ({ chartData }: AppAreaChartProps) => {
  const dataToUse: AreaChartItem[] =
    chartData && chartData.length > 0
      ? chartData.map((item) => ({
          month: item.month || item.fecha || "S/M",
          clientesTop: Number(item.clientesTop ?? item.montoTop ?? 0),
          restoClientes: Number(item.restoClientes ?? item.montoResto ?? 0),
        }))
      : defaultChartData;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Evolución de ingresos</h1>

      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <AreaChart accessibilityLayer data={dataToUse}>
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 3)}
          />

          <YAxis tickLine={false} tickMargin={10} axisLine={false} />

          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <defs>
            <linearGradient id="fillTop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-clientesTop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-clientesTop)"
                stopOpacity={0.1}
              />
            </linearGradient>

            <linearGradient id="fillResto" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-restoClientes)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-restoClientes)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <Area
            dataKey="restoClientes"
            type="natural"
            fill="url(#fillResto)"
            fillOpacity={0.4}
            stroke="var(--color-restoClientes)"
            stackId="a"
          />

          <Area
            dataKey="clientesTop"
            type="natural"
            fill="url(#fillTop)"
            fillOpacity={0.4}
            stroke="var(--color-clientesTop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppAreaChart;
