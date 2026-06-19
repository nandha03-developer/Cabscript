/**
 * Chart.js Configuration and Utilities
 * 
 * This file provides common Chart.js configurations, color schemes,
 * and utility functions for all chart components.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ============================================
// Color Schemes
// ============================================

export const colorSchemes = {
  primary: [
    "rgba(59, 130, 246, 0.8)",   // blue-500
    "rgba(96, 165, 250, 0.8)",   // blue-400
    "rgba(37, 99, 235, 0.8)",    // blue-600
    "rgba(147, 197, 253, 0.8)",  // blue-300
    "rgba(29, 78, 216, 0.8)",    // blue-700
  ],
  
  success: [
    "rgba(34, 197, 94, 0.8)",    // green-500
    "rgba(74, 222, 128, 0.8)",   // green-400
    "rgba(22, 163, 74, 0.8)",    // green-600
    "rgba(134, 239, 172, 0.8)",  // green-300
    "rgba(21, 128, 61, 0.8)",    // green-700
  ],
  
  warning: [
    "rgba(234, 179, 8, 0.8)",    // yellow-500
    "rgba(250, 204, 21, 0.8)",   // yellow-400
    "rgba(202, 138, 4, 0.8)",    // yellow-600
    "rgba(253, 224, 71, 0.8)",   // yellow-300
    "rgba(161, 98, 7, 0.8)",     // yellow-700
  ],
  
  danger: [
    "rgba(239, 68, 68, 0.8)",    // red-500
    "rgba(248, 113, 113, 0.8)",  // red-400
    "rgba(220, 38, 38, 0.8)",    // red-600
    "rgba(252, 165, 165, 0.8)",  // red-300
    "rgba(185, 28, 28, 0.8)",    // red-700
  ],
  
  info: [
    "rgba(14, 165, 233, 0.8)",   // sky-500
    "rgba(56, 189, 248, 0.8)",   // sky-400
    "rgba(2, 132, 199, 0.8)",    // sky-600
    "rgba(125, 211, 252, 0.8)",  // sky-300
    "rgba(3, 105, 161, 0.8)",    // sky-700
  ],
  
  purple: [
    "rgba(168, 85, 247, 0.8)",   // purple-500
    "rgba(192, 132, 252, 0.8)",  // purple-400
    "rgba(147, 51, 234, 0.8)",   // purple-600
    "rgba(216, 180, 254, 0.8)",  // purple-300
    "rgba(126, 34, 206, 0.8)",   // purple-700
  ],
  
  mixed: [
    "rgba(59, 130, 246, 0.8)",   // blue
    "rgba(34, 197, 94, 0.8)",    // green
    "rgba(234, 179, 8, 0.8)",    // yellow
    "rgba(239, 68, 68, 0.8)",    // red
    "rgba(168, 85, 247, 0.8)",   // purple
    "rgba(14, 165, 233, 0.8)",   // sky
    "rgba(236, 72, 153, 0.8)",   // pink
    "rgba(251, 146, 60, 0.8)",   // orange
  ],
};

// Solid versions (opacity 1.0)
export const solidColors = {
  primary: colorSchemes.primary.map(c => c.replace("0.8", "1")),
  success: colorSchemes.success.map(c => c.replace("0.8", "1")),
  warning: colorSchemes.warning.map(c => c.replace("0.8", "1")),
  danger: colorSchemes.danger.map(c => c.replace("0.8", "1")),
  info: colorSchemes.info.map(c => c.replace("0.8", "1")),
  purple: colorSchemes.purple.map(c => c.replace("0.8", "1")),
  mixed: colorSchemes.mixed.map(c => c.replace("0.8", "1")),
};

// Light versions (opacity 0.2)
export const lightColors = {
  primary: colorSchemes.primary.map(c => c.replace("0.8", "0.2")),
  success: colorSchemes.success.map(c => c.replace("0.8", "0.2")),
  warning: colorSchemes.warning.map(c => c.replace("0.8", "0.2")),
  danger: colorSchemes.danger.map(c => c.replace("0.8", "0.2")),
  info: colorSchemes.info.map(c => c.replace("0.8", "0.2")),
  purple: colorSchemes.purple.map(c => c.replace("0.8", "0.2")),
  mixed: colorSchemes.mixed.map(c => c.replace("0.8", "0.2")),
};

// ============================================
// Default Chart Options
// ============================================

export const defaultOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          family: "'Geist Sans', sans-serif",
          size: 12,
        },
        padding: 15,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 13,
        family: "'Geist Sans', sans-serif",
      },
      bodyFont: {
        size: 12,
        family: "'Geist Sans', sans-serif",
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
          family: "'Geist Sans', sans-serif",
        },
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
          family: "'Geist Sans', sans-serif",
        },
      },
    },
  },
};

// ============================================
// Utility Functions
// ============================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getColorScheme(scheme: keyof typeof colorSchemes = "primary"): string[] {
  return colorSchemes[scheme] || colorSchemes.primary;
}

export function getSolidColors(scheme: keyof typeof solidColors = "primary"): string[] {
  return solidColors[scheme] || solidColors.primary;
}

export function getLightColors(scheme: keyof typeof lightColors = "primary"): string[] {
  return lightColors[scheme] || lightColors.primary;
}

// ============================================
// Chart Data Generators (for testing/demo)
// ============================================

export function generateMonthLabels(count: number = 12): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result: string[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(months[date.getMonth()]);
  }
  
  return result;
}

export function generateDayLabels(count: number = 7): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: string[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    result.push(days[date.getDay()]);
  }
  
  return result;
}

export function generateRandomData(count: number, min: number = 0, max: number = 100): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// ============================================
// Chart Type Definitions
// ============================================

export type ChartColorScheme = keyof typeof colorSchemes;

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
  borderRadius?: number;
  maxBarThickness?: number;
  hoverOffset?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface BaseChartProps {
  title?: string;
  height?: number | string;
  colorScheme?: ChartColorScheme;
  loading?: boolean;
  error?: string;
  className?: string;
}
