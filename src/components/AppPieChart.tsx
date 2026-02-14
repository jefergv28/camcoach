"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { TrendingUp } from "lucide-react";

// Config: series = plataformas - CAMBIADO a genéricas
const chartConfig = {
  ingresos: {
    label: "Ingresos",
  },
  plataformaA: {  // ← Cambió Chaturbate
    label: "Plataforma A",
    color: "var(--chart-1)",
  },
  plataformaB: {  // ← Cambió Stripchat
    label: "Plataforma B",
    color: "var(--chart-2)",
  },
  plataformaC: {  // ← Cambió OnlyFans
    label: "Plataforma C",
    color: "var(--chart-3)",
  },
  plataformaD: {  // ← Cambió Streamate
    label: "Plataforma D",
    color: "var(--chart-4)",
  },
  otras: {
    label: "Otras",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

// Datos de ejemplo (luego los traes del backend) - CAMBIADO
const chartData = [
  { plataforma: "plataformaA", ingresos: 2750, fill: "var(--color-plataformaA)" },  // ← Cambió
  { plataforma: "plataformaB", ingresos: 2000, fill: "var(--color-plataformaB)" },  // ← Cambió
  { plataforma: "plataformaC", ingresos: 2870, fill: "var(--color-plataformaC)" },  // ← Cambió
  { plataforma: "plataformaD", ingresos: 1730, fill: "var(--color-plataformaD)" },  // ← Cambió
  { plataforma: "otras", ingresos: 1900, fill: "var(--color-otras)" },
];

const AppPieChart = () => {
  const totalIngresos = chartData.reduce((acc, curr) => acc + curr.ingresos, 0);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">
        Ingresos por plataforma  {/* ← Se queda igual (genérico) */}
      </h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="ingresos"
            nameKey="plataforma"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalIngresos.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Ingresos totales
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Subiendo un 5.2% este mes
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ingresos totales de los últimos 6 meses
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;
