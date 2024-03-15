"use client"

import { formatCurrency, formatNumber } from "@/lib/formatters"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type RevenueByProductChartProps = {
  data: {
    name: string
    revenue: number
  }[]
}

export function RevenueByProductChart({ data }: RevenueByProductChartProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <PieChart>
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          formatter={value => formatCurrency(value as number)}
        />
        <Pie
          data={data}
          label={item => item.name}
          dataKey="revenue"
          nameKey="name"
          fill="hsl(var(--primary))"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
