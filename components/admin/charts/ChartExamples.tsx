"use client";

import { useState } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import DoughnutChart from "./DoughnutChart";
import StatCard from "./StatCard";
import {
  generateMonthLabels,
  generateDayLabels,
  generateRandomData,
} from "@/lib/chart-config";

/**
 * Example 1: Revenue Line Chart with Multiple Datasets
 */
function RevenueLineChartExample() {
  const data = {
    labels: generateMonthLabels(),
    datasets: [
      {
        label: "2024 Revenue",
        data: [45000, 52000, 48000, 61000, 58000, 65000, 72000, 69000, 78000, 82000, 88000, 95000],
      },
      {
        label: "2023 Revenue",
        data: [38000, 42000, 41000, 49000, 47000, 52000, 55000, 58000, 61000, 64000, 68000, 72000],
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Monthly Revenue Comparison</h3>
      <LineChart
        title="Revenue Trend"
        data={data}
        colorScheme="primary"
        showArea={true}
        height={350}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed.y ?? 0;
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  return "$" + (Number(value) / 1000) + "K";
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

/**
 * Example 2: Customer Growth Bar Chart
 */
function CustomerBarChartExample() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Customers",
        data: [120, 195, 142, 218, 167, 245],
      },
      {
        label: "Returning Customers",
        data: [340, 389, 412, 468, 501, 587],
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
      <BarChart
        title="New vs Returning Customers"
        data={data}
        colorScheme="success"
        height={350}
        stacked={false}
      />
    </div>
  );
}

/**
 * Example 3: Support Tickets Horizontal Bar Chart
 */
function SupportTicketsBarExample() {
  const data = {
    labels: ["Critical", "High Priority", "Medium Priority", "Low Priority", "Info"],
    datasets: [
      {
        label: "Open Tickets",
        data: [12, 45, 78, 132, 89],
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Support Tickets by Priority</h3>
      <BarChart
        title="Ticket Distribution"
        data={data}
        colorScheme="warning"
        horizontal={true}
        height={300}
      />
    </div>
  );
}

/**
 * Example 4: Order Status Pie Chart
 */
function OrderStatusPieExample() {
  const data = {
    labels: ["Completed", "In Progress", "Pending", "Cancelled", "Refunded"],
    datasets: [
      {
        label: "Orders",
        data: [458, 142, 89, 34, 18],
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
      <PieChart
        title="Order Distribution"
        data={data}
        colorScheme="mixed"
        height={350}
        showPercentage={true}
      />
    </div>
  );
}

/**
 * Example 5: Customer Satisfaction Doughnut Chart
 */
function CustomerSatisfactionDoughnutExample() {
  const data = {
    labels: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"],
    datasets: [
      {
        label: "Responses",
        data: [342, 289, 67, 23],
      },
    ],
  };

  const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
      <DoughnutChart
        title="Satisfaction Ratings"
        data={data}
        colorScheme="success"
        height={350}
        showPercentage={true}
        centerValue={total.toString()}
        centerText="Total Responses"
      />
    </div>
  );
}

/**
 * Example 6: Dashboard Statistics Cards
 */
function DashboardStatsExample() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={847650}
          format="currency"
          colorScheme="primary"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          trend={{
            value: 12.5,
            isPositive: true,
            label: "vs last month",
          }}
        />

        <StatCard
          title="Active Customers"
          value={2847}
          format="number"
          colorScheme="success"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          trend={{
            value: 8.2,
            isPositive: true,
            label: "vs last month",
          }}
        />

        <StatCard
          title="Conversion Rate"
          value={0.342}
          format="percentage"
          colorScheme="info"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          trend={{
            value: 2.1,
            isPositive: true,
            label: "vs last month",
          }}
        />

        <StatCard
          title="Open Tickets"
          value={124}
          format="number"
          colorScheme="warning"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          }
          trend={{
            value: 15.3,
            isPositive: false,
            label: "vs last month",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Example 7: Loading States
 */
function LoadingStatesExample() {
  const [loading, setLoading] = useState(true);

  const dummyData = {
    labels: generateDayLabels(),
    datasets: [
      {
        label: "Sample Data",
        data: generateRandomData(7, 100, 500),
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Loading & Error States</h3>
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setLoading(!loading)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Toggle Loading State
          </button>
          <LineChart
            title="Chart with Loading State"
            data={dummyData}
            loading={loading}
            height={250}
          />
        </div>

        <div>
          <BarChart
            title="Chart with Error State"
            data={dummyData}
            error="Failed to load data. Please try again."
            height={250}
          />
        </div>

        <StatCard
          title="Loading Stat Card"
          value={0}
          loading={true}
        />
      </div>
    </div>
  );
}

/**
 * Main Examples Component
 */
export default function ChartExamples() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Chart Components Examples</h1>
        <p className="text-gray-600">
          Comprehensive examples demonstrating all chart components with real-world use cases
        </p>
      </div>

      <RevenueLineChartExample />
      
      <CustomerBarChartExample />
      
      <SupportTicketsBarExample />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderStatusPieExample />
        <CustomerSatisfactionDoughnutExample />
      </div>
      
      <DashboardStatsExample />
      
      <LoadingStatesExample />
    </div>
  );
}
