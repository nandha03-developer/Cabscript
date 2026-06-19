'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
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
  updatedAt: string;
  appointment: Appointment | null;
}

export default function ReminderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form state
  const [formData, setFormData] = useState({
    reminderType: '',
    recipientEmail: '',
    recipientName: '',
    title: '',
    message: '',
    scheduledFor: '',
    status: '',
    sendEmail: true,
    sendSms: false,
    sendPush: false,
  });

  // Fetch reminder details
  const fetchReminder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/reminders/${resolvedParams.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reminder');
      }

      const data = await response.json();
      setReminder(data.reminder);

      // Format scheduledFor for datetime-local input
      const scheduledDate = new Date(data.reminder.scheduledFor);
      const formattedDate = scheduledDate.toISOString().slice(0, 16);

      setFormData({
        reminderType: data.reminder.reminderType,
        recipientEmail: data.reminder.recipientEmail,
        recipientName: data.reminder.recipientName || '',
        title: data.reminder.title,
        message: data.reminder.message,
        scheduledFor: formattedDate,
        status: data.reminder.status,
        sendEmail: data.reminder.sendEmail,
        sendSms: data.reminder.sendSms,
        sendPush: data.reminder.sendPush,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminder();
  }, [resolvedParams.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/crads/reminders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update reminder');
      }

      await fetchReminder();
      alert('Reminder updated successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const handleSend = async () => {
    if (!confirm('Send this reminder now? This will trigger email/SMS/push notifications.')) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/crads/reminders/${resolvedParams.id}/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reminder');
      }

      alert('Reminder sent successfully!');
      await fetchReminder();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this reminder? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/crads/reminders/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reminder');
      }

      router.push('/crads/reminders');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      SENT: 'bg-green-100 text-green-800 border-green-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading reminder...</p>
        </div>
      </div>
    );
  }

  if (error || !reminder) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Reminder not found'}</p>
          <Link
            href="/crads/reminders"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Reminders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/crads/reminders"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Reminders
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{reminder.title}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(reminder.status)}`}>
                {reminder.status}
              </span>
              <span className={`text-lg font-semibold ${getTypeColor(reminder.reminderType)}`}>
                {reminder.reminderType.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-gray-600">
              Scheduled for {formatDate(reminder.scheduledFor)}
            </p>
          </div>

          <div className="flex gap-3">
            {reminder.status === 'PENDING' && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Now'}
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Delete Reminder
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Reminder Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
              {reminder.message}
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Reminder</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Type
                  </label>
                  <select
                    value={formData.reminderType}
                    onChange={(e) => setFormData({ ...formData, reminderType: e.target.value })}
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SENT">Sent</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
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
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
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
                      checked={formData.sendEmail}
                      onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sendSms}
                      onChange={(e) => setFormData({ ...formData, sendSms: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">SMS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sendPush}
                      onChange={(e) => setFormData({ ...formData, sendPush: e.target.checked })}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Push Notification</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Reminder'}
              </button>
            </form>
          </div>

          {/* Error Information */}
          {reminder.errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Details</h3>
              <p className="text-red-800">{reminder.errorMessage}</p>
              <p className="text-sm text-red-700 mt-2">
                Retry count: {reminder.retryCount}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-2">Delivery Channels</div>
                <div className="flex flex-wrap gap-2">
                  {reminder.sendEmail && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Email
                    </span>
                  )}
                  {reminder.sendSms && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      SMS
                    </span>
                  )}
                  {reminder.sendPush && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      Push
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Scheduled For</div>
                <div className="font-medium text-gray-900">{formatDate(reminder.scheduledFor)}</div>
              </div>
              {reminder.sentAt && (
                <div>
                  <div className="text-sm text-gray-600">Sent At</div>
                  <div className="font-medium text-gray-900">{formatDate(reminder.sentAt)}</div>
                </div>
              )}
              {reminder.retryCount > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Retry Count</div>
                  <div className="font-medium text-gray-900">{reminder.retryCount}</div>
                </div>
              )}
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium text-gray-900">{reminder.recipientName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{reminder.recipientEmail}</div>
              </div>
            </div>
          </div>

          {/* Related Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reference</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Reference Type</div>
                <div className="font-medium text-gray-900 capitalize">{reminder.referenceType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Reference ID</div>
                <div className="font-medium text-gray-900 font-mono text-xs break-all">{reminder.referenceId}</div>
              </div>
              {reminder.appointment && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">Appointment Details</div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{reminder.appointment.title}</div>
                    <div className="text-sm text-gray-600">{reminder.appointment.customerName}</div>
                    <div className="text-sm text-gray-600">{formatDate(reminder.appointment.scheduledAt)}</div>
                    <Link
                      href={`/crads/appointments/${reminder.appointment.id}`}
                      className="inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm mt-2"
                    >
                      View Appointment →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reminder Metadata */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Created</div>
                <div className="font-medium text-gray-900">{formatDate(reminder.createdAt)}</div>
              </div>
              <div>
                <div className="text-gray-600">Last Updated</div>
                <div className="font-medium text-gray-900">{formatDate(reminder.updatedAt)}</div>
              </div>
              <div>
                <div className="text-gray-600">Reminder ID</div>
                <div className="font-mono text-xs text-gray-900 break-all">{reminder.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
