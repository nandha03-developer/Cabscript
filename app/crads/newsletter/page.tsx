'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

interface Newsletter {
  id: number;
  email: string;
  name: string | null;
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED' | 'COMPLAINED';
  source: string | null;
  interests: string[];
  subscribedAt: string;
  unsubscribedAt: string | null;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
}

interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function NewsletterPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [subscriptions, setSubscriptions] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [stats, setStats] = useState<NewsletterStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState<number | null>(null);
  const [newSubscription, setNewSubscription] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [pagination.page, search, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        _t: Date.now().toString(), // Cache buster
      });

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/crads/newsletter?${params}`, {
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/crads/login');
          return;
        }
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 0 });
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0, bounced: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination({ ...pagination, page: 1 });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      UNSUBSCRIBED: 'bg-gray-100 text-gray-800',
      BOUNCED: 'bg-red-100 text-red-800',
      COMPLAINED: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      // Ensure we have a valid numeric ID
      if (!id || isNaN(id)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid subscription ID. Please refresh the page.',
          life: 3000,
        });
        return;
      }

      const response = await fetch(`/api/crads/newsletter/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Status updated successfully!',
        life: 3000,
      });
      
      // Refresh the data
      await fetchSubscriptions();
    } catch (err) {
      console.error('Status update error:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
      
      // If it's an ID format error, refresh the page
      if (err instanceof Error && err.message.includes('Invalid subscription ID format')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const handleCreateSubscription = async () => {
    try {
      if (!newSubscription.email) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Email is required',
          life: 3000,
        });
        return;
      }

      const response = await fetch('/api/crads/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscription),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create subscription');
      }

      setShowCreateModal(false);
      setNewSubscription({ email: '', name: '' });
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Subscription created successfully!',
        life: 3000,
      });
      fetchSubscriptions();
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Ensure we have a valid numeric ID
      if (!id || isNaN(id)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid subscription ID. Please refresh the page.',
          life: 3000,
        });
        return;
      }

      const response = await fetch(`/api/crads/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subscription');
      }

      setShowDeleteModal(false);
      setDeleteSubscriptionId(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Subscription deleted successfully!',
        life: 3000,
      });
      
      // Refresh the data
      await fetchSubscriptions();
    } catch (err) {
      console.error('Delete error:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
      
      // If it's an ID format error, refresh the page
      if (err instanceof Error && err.message.includes('Invalid subscription ID format')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteSubscriptionId(id);
    setShowDeleteModal(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Status', 'Source', 'Emails Sent', 'Emails Opened', 'Emails Clicked', 'Subscribed'];
    const rows = subscriptions.map((sub) => [
      sub.id.toString(),
      sub.email,
      sub.name || '',
      sub.status,
      sub.source || '',
      sub.emailsSent.toString(),
      sub.emailsOpened.toString(),
      sub.emailsClicked.toString(),
      formatDate(sub.subscribedAt),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <Toast ref={toast} />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-gray-600 mt-1">Manage newsletter subscribers and email campaigns</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Subscribers</div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Active Subscribers</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Unsubscribed</div>
            <div className="text-2xl font-bold text-gray-600">{stats.unsubscribed}</div>
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
                  placeholder="Email or name..."
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
                  <option value="ACTIVE">Active</option>
                  <option value="UNSUBSCRIBED">Unsubscribed</option>
                  <option value="BOUNCED">Bounced</option>
                  <option value="COMPLAINED">Complained</option>
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

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
                >
                  + Add Subscriber
                </button>
              </div>
            </div>
          </form>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              {pagination.total} total subscribers
            </p>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchSubscriptions}
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subscriber</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email Stats</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subscribed</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 text-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="ml-3">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions table */}
        {!loading && subscriptions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Subscriber
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email Stats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription, index) => (
                    <tr key={subscription.id} className="hover:bg-yellow-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">{subscription.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {subscription.name ? subscription.name.charAt(0).toUpperCase() : subscription.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">
                              {subscription.name || 'Anonymous'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                          {subscription.status === 'ACTIVE' && '✓ Active'}
                          {subscription.status === 'UNSUBSCRIBED' && '✗ Unsubscribed'}
                          {subscription.status === 'BOUNCED' && '⚠ Bounced'}
                          {subscription.status === 'COMPLAINED' && '⚠ Complained'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-medium capitalize">
                          {subscription.source || 'Website'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-bold text-gray-900">Sent: {subscription.emailsSent}</div>
                          <div className="text-gray-500">
                            📧 Opened: {subscription.emailsOpened} | 👆 Clicked: {subscription.emailsClicked}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-gray-900 font-medium">
                          {formatDate(subscription.subscribedAt)}
                        </div>
                        <div className="text-xs text-green-500 mt-1">
                          ✓ Subscribed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {subscription.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleStatusUpdate(subscription.id, 'UNSUBSCRIBED')}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
                              title="Unsubscribe"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusUpdate(subscription.id, 'ACTIVE')}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 transition-colors group"
                              title="Reactivate"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => confirmDelete(subscription.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && subscriptions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No subscribers found</h3>
              <p className="mt-2 text-gray-500">
                {search || statusFilter ? 'Try adjusting your search filters.' : 'Get started by adding your first subscriber.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
                >
                  + Add Subscriber
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Newsletter Subscriber</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newSubscription.email}
                    onChange={(e) => setNewSubscription({ ...newSubscription, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter subscriber name"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubscription}
                  className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  Add Subscriber
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Subscription</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this subscription? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteSubscriptionId(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSubscriptionId && handleDelete(deleteSubscriptionId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}