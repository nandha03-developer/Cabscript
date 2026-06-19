'use client';

import { useEffect, useState } from 'react';

interface ActivityLogsStatsData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  adminActions: number;
  systemEvents: number;
}

export default function ActivityLogsStats() {
  const [stats, setStats] = useState<ActivityLogsStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/activity-logs/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-900/50 border border-red-800 rounded-lg p-4">
        <p className="text-red-200">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Logs',
      value: stats.total,
      icon: '📝',
      color: 'bg-blue-900/50 text-blue-200',
      borderColor: 'border-blue-800',
    },
    {
      title: 'Today',
      value: stats.today,
      icon: '📅',
      color: 'bg-green-900/50 text-green-200',
      borderColor: 'border-green-800',
    },
    {
      title: 'This Week',
      value: stats.thisWeek,
      icon: '📈',
      color: 'bg-purple-900/50 text-purple-200',
      borderColor: 'border-purple-800',
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: '📊',
      color: 'bg-indigo-900/50 text-indigo-200',
      borderColor: 'border-indigo-800',
    },
    {
      title: 'Admin Actions',
      value: stats.adminActions,
      icon: '👥',
      color: 'bg-yellow-900/50 text-yellow-200',
      borderColor: 'border-yellow-800',
    },
    {
      title: 'System Events',
      value: stats.systemEvents,
      icon: '⚙️',
      color: 'bg-gray-700 text-gray-300',
      borderColor: 'border-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card) => (
        <div
          key={card.title}
          className={`bg-gray-900 p-6 rounded-lg border ${card.borderColor} hover:bg-gray-800 transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <span className="text-lg">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}