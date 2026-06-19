"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  customers: {
    total: number;
    thisMonth: number;
    change: number;
  };
  demoRequests: {
    total: number;
    thisMonth: number;
    pending: number;
    change: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    change: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    change: number;
  };
  tickets: {
    total: number;
    thisMonth: number;
    open: number;
    change: number;
  };
  appointments: {
    upcoming: number;
  };
}

interface Activity {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  admin: string;
  timestamp: string;
}

interface Appointment {
  id: string;
  title: string;
  appointmentType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  customerName: string;
  customerEmail: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all dashboard data in parallel
      const [statsRes, activitiesRes, appointmentsRes] = await Promise.all([
        fetch('/api/crads/dashboard/stats'),
        fetch('/api/crads/dashboard/activities'),
        fetch('/api/crads/dashboard/appointments'),
      ]);

      if (!statsRes.ok || !activitiesRes.ok || !appointmentsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, activitiesData, appointmentsData] = await Promise.all([
        statsRes.json(),
        activitiesRes.json(),
        appointmentsRes.json(),
      ]);

      setStats(statsData);
      setActivities(activitiesData.activities || []);
      setAppointments(appointmentsData.appointments || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD300]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-[#FFD300] text-gray-900 rounded-lg hover:bg-yellow-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your CabScript business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.customers.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-xs mt-4 ${getChangeColor(stats.customers.change)}`}>
            {getChangeIcon(stats.customers.change)} {Math.abs(stats.customers.change)}% from last month
          </p>
        </div>

        {/* Demo Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Demo Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.demoRequests.total}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{stats.demoRequests.pending} pending</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.total}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{formatCurrency(stats.revenue.total)} revenue</p>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Support Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tickets.total}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{stats.tickets.open} open</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Link href="/crads/activity-log" className="text-sm text-[#FFD300] hover:text-yellow-500">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="shrink-0 w-8 h-8 bg-[#FFD300] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
                      {activity.admin.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.admin}
                      <span className="text-gray-600 font-normal ml-1">
                        {activity.action.toLowerCase()} {activity.entity.toLowerCase()}
                      </span>
                    </p>
                    {activity.description && (
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
            <Link href="/crads/appointments" className="text-sm text-[#FFD300] hover:text-yellow-500">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No upcoming appointments</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{appointment.customerName}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(appointment.scheduledAt)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.appointmentType === 'DEMO' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.appointmentType}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Revenue & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue This Month</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.revenue.thisMonth)}
                </span>
                <span className={`text-sm font-medium ${getChangeColor(stats.revenue.change)}`}>
                  {getChangeIcon(stats.revenue.change)} {Math.abs(stats.revenue.change)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Total revenue: {formatCurrency(stats.revenue.total)}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Orders this month</span>
                <span className="font-medium text-gray-900">{stats.orders.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Average order value</span>
                <span className="font-medium text-gray-900">
                  {stats.orders.thisMonth > 0 
                    ? formatCurrency(stats.revenue.thisMonth / stats.orders.thisMonth)
                    : '$0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.demoRequests.total > 0 
                  ? Math.round((stats.orders.total / stats.demoRequests.total) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Customers This Month</span>
              <span className="text-sm font-medium text-gray-900">{stats.customers.thisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Demo Requests</span>
              <span className="text-sm font-medium text-gray-900">{stats.demoRequests.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Open Support Tickets</span>
              <span className="text-sm font-medium text-gray-900">{stats.tickets.open}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upcoming Appointments</span>
              <span className="text-sm font-medium text-gray-900">{stats.appointments.upcoming}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
