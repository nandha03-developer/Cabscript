"use client";

import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  defaultOptions,
  getColorScheme,
  getLightColors,
  type BaseChartProps,
  type ChartData,
} from "@/lib/chart-config";

export interface LineChartProps extends BaseChartProps {
  data: ChartData;
  options?: ChartOptions<"line">;
  showArea?: boolean;
  smooth?: boolean;
  showPoints?: boolean;
}

export default function LineChart({
  title,
  data,
  options,
  height = 300,
  colorScheme = "primary",
  showArea = false,
  smooth = true,
  showPoints = true,
  loading = false,
  error,
  className = "",
}: LineChartProps) {
  // Enhance datasets with colors and styling
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colors = getColorScheme(colorScheme);
      const lightColors = getLightColors(colorScheme);
      const color = dataset.borderColor || colors[index % colors.length];
      const bgColor = dataset.backgroundColor || (showArea ? lightColors[index % lightColors.length] : color);

      return {
        ...dataset,
        borderColor: color,
        backgroundColor: bgColor,
        borderWidth: dataset.borderWidth || 2,
        fill: showArea,
        tension: smooth ? 0.4 : 0,
        pointRadius: showPoints ? 3 : 0,
        pointHoverRadius: showPoints ? 5 : 0,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      };
    }),
  };

  const chartOptions: ChartOptions<"line"> = {
    ...defaultOptions,
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
        <Line data={enhancedData} options={chartOptions} />
      </div>
    </div>
  );
}
