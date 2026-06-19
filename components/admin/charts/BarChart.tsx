"use client";

import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  defaultOptions,
  getColorScheme,
  type BaseChartProps,
  type ChartData,
} from "@/lib/chart-config";

export interface BarChartProps extends BaseChartProps {
  data: ChartData;
  options?: ChartOptions<"bar">;
  horizontal?: boolean;
  stacked?: boolean;
}

export default function BarChart({
  title,
  data,
  options,
  height = 300,
  colorScheme = "primary",
  horizontal = false,
  stacked = false,
  loading = false,
  error,
  className = "",
}: BarChartProps) {
  // Enhance datasets with colors
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colors = getColorScheme(colorScheme);
      const color = dataset.backgroundColor || colors[index % colors.length];
      const borderColor = typeof color === "string" 
        ? color.replace("0.8", "1")
        : color;

      return {
        ...dataset,
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: dataset.borderWidth || 1,
        borderRadius: 4,
        maxBarThickness: 50,
      };
    }),
  };

  const chartOptions: ChartOptions<"bar"> = {
    ...defaultOptions,
    indexAxis: horizontal ? "y" : "x",
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options?.plugins,
      title: title
        ? {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: "600",
              family: "'Geist Sans', sans-serif",
            },
            padding: {
              bottom: 20,
            },
          }
        : undefined,
    },
    scales: {
      ...defaultOptions.scales,
      ...options?.scales,
      x: {
        ...defaultOptions.scales?.x,
        ...options?.scales?.x,
        stacked: stacked,
      },
      y: {
        ...defaultOptions.scales?.y,
        ...options?.scales?.y,
        stacked: stacked,
      },
    },
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow p-6 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-lg shadow p-6 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-red-600">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div style={{ height }}>
        <Bar data={enhancedData} options={chartOptions} />
      </div>
    </div>
  );
}
