"use client";

import { ReactNode } from "react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/chart-config";

export interface StatCardProps {
  title: string;
  value: string | number;
  format?: "currency" | "number" | "percentage" | "none";
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info" | "purple";
  loading?: boolean;
  className?: string;
}

const colorClasses = {
  primary: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    trend: "text-blue-600",
  },
  success: {
    bg: "bg-green-50",
    icon: "text-green-600",
    trend: "text-green-600",
  },
  warning: {
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
    trend: "text-yellow-600",
  },
  danger: {
    bg: "bg-red-50",
    icon: "text-red-600",
    trend: "text-red-600",
  },
  info: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    trend: "text-cyan-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    trend: "text-purple-600",
  },
};

export default function StatCard({
  title,
  value,
  format = "none",
  icon,
  trend,
  colorScheme = "primary",
  loading = false,
  className = "",
}: StatCardProps) {
  // Format value based on format type
  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "number":
        return formatNumber(val);
      case "percentage":
        return formatPercentage(val);
      default:
        return val.toString();
    }
  };

  const colors = colorClasses[colorScheme];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className={`h-10 w-10 ${colors.bg} rounded-lg`}></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && (
          <div className={`${colors.bg} p-2 rounded-lg ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
      </div>

      {trend && (
        <div className="flex items-center text-sm">
          <span
            className={`flex items-center ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {formatPercentage(Math.abs(trend.value))}
          </span>
          {trend.label && (
            <span className="ml-2 text-gray-600">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
