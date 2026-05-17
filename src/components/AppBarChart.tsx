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

interface Ingreso {
  month: string;
  clientesTop: number;
  restoClientes: number;
}

interface AppBarChartProps {
  chartData: Ingreso[];
}

const chartConfig = {
  clientesTop: {
    label: "Ingresos clientes top",
    color: "var(--chart-1)",
  },
  restoClientes: {
    label: "Resto de clientes",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const AppBarChart = ({ chartData }: AppBarChartProps) => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">
        Ingresos mensuales por clientes
      </h1>

      <ChartContainer config={chartConfig} className="min-h-50 w-full">
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

          <Bar dataKey="clientesTop" fill="var(--chart-1)" radius={4} />

          <Bar dataKey="restoClientes" fill="var(--chart-4)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;
