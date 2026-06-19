"use client";

import { useState, useEffect } from 'react';
import { FaBolt, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

interface MetricStats {
  count: number;
  avg: number;
  median: number;
  p75: number;
  p90: number;
  p95: number;
  min: number;
  max: number;
  good: number;
  needsImprovement: number;
  poor: number;
}

interface WebVitalsData {
  LCP: MetricStats | null;
  FID: MetricStats | null;
  CLS: MetricStats | null;
  FCP: MetricStats | null;
  TTFB: MetricStats | null;
  INP: MetricStats | null;
}

export default function PerformanceDashboard() {
  const [data, setData] = useState<WebVitalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/web-vitals?days=${period}`);
      const result = await response.json();
      setData(result.stats);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
          <p className="text-gray-600 mt-1">Core Web Vitals metrics from real users</p>
        </div>
        
        {/* Period selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          name="LCP"
          title="Largest Contentful Paint"
          data={data?.LCP || null}
          threshold={{ good: 2500, poor: 4000 }}
          unit="ms"
          description="Loading performance"
        />
        <MetricCard
          name="FID"
          title="First Input Delay"
          data={data?.FID || null}
          threshold={{ good: 100, poor: 300 }}
          unit="ms"
          description="Interactivity"
        />
        <MetricCard
          name="CLS"
          title="Cumulative Layout Shift"
          data={data?.CLS || null}
          threshold={{ good: 0.1, poor: 0.25 }}
          unit=""
          description="Visual stability"
        />
        <MetricCard
          name="FCP"
          title="First Contentful Paint"
          data={data?.FCP || null}
          threshold={{ good: 1800, poor: 3000 }}
          unit="ms"
          description="First paint time"
        />
        <MetricCard
          name="TTFB"
          title="Time to First Byte"
          data={data?.TTFB || null}
          threshold={{ good: 600, poor: 1800 }}
          unit="ms"
          description="Server response time"
        />
        <MetricCard
          name="INP"
          title="Interaction to Next Paint"
          data={data?.INP || null}
          threshold={{ good: 200, poor: 500 }}
          unit="ms"
          description="Responsiveness"
        />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={<FaCheckCircle className="text-green-500" />}
            label="Good Metrics"
            value={calculateTotalGood(data)}
            color="green"
          />
          <SummaryCard
            icon={<FaClock className="text-yellow-500" />}
            label="Needs Improvement"
            value={calculateTotalNeedsImprovement(data)}
            color="yellow"
          />
          <SummaryCard
            icon={<FaExclamationTriangle className="text-red-500" />}
            label="Poor Metrics"
            value={calculateTotalPoor(data)}
            color="red"
          />
        </div>
      </div>

      {/* Recommendations */}
      <PerformanceRecommendations data={data} />
    </div>
  );
}

interface MetricCardProps {
  name: string;
  title: string;
  data: MetricStats | null;
  threshold: { good: number; poor: number };
  unit: string;
  description: string;
}

function MetricCard({ name, title, data, threshold, unit, description }: MetricCardProps) {
  if (!data || data.count === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
          <FaBolt className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const score = getScore(data);
  const scoreColor = score === 'good' ? 'green' : score === 'needs-improvement' ? 'yellow' : 'red';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
        <FaBolt className={`text-${scoreColor}-500`} />
      </div>

      {/* Main metric */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatMetric(data.p75, name)}{unit}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Distribution bars */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-gray-600">Distribution:</span>
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
          <div
            className="bg-green-500"
            style={{ width: `${(data.good / data.count) * 100}%` }}
          />
          <div
            className="bg-yellow-500"
            style={{ width: `${(data.needsImprovement / data.count) * 100}%` }}
          />
          <div
            className="bg-red-500"
            style={{ width: `${(data.poor / data.count) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-gray-600">P75</div>
          <div className="font-semibold">{formatMetric(data.p75, name)}{unit}</div>
        </div>
        <div>
          <div className="text-gray-600">P90</div>
          <div className="font-semibold">{formatMetric(data.p90, name)}{unit}</div>
        </div>
        <div>
          <div className="text-gray-600">P95</div>
          <div className="font-semibold">{formatMetric(data.p95, name)}{unit}</div>
        </div>
      </div>

      {/* Sample count */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Based on {data.count.toLocaleString()} samples
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className={`text-2xl font-bold text-${color}-600`}>{value}%</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function PerformanceRecommendations({ data }: { data: WebVitalsData | null }) {
  if (!data) return null;

  const recommendations = [];

  if (data.LCP && data.LCP.p75 > 2500) {
    recommendations.push({
      metric: 'LCP',
      issue: 'Slow Largest Contentful Paint',
      recommendation: 'Optimize images, enable image compression, use CDN, implement lazy loading',
    });
  }

  if (data.FID && data.FID.p75 > 100) {
    recommendations.push({
      metric: 'FID',
      issue: 'High First Input Delay',
      recommendation: 'Reduce JavaScript execution time, code-split large bundles, defer non-critical JS',
    });
  }

  if (data.CLS && data.CLS.p75 > 0.1) {
    recommendations.push({
      metric: 'CLS',
      issue: 'High Cumulative Layout Shift',
      recommendation: 'Add width/height to images, avoid inserting content above existing content, use transform animations',
    });
  }

  if (data.TTFB && data.TTFB.p75 > 600) {
    recommendations.push({
      metric: 'TTFB',
      issue: 'Slow Time to First Byte',
      recommendation: 'Optimize server response time, use caching, enable CDN, reduce database queries',
    });
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 text-xl mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-1">
              Excellent Performance! 🎉
            </h3>
            <p className="text-green-700">
              All Core Web Vitals metrics are within recommended thresholds. Keep up the great work!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <FaExclamationTriangle className="text-yellow-500 text-xl mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-1">
            Performance Recommendations
          </h3>
          <p className="text-yellow-700">
            Some metrics need attention to improve user experience
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 rounded-full p-2 shrink-0">
                <span className="font-bold text-yellow-700">{rec.metric}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{rec.issue}</h4>
                <p className="text-sm text-gray-600">{rec.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScore(data: MetricStats): 'good' | 'needs-improvement' | 'poor' {
  const totalGood = data.good / data.count;
  if (totalGood >= 0.75) return 'good';
  if (totalGood >= 0.5) return 'needs-improvement';
  return 'poor';
}

function formatMetric(value: number, name: string): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return Math.round(value).toString();
}

function calculateTotalGood(data: WebVitalsData | null): number {
  if (!data) return 0;
  const metrics = Object.values(data).filter(m => m !== null) as MetricStats[];
  if (metrics.length === 0) return 0;
  
  const totalGood = metrics.reduce((sum, m) => sum + m.good, 0);
  const totalCount = metrics.reduce((sum, m) => sum + m.count, 0);
  return Math.round((totalGood / totalCount) * 100);
}

function calculateTotalNeedsImprovement(data: WebVitalsData | null): number {
  if (!data) return 0;
  const metrics = Object.values(data).filter(m => m !== null) as MetricStats[];
  if (metrics.length === 0) return 0;
  
  const total = metrics.reduce((sum, m) => sum + m.needsImprovement, 0);
  const totalCount = metrics.reduce((sum, m) => sum + m.count, 0);
  return Math.round((total / totalCount) * 100);
}

function calculateTotalPoor(data: WebVitalsData | null): number {
  if (!data) return 0;
  const metrics = Object.values(data).filter(m => m !== null) as MetricStats[];
  if (metrics.length === 0) return 0;
  
  const totalPoor = metrics.reduce((sum, m) => sum + m.poor, 0);
  const totalCount = metrics.reduce((sum, m) => sum + m.count, 0);
  return Math.round((totalPoor / totalCount) * 100);
}
