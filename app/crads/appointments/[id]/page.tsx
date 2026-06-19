'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

interface Reminder {
  id: string;
  scheduledFor: string;
  status: string;
  message: string;
}

interface Appointment {
  id: string | number;
  title?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  description?: string | null;
  appointmentType?: string;
  type?: string;
  interestedIn?: string;
  scheduledAt?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  duration?: number;
  timezone?: string;
  status: string;
  meetingLink?: string | null;
  meetingPassword?: string | null;
  location?: string | null;
  assignedTo?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  demoRequestId?: string | null;
  customerId?: string | null;
  demoRequest?: {
    id: string;
    name: string;
    email: string;
    status: string;
  } | null;
  reminders?: Reminder[];
  appointmentNumber?: string;
  date?: string | null;
  time?: string | null;
}

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Update form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    title: '',
    description: '',
    appointmentType: '',
    scheduledAt: '',
    duration: 60,
    timezone: 'UTC',
    status: '',
    meetingLink: '',
    meetingPassword: '',
    location: '',
    notes: '',
    internalNotes: '',
    cancellationReason: '',
  });

  // Fetch appointment details
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/appointments/${resolvedParams.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }

      const data = await response.json();
      
      // API returns appointment directly, not wrapped
      const appointmentData = data.appointment || data;
      setAppointment(appointmentData);
      
      // Format scheduledAt for datetime-local input - handle both scheduledAt and preferredDate
      let formattedDate = '';
      if (appointmentData.scheduledAt) {
        const scheduledDate = new Date(appointmentData.scheduledAt);
        formattedDate = scheduledDate.toISOString().slice(0, 16);
      } else if (appointmentData.preferredDate && appointmentData.preferredTime) {
        // Combine preferredDate and preferredTime
        const dateStr = appointmentData.preferredDate.split('T')[0];
        const timeStr = appointmentData.preferredTime || '00:00';
        formattedDate = `${dateStr}T${timeStr}`;
      }

      setFormData({
        customerName: appointmentData.customerName || appointmentData.name || '',
        customerEmail: appointmentData.customerEmail || appointmentData.email || '',
        customerPhone: appointmentData.customerPhone || appointmentData.phone || '',
        title: appointmentData.title || '',
        description: appointmentData.description || appointmentData.notes || '',
        appointmentType: appointmentData.appointmentType || appointmentData.type || appointmentData.interestedIn || '',
        scheduledAt: formattedDate,
        duration: appointmentData.duration || 60,
        timezone: appointmentData.timezone || 'UTC',
        status: appointmentData.status || 'PENDING',
        meetingLink: appointmentData.meetingLink || '',
        meetingPassword: appointmentData.meetingPassword || '',
        location: appointmentData.location || '',
        notes: appointmentData.notes || '',
        internalNotes: appointmentData.internalNotes || '',
        cancellationReason: appointmentData.cancellationReason || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [resolvedParams.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Map formData to API expected fields
      const updatePayload = {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        title: formData.title,
        type: formData.appointmentType,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
        status: formData.status,
        notes: formData.notes || formData.description,
      };

      const response = await fetch(`/api/crads/appointments/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update appointment');
      }

      await fetchAppointment();
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Appointment updated successfully!', 
        life: 3000 
      });
    } catch (err) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err instanceof Error ? err.message : 'An error occurred', 
        life: 3000 
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/crads/appointments/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Deleted', 
        detail: 'Appointment deleted successfully!', 
        life: 2000 
      });

      // Redirect after showing toast
      setTimeout(() => {
        router.push('/crads/appointments');
      }, 2000);
    } catch (err) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err instanceof Error ? err.message : 'An error occurred', 
        life: 3000 
      });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      NO_SHOW: 'bg-orange-100 text-orange-800 border-orange-200',
      RESCHEDULED: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      DEMO: 'text-blue-600',
      SUPPORT: 'text-orange-600',
      CONSULTATION: 'text-purple-600',
      TRAINING: 'text-green-600',
      FOLLOW_UP: 'text-gray-600',
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
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-8">
        <Toast ref={toast} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Appointment not found'}</p>
          <Link
            href="/crads/appointments"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Appointments
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
          href="/crads/appointments"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Appointments
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{appointment.title || appointment.name || 'Appointment'}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <span className={`text-lg font-semibold ${getTypeColor(appointment.appointmentType || appointment.type || appointment.interestedIn || '')}`}>
                {appointment.appointmentType || appointment.type || appointment.interestedIn || '-'}
              </span>
            </div>
            <p className="text-gray-600">
              {appointment.scheduledAt ? formatDate(appointment.scheduledAt) : (appointment.preferredDate ? `${appointment.preferredDate} ${appointment.preferredTime || ''}` : 'Not scheduled')} 
              {appointment.duration && ` • ${appointment.duration} minutes`}
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Appointment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="DEMO">Demo</option>
                    <option value="SUPPORT">Support</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="TRAINING">Training</option>
                    <option value="FOLLOW_UP">Follow Up</option>
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
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                    <option value="RESCHEDULED">Rescheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST</option>
                    <option value="America/Los_Angeles">PST</option>
                    <option value="Europe/London">GMT</option>
                    <option value="Asia/Kolkata">IST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Password
                </label>
                <input
                  type="text"
                  value={formData.meetingPassword}
                  onChange={(e) => setFormData({ ...formData, meetingPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Office address, conference room, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  rows={2}
                  placeholder="Private notes (not visible to customer)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {formData.status === 'CANCELLED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Reason
                  </label>
                  <textarea
                    value={formData.cancellationReason}
                    onChange={(e) => setFormData({ ...formData, cancellationReason: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Appointment'}
              </button>
            </form>
          </div>

          {/* Reminders */}
          {appointment.reminders && appointment.reminders.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
              <div className="space-y-3">
                {appointment.reminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{reminder.message}</div>
                      <div className="text-sm text-gray-500">{formatDate(reminder.scheduledFor)}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reminder.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meeting Information */}
          {(appointment.meetingLink || appointment.location) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Information</h3>
              <div className="space-y-3">
                {appointment.meetingLink && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Meeting Link</div>
                    <a
                      href={appointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium break-all"
                    >
                      Join Meeting →
                    </a>
                    {appointment.meetingPassword && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Password: </span>
                        <span className="font-mono font-medium text-gray-900">{appointment.meetingPassword}</span>
                      </div>
                    )}
                  </div>
                )}
                {appointment.location && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="font-medium text-gray-900">{appointment.location}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium text-gray-900">{appointment.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{appointment.customerEmail}</div>
              </div>
              {appointment.customerPhone && (
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium text-gray-900">{appointment.customerPhone}</div>
                </div>
              )}
              {appointment.customerId && (
                <Link
                  href={`/crads/customers/${appointment.customerId}`}
                  className="inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  View Customer Profile →
                </Link>
              )}
            </div>
          </div>

          {/* Related Information */}
          {appointment.demoRequest && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Demo Request</h3>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{appointment.demoRequest.name}</div>
                <div className="text-sm text-gray-600">{appointment.demoRequest.email}</div>
                <div className="text-sm">
                  <span className="text-gray-600">Status: </span>
                  <span className="font-medium">{appointment.demoRequest.status}</span>
                </div>
                <Link
                  href={`/crads/demos/${appointment.demoRequestId}`}
                  className="inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  View Demo Request →
                </Link>
              </div>
            </div>
          )}

          {/* Appointment Metadata */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Timezone</div>
                <div className="font-medium text-gray-900">{appointment.timezone}</div>
              </div>
              <div>
                <div className="text-gray-600">Created</div>
                <div className="font-medium text-gray-900">{formatDate(appointment.createdAt)}</div>
              </div>
              <div>
                <div className="text-gray-600">Last Updated</div>
                <div className="font-medium text-gray-900">{formatDate(appointment.updatedAt)}</div>
              </div>
              {appointment.completedAt && (
                <div>
                  <div className="text-gray-600">Completed</div>
                  <div className="font-medium text-gray-900">{formatDate(appointment.completedAt)}</div>
                </div>
              )}
              {appointment.cancelledAt && (
                <div>
                  <div className="text-gray-600">Cancelled</div>
                  <div className="font-medium text-gray-900">{formatDate(appointment.cancelledAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Reason */}
          {appointment.cancellationReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Cancellation Reason</h3>
              <p className="text-red-800">{appointment.cancellationReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border-2 border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Appointment?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this appointment? This action cannot be undone and all associated data will be permanently removed.
              </p>
            
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
