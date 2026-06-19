'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface DemoRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate: string;
  preferredTime: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

const statusColors = {
  PENDING: 'bg-yellow-900/50 text-yellow-200 border-yellow-800',
  SCHEDULED: 'bg-blue-900/50 text-blue-200 border-blue-800',
  COMPLETED: 'bg-green-900/50 text-green-200 border-green-800',
  CANCELLED: 'bg-red-900/50 text-red-200 border-red-800',
  NO_SHOW: 'bg-gray-700 text-gray-300 border-gray-600',
};

const statusLabels = {
  PENDING: 'Pending',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export default function DemoRequestsTable() {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDemoRequests();
  }, [currentPage, statusFilter, searchQuery]);

  const fetchDemoRequests = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/demo-requests?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDemoRequests(data.requests);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch demo requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/demo-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchDemoRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update demo request:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Preferred Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Requested
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {demoRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No demo requests found
                </td>
              </tr>
            ) : (
              demoRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {request.name}
                      </div>
                      <div className="text-sm text-gray-400">{request.email}</div>
                      {request.phone && (
                        <div className="text-sm text-gray-400">{request.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {request.company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(request.preferredDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {request.preferredTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md border ${
                        statusColors[request.status]
                      }`}
                    >
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDistanceToNow(new Date(request.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={request.status}
                      onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                      className="text-sm bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No Show</option>
                    </select>
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