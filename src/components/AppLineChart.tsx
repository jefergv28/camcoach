"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

const chartData = [
  { month: "Enero", ingresos: 1800, horas: 120 },
  { month: "Febrero", ingresos: 2100, horas: 135 },
  { month: "Marzo", ingresos: 2500, horas: 150 },
  { month: "Abril", ingresos: 1900, horas: 110 },
  { month: "Mayo", ingresos: 2300, horas: 140 },
  { month: "Junio", ingresos: 2600, horas: 160 },
];

const chartConfig = {
  ingresos: {
    label: "Ingresos (USD)",
    color: "#FF3B7F", // fucsia CamCoach
  },
  horas: {
    label: "Horas conectadas",
    color: "#3498DB", // azul de apoyo
  },
} satisfies ChartConfig;

const AppLineChart = () => {
  return (
    <ChartContainer config={chartConfig} className="mt-6">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="ingresos"
          type="monotone"
          stroke="var(--color-ingresos)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="horas"
          type="monotone"
          stroke="var(--color-horas)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default AppLineChart;
