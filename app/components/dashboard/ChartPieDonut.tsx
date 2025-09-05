"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  food: {
    label: "Food",
    color: "var(--chart-1)",
  },
  shopping: {
    label: "Shopping",
    color: "var(--chart-2)",
  },
  house: {
    label: "House",
    color: "var(--chart-3)",
  },
  vehicle: {
    label: "Vehicle",
    color: "var(--chart-4)",
  },
  life_entertainment: {
    label: "Life & Entertainment",
    color: "var(--chart-5)",
  },
  communication_pc: {
    label: "Communication & PC",
    color: "var(--chart-6)",
  },
  financial_expenses: {
    label: "Financial Expenses",
    color: "var(--chart-7)",
  },
  health: {
    label: "Health",
    color: "var(--chart-8)",
  },
  sports: {
    label: "Sports",
    color: "var(--chart-9)",
  },
  fitness: {
    label: "Fitness",
    color: "var(--chart-10)",
  },
  wellness: {
    label: "Wellness",
    color: "var(--chart-11)",
  },
  income: {
    label: "Income",
    color: "var(--chart-12)",
  },
  others: {
    label: "Others",
    color: "var(--chart-13)",
  },
  refund: {
    label: "Refund",
    color: "var(--chart-14)",
  },
} satisfies ChartConfig;

interface ChartPieDonutProps {
  chartData: Array<{
    category: string;
    amount: number;
  }>;
}

export function PieChartDonut({ chartData }: ChartPieDonutProps) {
  const dataWithColors = chartData.map((item) => ({
    ...item,
    fill:
      chartConfig[item.category as keyof typeof chartConfig].color ||
      "var(--chart-1)",
  }));

  return (
    <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
        <Pie
          data={dataWithColors}
          dataKey="amount"
          nameKey="category"
          innerRadius={40}
        />
      </PieChart>
    </ChartContainer>
  );
}
