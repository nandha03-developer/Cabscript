"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

interface DemoRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  interestedIn: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  status: string;
  notes: string | null;
  internalNotes: string | null;
  assignedTo: string | null;
  contactedAt: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  appointments: Array<{
    id: number;
    scheduledAt: string;
    status: string;
  }>;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function DemoRequestsPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    loadDemoRequests();
  }, [statusFilter, pagination.page]);

  const loadDemoRequests = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/crads/demo-requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch demo requests');

      const data = await response.json();
      setDemoRequests(data.demoRequests);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load demo requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    loadDemoRequests();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/crads/demo-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Status updated successfully!',
        life: 3000,
      });
      await loadDemoRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update status',
        life: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (id: number, name: string) => {
    setRequestToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    try {
      const response = await fetch(`/api/crads/demo-requests/${requestToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete demo request');

      setShowDeleteModal(false);
      setRequestToDelete(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Demo request deleted successfully!',
        life: 3000,
      });
      await loadDemoRequests();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete demo request',
        life: 3000,
      });
    }
  };

  const openDetails = (request: DemoRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
      SCHEDULED: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Created At'];
    const rows = demoRequests.map(req => [
      req.name,
      req.email,
      req.phone || '',
      req.company || '',
      req.status,
      formatDate(req.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <Toast ref={toast} />
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Demo Requests</h1>
        <p className="text-gray-600 mt-2">Manage and track all demo requests</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONTACTED">Contacted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Demo Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Interested In
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                /* Skeleton Loading */
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-40"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : demoRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No demo requests found
                  </td>
                </tr>
              ) : (
                demoRequests.map((request, index) => (
                  <tr key={request.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                          {request.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-gray-900">{request.name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          {request.phone && (
                            <div className="text-sm text-gray-500">{request.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.company || '-'}
                      </div>
                      {request.jobTitle && (
                        <div className="text-sm text-gray-500">{request.jobTitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.interestedIn || '-'}
                      </div>
                      {request.preferredDate && (
                        <div className="text-xs text-gray-500">
                          {request.preferredDate} {request.preferredTime}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        disabled={isUpdating}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          request.status
                        )} border-0 cursor-pointer`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetails(request)}
                          className="w-9 h-9 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                          title="View Details"
                        >
                          <i className="pi pi-eye text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(request.id, request.name)}
                          className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                          title="Delete Request"
                        >
                          <i className="pi pi-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative z-10 animate-scale-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <i className="pi pi-exclamation-triangle text-red-600 text-3xl"></i>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">Delete Demo Request</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete the demo request from ? 
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-60"
          onClick={() => setIsDetailsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">
                      {selectedRequest.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Demo Request Details</h2>
                    <p className="text-sm text-gray-700 mt-1">Request ID: #{selectedRequest.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
              {/* Contact Information */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <i className="pi pi-user text-white text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Name</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Email</span>
                    <p className="font-semibold text-gray-900 mt-1 truncate">{selectedRequest.email}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Phone</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.phone || '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Company</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.company || '-'}</p>
                  </div>
                  {selectedRequest.jobTitle && (
                    <div className="bg-white rounded-lg p-4 shadow-sm col-span-2">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Job Title</span>
                      <p className="font-semibold text-gray-900 mt-1">{selectedRequest.jobTitle}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Preferences */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                    <i className="pi pi-calendar text-white text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Demo Preferences</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Interested In</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.interestedIn || '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
                    <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mt-1 ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Preferred Date</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.preferredDate || '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Preferred Time</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedRequest.preferredTime || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <i className="pi pi-file-edit text-white text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Notes</h3>
                </div>
                <div className="space-y-3">
                  {selectedRequest.notes && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Customer Notes</span>
                      <p className="font-medium text-gray-900 mt-2 leading-relaxed">{selectedRequest.notes}</p>
                    </div>
                  )}
                  {selectedRequest.internalNotes && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Internal Notes</span>
                      <p className="font-medium text-gray-900 mt-2 leading-relaxed">{selectedRequest.internalNotes}</p>
                    </div>
                  )}
                  {!selectedRequest.notes && !selectedRequest.internalNotes && (
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <p className="text-gray-400 italic">No notes available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointments */}
              {selectedRequest.appointments && selectedRequest.appointments.length > 0 && (
                <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                      <i className="pi pi-clock text-white text-sm"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Linked Appointments</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedRequest.appointments.map((apt) => (
                      <div key={apt.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-500 uppercase font-semibold block mb-1">Scheduled At</span>
                            <span className="text-sm font-semibold text-gray-900">{formatDate(apt.scheduledAt)}</span>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-linear-to-br from-gray-50 to-slate-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                    <i className="pi pi-history text-white text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Timeline</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Created</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                  {selectedRequest.contactedAt && (
                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Contacted</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatDate(selectedRequest.contactedAt)}</span>
                    </div>
                  )}
                  {selectedRequest.scheduledAt && (
                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Scheduled</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatDate(selectedRequest.scheduledAt)}</span>
                    </div>
                  )}
                  {selectedRequest.completedAt && (
                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Completed</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatDate(selectedRequest.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
