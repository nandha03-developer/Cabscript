// Chart components
export { default as LineChart } from "./LineChart";
export type { LineChartProps } from "./LineChart";

export { default as BarChart } from "./BarChart";
export type { BarChartProps } from "./BarChart";

export { default as PieChart } from "./PieChart";
export type { PieChartProps } from "./PieChart";

export { default as DoughnutChart } from "./DoughnutChart";
export type { DoughnutChartProps } from "./DoughnutChart";

export { default as StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

// Re-export chart utilities from chart-config
export {
  colorSchemes,
  defaultOptions,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getColorScheme,
  getSolidColors,
  getLightColors,
  generateMonthLabels,
  generateDayLabels,
  generateRandomData,
  type ChartColorScheme,
  type ChartDataset,
  type ChartData,
  type BaseChartProps,
} from "@/lib/chart-config";
