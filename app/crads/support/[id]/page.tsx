'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface TicketMessage {
  id: string;
  message: string;
  senderType: string;
  senderName: string;
  senderEmail: string | null;
  isInternal: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  lastResponseAt: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  messages: TicketMessage[];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export default function SupportTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Update form state
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    category: '',
    assignedToId: '',
    resolution: '',
  });

  // Reply form state
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch ticket details
  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/support/${resolvedParams.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }

      const data = await response.json();
      
      if (!data.ticket) {
        throw new Error('Ticket not found');
      }
      
      setTicket(data.ticket);
      setFormData({
        status: data.ticket.status || '',
        priority: data.ticket.priority || '',
        category: data.ticket.category || '',
        assignedToId: data.ticket.assignedTo?.id || '',
        resolution: data.ticket.resolution || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin users for assignment
  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/crads/admin-users');
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchAdminUsers();
  }, [resolvedParams.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData: any = {
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
      };

      if (formData.assignedToId) {
        updateData.assignedToId = formData.assignedToId;
      }

      if (formData.resolution) {
        updateData.resolution = formData.resolution;
      }

      const response = await fetch(`/api/crads/support/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update ticket');
      }

      await fetchTicket();
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Ticket updated successfully!',
        life: 3000,
      });
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a message',
        life: 3000,
      });
      return;
    }

    setSendingReply(true);

    try {
      const response = await fetch(`/api/crads/support/${resolvedParams.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          isInternal: isInternalNote,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reply');
      }

      setReplyMessage('');
      setIsInternalNote(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Reply sent successfully!',
        life: 3000,
      });
      await fetchTicket();
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/crads/support/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setShowDeleteModal(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Ticket deleted successfully!',
        life: 3000,
      });

      setTimeout(() => {
        router.push('/crads/support');
      }, 1500);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      WAITING_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
      WAITING_INTERNAL: 'bg-purple-100 text-purple-800 border-purple-200',
      RESOLVED: 'bg-green-100 text-green-800 border-green-200',
      CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      LOW: 'text-gray-600',
      MEDIUM: 'text-blue-600',
      HIGH: 'text-orange-600',
      URGENT: 'text-red-600',
      CRITICAL: 'text-red-800 font-bold',
    };
    return colors[priority] || 'text-gray-600';
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 bg-gray-200 rounded w-40"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-96"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-64"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Ticket not found'}</p>
          <Link
            href="/crads/support"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Support Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toast ref={toast} />
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/crads/support"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Support Tickets
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{ticket.ticketNumber}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`text-lg font-semibold ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-xl text-gray-700">{ticket.subject}</h2>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <i className="pi pi-trash"></i>
            Delete Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Messages Thread */}
        <div className="lg:col-span-2 space-y-6">
          {/* Initial Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {ticket.customerName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{ticket.customerName}</span>
                  <span className="text-sm text-gray-500">{ticket.customerEmail}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{ticket.description}</div>
              </div>
            </div>
          </div>

          {/* Message Thread */}
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-sm p-6 ${
                message.isInternal ? 'border-2 border-purple-200' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 ${
                    message.senderType === 'ADMIN'
                      ? 'bg-yellow-500 text-black'
                      : message.senderType === 'SYSTEM'
                      ? 'bg-gray-500 text-white'
                      : 'bg-blue-500 text-white'
                  } rounded-full flex items-center justify-center font-semibold`}
                >
                  {message.senderName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{message.senderName}</span>
                    {message.senderEmail && (
                      <>
                        <span className="text-sm text-gray-500">{message.senderEmail}</span>
                        <span className="text-sm text-gray-400">•</span>
                      </>
                    )}
                    <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                    {message.isInternal && (
                      <>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
                          Internal Note
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">{message.message}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Reply Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply</h3>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isInternal"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isInternal" className="text-sm text-gray-700">
                  Internal note (not visible to customer)
                </label>
              </div>

              <button
                type="submit"
                disabled={sendingReply}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i className={sendingReply ? 'pi pi-spin pi-spinner' : 'pi pi-send'}></i>
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </form>
          </div>

          {/* Resolution */}
          {ticket.resolution && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Resolution</h3>
              <p className="text-green-800 whitespace-pre-wrap">{ticket.resolution}</p>
              {ticket.resolvedAt && (
                <p className="text-sm text-green-700 mt-2">
                  Resolved on {formatDate(ticket.resolvedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Ticket Management */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium text-gray-900">{ticket.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{ticket.customerEmail}</div>
              </div>
              {ticket.customer && (
                <Link
                  href={`/crads/customers/${ticket.customer.id}`}
                  className="inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  View Customer Profile →
                </Link>
              )}
            </div>
          </div>

          {/* Update Ticket */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Ticket</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="WAITING_CUSTOMER">Waiting Customer</option>
                  <option value="WAITING_INTERNAL">Waiting Internal</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="BILLING">Billing</option>
                  <option value="INSTALLATION">Installation</option>
                  <option value="CUSTOMIZATION">Customization</option>
                  <option value="BUG_REPORT">Bug Report</option>
                  <option value="FEATURE_REQUEST">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  value={formData.assignedToId}
                  onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Unassigned</option>
                  {adminUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution Notes
                </label>
                <textarea
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  rows={4}
                  placeholder="Add resolution notes when closing..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i className={updating ? 'pi pi-spin pi-spinner' : 'pi pi-save'}></i>
                {updating ? 'Updating...' : 'Update Ticket'}
              </button>
            </form>
          </div>

          {/* Ticket Metadata */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Category</div>
                <div className="font-medium text-gray-900 capitalize">
                  {ticket.category.toLowerCase().replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Created</div>
                <div className="font-medium text-gray-900">{formatDate(ticket.createdAt)}</div>
              </div>
              <div>
                <div className="text-gray-600">Last Updated</div>
                <div className="font-medium text-gray-900">{formatDate(ticket.updatedAt)}</div>
              </div>
              {ticket.lastResponseAt && (
                <div>
                  <div className="text-gray-600">Last Response</div>
                  <div className="font-medium text-gray-900">{formatDate(ticket.lastResponseAt)}</div>
                </div>
              )}
              {ticket.closedAt && (
                <div>
                  <div className="text-gray-600">Closed</div>
                  <div className="font-medium text-gray-900">{formatDate(ticket.closedAt)}</div>
                </div>
              )}
              <div>
                <div className="text-gray-600">Assigned To</div>
                <div className="font-medium text-gray-900">
                  {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-60 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-exclamation-triangle text-red-600 text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Ticket?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this ticket? This action cannot be undone and all messages will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <i className="pi pi-times"></i>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="pi pi-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
