"use client";

import { useState, useEffect } from "react";

interface ActivityLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ActivityLogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    adminEmail: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  const [stats, setStats] = useState<Array<{ action: string; count: number }>>([]);

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fetch logs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
    );
    window.open(`/api/admin/activity-logs/export?${params}`, "_blank");
  };

  const resetFilters = () => {
    setFilters({
      action: "",
      entityType: "",
      adminEmail: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setPagination({ ...pagination, page: 1 });
  };

  const actionColors: Record<string, string> = {
    created: "bg-green-100 text-green-800",
    updated: "bg-blue-100 text-blue-800",
    deleted: "bg-red-100 text-red-800",
    viewed: "bg-gray-100 text-gray-800",
    login: "bg-purple-100 text-purple-800",
    logout: "bg-orange-100 text-orange-800",
    generated_license: "bg-purple-100 text-purple-800",
    revoked_license: "bg-orange-100 text-orange-800",
    UPDATE_PROFILE: "bg-blue-100 text-blue-800",
    CHANGE_PASSWORD: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
            <p className="text-gray-600 mt-1">Track all admin actions and system activities</p>
          </div>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.slice(0, 8).map((stat) => (
              <div
                key={stat.action}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
              >
                <p className="text-sm text-gray-600 capitalize">
                  {stat.action.replace(/_/g, " ")}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search description, entity..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Actions</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="deleted">Deleted</option>
                <option value="viewed">Viewed</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity Type
              </label>
              <select
                value={filters.entityType}
                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Types</option>
                <option value="order">Order</option>
                <option value="customer">Customer</option>
                <option value="license">License</option>
                <option value="admin_user">Admin User</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="text"
                value={filters.adminEmail}
                onChange={(e) => setFilters({ ...filters, adminEmail: e.target.value })}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    Entity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading activity logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                            {log.adminName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{log.adminName}</div>
                            <div className="text-sm text-gray-500">{log.adminEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            actionColors[log.action] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {log.entityType.replace(/_/g, " ")}
                        </div>
                        <div className="text-sm text-gray-500">ID: {log.entityId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">
                          {log.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
