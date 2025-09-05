import {
  Area,
  AreaChart as AreaChartComponent,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatAmount } from "@/utils";

export interface AreaChartProps {
  dailyData: {
    date: string;
    expenses: number;
    income: number;
  }[];
}

export function AreaChart({ dailyData }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChartComponent data={dailyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => formatAmount(Number(value))} />
        <Area
          type="monotone"
          dataKey="income"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="2"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.6}
        />
      </AreaChartComponent>
    </ResponsiveContainer>
  );
}
