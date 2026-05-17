"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { TrendingUp } from "lucide-react";

// Config: series = plataformas
const chartConfig = {
  ingresos: {
    label: "Ingresos",
  },
  plataformaA: {
    label: "Plataforma A",
    color: "var(--chart-1)",
  },
  plataformaB: {
    label: "Plataforma B",
    color: "var(--chart-2)",
  },
  plataformaC: {
    label: "Plataforma C",
    color: "var(--chart-3)",
  },
  plataformaD: {
    label: "Plataforma D",
    color: "var(--chart-4)",
  },
  otras: {
    label: "Otras",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

// 1. 🔄 Renombramos tus datos de prueba para que sean el "Plan B"
const defaultChartData = [
  {
    plataforma: "plataformaA",
    ingresos: 2750,
    fill: "var(--color-plataformaA)",
  },
  {
    plataforma: "plataformaB",
    ingresos: 2000,
    fill: "var(--color-plataformaB)",
  },
  {
    plataforma: "plataformaC",
    ingresos: 2870,
    fill: "var(--color-plataformaC)",
  },
  {
    plataforma: "plataformaD",
    ingresos: 1730,
    fill: "var(--color-plataformaD)",
  },
  { plataforma: "otras", ingresos: 1900, fill: "var(--color-otras)" },
];

// 2. 🚀 CREAMOS LA INTERFAZ PARA ACEPTAR LOS DATOS DE POSTGRESQL
type PieItem = {
  plataforma: string;
  ingresos?: number;
  monto?: number;
  valor?: number;
  fill?: string;
};

interface AppPieChartProps {
  chartData?: PieItem[];
}

// 3. 🧠 LE PASAMOS LA PROPIEDAD AL COMPONENTE
const AppPieChart = ({ chartData }: AppPieChartProps) => {
  // LÓGICA INTELIGENTE: Si llegan datos del backend úsalos, si no, usa el Plan B
  const dataToUse =
    chartData && chartData.length > 0 ? chartData : defaultChartData;

  // Calculamos el total dinámicamente sumando la propiedad "ingresos" (o "monto" / "valor" si viene de la BD)
  const totalIngresos = dataToUse.reduce((acc, curr: PieItem) => {
    const valorItem = curr.ingresos ?? curr.monto ?? curr.valor ?? 0;
    return acc + Number(valorItem);
  }, 0);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Ingresos por plataforma</h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-62.5"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={dataToUse}
            dataKey="ingresos" // ⚠️ OJO: Si tu backend devuelve "monto", cambia esto por "monto"
            nameKey="plataforma" // ⚠️ OJO: Si tu backend devuelve "nombre", cambia esto por "nombre"
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
