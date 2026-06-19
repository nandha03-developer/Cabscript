'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  id: string;
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

const actionColors = {
  CREATE: 'bg-green-900/50 text-green-200 border-green-800',
  UPDATE: 'bg-blue-900/50 text-blue-200 border-blue-800',
  DELETE: 'bg-red-900/50 text-red-200 border-red-800',
  LOGIN: 'bg-purple-900/50 text-purple-200 border-purple-800',
  LOGOUT: 'bg-gray-700 text-gray-300 border-gray-600',
  VIEW: 'bg-indigo-900/50 text-indigo-200 border-indigo-800',
  EXPORT: 'bg-yellow-900/50 text-yellow-200 border-yellow-800',
};

const entityTypeColors = {
  USER: 'bg-blue-100 text-blue-800',
  ORDER: 'bg-green-100 text-green-800',
  CUSTOMER: 'bg-purple-100 text-purple-800',
  DEMO_REQUEST: 'bg-yellow-100 text-yellow-800',
  NEWSLETTER: 'bg-pink-100 text-pink-800',
  SETTINGS: 'bg-gray-100 text-gray-800',
};

export default function ActivityLogsTable() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchActivityLogs();
  }, [currentPage, actionFilter, entityFilter, searchQuery]);

  const fetchActivityLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
        ...(actionFilter !== 'all' && { action: actionFilter }),
        ...(entityFilter !== 'all' && { entityType: entityFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setActivityLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by admin name, action, or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="VIEW">View</option>
            <option value="EXPORT">Export</option>
          </select>
          
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          >
            <option value="all">All Entities</option>
            <option value="USER">Users</option>
            <option value="ORDER">Orders</option>
            <option value="CUSTOMER">Customers</option>
            <option value="DEMO_REQUEST">Demo Requests</option>
            <option value="NEWSLETTER">Newsletter</option>
            <option value="SETTINGS">Settings</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {activityLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No activity logs found
                </td>
              </tr>
            ) : (
              activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {log.adminName}
                      </div>
                      <div className="text-sm text-gray-400">{log.adminEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md border ${
                        actionColors[log.action as keyof typeof actionColors] || 
                        'bg-gray-700 text-gray-300 border-gray-600'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-300">{log.entityType}</span>
                      <div className="text-xs text-gray-500">ID: {log.entityId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 max-w-md">
                      {log.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {log.ipAddress || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div>
                      <div>
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}