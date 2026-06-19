'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Toast } from 'primereact/toast';

interface Appointment {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  type: string;  // Changed from appointmentType to type
  appointmentType?: string;  // Keep for backwards compatibility
  scheduledAt: string;
  duration: number;
  status: string;
  assignedTo: string | null;
  meetingLink: string | null;
  location: string | null;
  createdAt: string;
  demoRequestId: string | null;
  customerId: string | null;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: string | null;
  end: string | null;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    appointmentNumber?: string;
    customerName?: string;
    customerEmail?: string;
    phone?: string | null;
    company?: string | null;
    status?: string;
    time?: string | null;
    notes?: string | null;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

type ViewMode = 'list' | 'calendar';

export default function AppointmentsPage() {
  const toast = useRef<Toast>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
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
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');

  // New appointment form
  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    title: '',
    description: '',
    appointmentType: 'DEMO',
    scheduledAt: '',
    duration: 60,
    timezone: 'UTC',
    meetingLink: '',
    location: '',
    notes: '',
  });

  // Fetch appointments
  const fetchAppointments = async () => {
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

      const response = await fetch(`/api/crads/appointments?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.appointments || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch calendar events
  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = getCalendarStartDate();
      const endDate = getCalendarEndDate();

      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        view: calendarView,
      });

      const response = await fetch(`/api/crads/appointments/calendar?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      setCalendarEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchAppointments();
    } else {
      fetchCalendarEvents();
    }
  }, [pagination.page, search, statusFilter, typeFilter, viewMode, currentDate, calendarView]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination({ ...pagination, page: 1 });
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/crads/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create appointment');
      }

      setShowCreateModal(false);
      setNewAppointment({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        title: '',
        description: '',
        appointmentType: 'DEMO',
        scheduledAt: '',
        duration: 60,
        timezone: 'UTC',
        meetingLink: '',
        location: '',
        notes: '',
      });
      
      if (viewMode === 'list') {
        fetchAppointments();
      } else {
        fetchCalendarEvents();
      }

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Appointment created successfully!', 
        life: 3000 
      });
    } catch (err) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err instanceof Error ? err.message : 'An error occurred', 
        life: 3000 
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
      RESCHEDULED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = (appointments || []).filter(
      (a) => {
        const date = new Date(a.scheduledAt);
        return date >= today && date < tomorrow;
      }
    ).length;

    const upcomingAppointments = (appointments || []).filter(
      (a) => new Date(a.scheduledAt) > new Date() && a.status === 'SCHEDULED'
    ).length;

    const confirmedAppointments = (appointments || []).filter(
      (a) => a.status === 'CONFIRMED'
    ).length;

    return { todayAppointments, upcomingAppointments, confirmedAppointments };
  };

  const stats = calculateStats();

  // Calendar helper functions
  const getCalendarStartDate = () => {
    const date = new Date(currentDate);
    if (calendarView === 'month') {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      // Go back to previous Monday
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
      }
    } else if (calendarView === 'week') {
      // Go to Monday of current week
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  };

  const getCalendarEndDate = () => {
    const date = new Date(currentDate);
    if (calendarView === 'month') {
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);
      date.setHours(23, 59, 59, 999);
      // Go forward to next Sunday
      while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
      }
    } else if (calendarView === 'week') {
      // Go to Sunday of current week
      const day = date.getDay();
      const diff = date.getDate() - day + 7;
      date.setDate(diff);
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(23, 59, 59, 999);
    }
    return date;
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getCalendarTitle = () => {
    if (calendarView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (calendarView === 'week') {
      const start = getCalendarStartDate();
      const end = getCalendarEndDate();
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const renderCalendarGrid = () => {
    if (calendarView === 'month') {
      return renderMonthView();
    } else if (calendarView === 'week') {
      return renderWeekView();
    } else {
      return renderDayView();
    }
  };

  const renderMonthView = () => {
    const startDate = getCalendarStartDate();
    const endDate = getCalendarEndDate();
    const days = [];
    const currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const dayEvents = (calendarEvents || []).filter((event) => {
                if (!event.start) return false;
                const eventDate = new Date(event.start);
                return (
                  eventDate.getDate() === day.getDate() &&
                  eventDate.getMonth() === day.getMonth() &&
                  eventDate.getFullYear() === day.getFullYear()
                );
              });

              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = 
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] border-r last:border-r-0 p-2 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-yellow-50' : ''}`}
                >
                  <div className={`text-sm font-semibold mb-2 ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'} ${isToday ? 'text-yellow-600' : ''}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <Link
                        key={event.id}
                        href={`/crads/appointments/${event.id}`}
                        className={`block text-xs p-1 rounded truncate ${getStatusColor(event.extendedProps?.status || 'PENDING')} hover:opacity-80`}
                      >
                        <span className="font-medium">{event.start ? formatTime(event.start) : ''}</span> {event.title}
                      </Link>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-600">Week view - Coming soon</div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-600">Day view - Coming soon</div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <Toast ref={toast} />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Schedule and manage customer appointments</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white rounded-lg shadow-sm p-1 flex">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
            >
              + New Appointment
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Today's Appointments</div>
              <div className="text-2xl font-bold text-blue-600">{stats.todayAppointments}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Upcoming</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.upcomingAppointments}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Confirmed</div>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <>
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
                      placeholder="Title, customer..."
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
                      <option value="DEMO">Demo</option>
                      <option value="SUPPORT">Support</option>
                      <option value="CONSULTATION">Consultation</option>
                      <option value="TRAINING">Training</option>
                      <option value="FOLLOW_UP">Follow Up</option>
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
                <p className="text-sm text-gray-600">{pagination.total} total appointments</p>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={fetchAppointments}
                  className="mt-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading state - Skeleton */}
            {loading && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">S.No</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scheduled</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-40"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
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
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Appointments table */}
            {!loading && appointments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Scheduled
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {appointments.map((appointment, index) => (
                        <tr key={appointment.id} className="hover:bg-yellow-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                              {(pagination.page - 1) * pagination.limit + index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div>
                                <div className="font-semibold text-gray-900">{appointment.title}</div>
                                {appointment.meetingLink && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                    </svg>
                                    Meeting link
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                                {appointment.customerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="font-medium text-gray-900">{appointment.customerName}</div>
                                <div className="text-sm text-gray-500">{appointment.customerEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(appointment.type || appointment.appointmentType || '')}`}>
                              {appointment.type || appointment.appointmentType || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-700">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(appointment.scheduledAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700">
                              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {appointment.duration} min
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Link
                              href={`/crads/appointments/${appointment.id}`}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
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
            {!loading && appointments.length === 0 && (
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
                <p className="mt-2 text-gray-600">
                  {search || statusFilter || typeFilter
                    ? 'Try adjusting your filters'
                    : 'Create a new appointment to get started'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="space-y-4">
            {/* Calendar Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateCalendar('prev')}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => navigateCalendar('next')}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{getCalendarTitle()}</h2>
                </div>

                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      calendarView === 'month'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      calendarView === 'week'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCalendarView('day')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      calendarView === 'day'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
                <p className="mt-4 text-gray-600">Loading calendar...</p>
              </div>
            ) : (
              renderCalendarGrid()
            )}
          </div>
        )}
      </div>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Appointment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAppointment.customerName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, customerName: e.target.value })}
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
                    value={newAppointment.customerEmail}
                    onChange={(e) => setNewAppointment({ ...newAppointment, customerEmail: e.target.value })}
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
                  value={newAppointment.customerPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, customerPhone: e.target.value })}
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
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  placeholder="e.g., Product Demo, Support Call"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newAppointment.appointmentType}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
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
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({ ...newAppointment, duration: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={newAppointment.timezone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, timezone: e.target.value })}
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
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newAppointment.scheduledAt}
                  onChange={(e) => setNewAppointment({ ...newAppointment, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Zoom, Google Meet, etc.)
                </label>
                <input
                  type="url"
                  value={newAppointment.meetingLink}
                  onChange={(e) => setNewAppointment({ ...newAppointment, meetingLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Location (if applicable)
                </label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  placeholder="Office address, conference room, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                  rows={3}
                  placeholder="Appointment details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
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
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
