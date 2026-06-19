"use client";

import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  defaultOptions,
  getColorScheme,
  type BaseChartProps,
  type ChartData,
} from "@/lib/chart-config";

export interface DoughnutChartProps extends BaseChartProps {
  data: ChartData;
  options?: ChartOptions<"doughnut">;
  showPercentage?: boolean;
  centerText?: string;
  centerValue?: string;
}

export default function DoughnutChart({
  title,
  data,
  options,
  height = 300,
  colorScheme = "mixed",
  showPercentage = true,
  centerText,
  centerValue,
  loading = false,
  error,
  className = "",
}: DoughnutChartProps) {
  // Calculate total for percentages
  const total = data.datasets[0]?.data.reduce((sum, val) => sum + val, 0) || 0;

  // Enhance datasets with colors
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => {
      const colors = getColorScheme(colorScheme);

      return {
        ...dataset,
        backgroundColor: dataset.backgroundColor || colors,
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 10,
      };
    }),
  };

  const chartOptions: ChartOptions<"doughnut"> = {
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
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        ...options?.plugins?.tooltip,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            
            if (showPercentage) {
              return `${label}: ${value} (${percentage}%)`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "70%", // Makes it a doughnut vs pie
    scales: undefined, // Doughnut charts don't use scales
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
      <div style={{ height }} className="relative flex items-center justify-center">
        <Doughnut data={enhancedData} options={chartOptions} />
        
        {/* Center text overlay */}
        {(centerText || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue && (
              <div className="text-2xl font-bold text-gray-900">{centerValue}</div>
            )}
            {centerText && (
              <div className="text-sm text-gray-600">{centerText}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
