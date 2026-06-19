'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  title: string;
  customerName: string;
  scheduledAt: string;
  status: string;
}

interface Reminder {
  id: string;
  reminderType: string;
  referenceId: string;
  referenceType: string;
  recipientEmail: string;
  recipientName: string | null;
  title: string;
  message: string;
  scheduledFor: string;
  sentAt: string | null;
  status: string;
  sendEmail: boolean;
  sendSms: boolean;
  sendPush: boolean;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  appointment: Appointment | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New reminder form
  const [newReminder, setNewReminder] = useState({
    reminderType: 'APPOINTMENT_24H',
    referenceId: '',
    referenceType: 'appointment',
    recipientEmail: '',
    recipientName: '',
    title: '',
    message: '',
    scheduledFor: '',
    sendEmail: true,
    sendSms: false,
    sendPush: false,
  });

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await fetch(`/api/crads/reminders?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }

      const data = await response.json();
      setReminders(data.reminders);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [pagination.page, search, statusFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination({ ...pagination, page: 1 });
  };

  const handleProcessReminders = async () => {
    if (!confirm('Process all pending reminders that are due? This will send emails/SMS/push notifications.')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/crads/reminders/process', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process reminders');
      }

      const result = await response.json();
      alert(`Processed ${result.total} reminders:\n- Sent: ${result.sent}\n- Failed: ${result.failed}`);
      
      if (result.errors.length > 0) {
        console.error('Processing errors:', result.errors);
      }

      fetchReminders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendReminder = async (id: string) => {
    if (!confirm('Send this reminder now?')) {
      return;
    }

    try {
      const response = await fetch(`/api/crads/reminders/${id}/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reminder');
      }

      alert('Reminder sent successfully!');
      fetchReminders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/crads/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create reminder');
      }

      setShowCreateModal(false);
      setNewReminder({
        reminderType: 'APPOINTMENT_24H',
        referenceId: '',
        referenceType: 'appointment',
        recipientEmail: '',
        recipientName: '',
        title: '',
        message: '',
        scheduledFor: '',
        sendEmail: true,
        sendSms: false,
        sendPush: false,
      });
      fetchReminders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SENT: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      APPOINTMENT_24H: 'text-blue-600',
      APPOINTMENT_1H: 'text-orange-600',
      FOLLOW_UP: 'text-purple-600',
      PAYMENT_DUE: 'text-red-600',
      TICKET_RESPONSE: 'text-green-600',
      DEMO_FOLLOW_UP: 'text-indigo-600',
    };
    return colors[type] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = () => {
    const pendingReminders = reminders.filter((r) => r.status === 'PENDING').length;
    const sentReminders = reminders.filter((r) => r.status === 'SENT').length;
    const failedReminders = reminders.filter((r) => r.status === 'FAILED').length;

    return { pendingReminders, sentReminders, failedReminders };
  };

  const stats = calculateStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            <p className="text-gray-600 mt-1">Automated reminder system for appointments, tickets, and follow-ups</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleProcessReminders}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : '⚡ Process Pending'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
            >
              + New Reminder
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReminders}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Sent</div>
            <div className="text-2xl font-bold text-green-600">{stats.sentReminders}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Failed</div>
            <div className="text-2xl font-bold text-red-600">{stats.failedReminders}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Title, recipient..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Types</option>
                  <option value="APPOINTMENT_24H">Appointment (24h)</option>
                  <option value="APPOINTMENT_1H">Appointment (1h)</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="PAYMENT_DUE">Payment Due</option>
                  <option value="TICKET_RESPONSE">Ticket Response</option>
                  <option value="DEMO_FOLLOW_UP">Demo Follow Up</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">{pagination.total} total reminders</p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchReminders}
              className="mt-2 text-red-600 hover:text-red-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
            <p className="mt-4 text-gray-600">Loading reminders...</p>
          </div>
        )}

        {/* Reminders table */}
        {!loading && reminders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled For
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reminders.map((reminder) => (
                    <tr key={reminder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{reminder.title}</div>
                          {reminder.appointment && (
                            <div className="text-xs text-gray-500">
                              {reminder.appointment.title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {reminder.recipientName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{reminder.recipientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${getTypeColor(reminder.reminderType)}`}>
                          {reminder.reminderType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(reminder.scheduledFor)}
                        {reminder.sentAt && (
                          <div className="text-xs text-green-600">
                            Sent: {formatDate(reminder.sentAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {reminder.sendEmail && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                              Email
                            </span>
                          )}
                          {reminder.sendSms && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                              SMS
                            </span>
                          )}
                          {reminder.sendPush && (
                            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                              Push
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                          {reminder.status}
                        </span>
                        {reminder.retryCount > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Retries: {reminder.retryCount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/crads/reminders/${reminder.id}`}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            View
                          </Link>
                          {reminder.status === 'PENDING' && (
                            <button
                              onClick={() => handleSendReminder(reminder.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Send
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
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
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && reminders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reminders found</h3>
            <p className="mt-2 text-gray-600">
              {search || statusFilter || typeFilter
                ? 'Try adjusting your filters'
                : 'Create a new reminder to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Reminder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Reminder</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Type *
                  </label>
                  <select
                    required
                    value={newReminder.reminderType}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="APPOINTMENT_24H">Appointment (24h before)</option>
                    <option value="APPOINTMENT_1H">Appointment (1h before)</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="PAYMENT_DUE">Payment Due</option>
                    <option value="TICKET_RESPONSE">Ticket Response</option>
                    <option value="DEMO_FOLLOW_UP">Demo Follow Up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Type *
                  </label>
                  <select
                    required
                    value={newReminder.referenceType}
                    onChange={(e) => setNewReminder({ ...newReminder, referenceType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="appointment">Appointment</option>
                    <option value="ticket">Ticket</option>
                    <option value="order">Order</option>
                    <option value="demo">Demo Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference ID *
                </label>
                <input
                  type="text"
                  required
                  value={newReminder.referenceId}
                  onChange={(e) => setNewReminder({ ...newReminder, referenceId: e.target.value })}
                  placeholder="ID of appointment, ticket, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newReminder.recipientEmail}
                    onChange={(e) => setNewReminder({ ...newReminder, recipientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={newReminder.recipientName}
                    onChange={(e) => setNewReminder({ ...newReminder, recipientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="e.g., Appointment Reminder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  rows={4}
                  placeholder="Reminder message content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled For *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newReminder.scheduledFor}
                  onChange={(e) => setNewReminder({ ...newReminder, scheduledFor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Channels
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReminder.sendEmail}
                      onChange={(e) => setNewReminder({ ...newReminder, sendEmail: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReminder.sendSms}
                      onChange={(e) => setNewReminder({ ...newReminder, sendSms: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">SMS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReminder.sendPush}
                      onChange={(e) => setNewReminder({ ...newReminder, sendPush: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Push Notification</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
