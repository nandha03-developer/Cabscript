'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

interface Customer {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
  lastOrderAt: string | null;
  orders: Order[];
  contacts: Contact[];
  _count: {
    orders: number;
    contacts: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  invoice: Invoice | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalSpent: number;
  pendingContacts: number;
  totalOrders: number;
  totalContacts: number;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    company: '',
    country: '',
  });

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/customers/${customerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }

      const data = await response.json();
      setCustomer(data.customer);
      setStats(data.stats);
      setEditForm({
        name: data.customer.name,
        phone: data.customer.phone || '',
        company: data.customer.company || '',
        country: data.customer.country || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/crads/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      setIsEditing(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Customer updated successfully!',
        life: 3000,
      });
      fetchCustomer();
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await fetch(`/api/crads/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Customer deleted successfully!',
        life: 2000,
      });

      setTimeout(() => {
        router.push('/crads/customers');
      }, 2000);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
      setShowDeleteModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      NEW: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error || 'Customer not found'}</p>
          <button
            onClick={() => router.push('/crads/customers')}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Customers
          </button>
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
          href="/crads/customers"
          className="text-yellow-600 hover:text-yellow-700 font-medium mb-4 inline-block"
        >
          ← Back to Customers
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-1">{customer.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Customer'}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalSpent)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Contacts</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Pending Contacts</div>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingContacts}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>

            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{customer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium">{customer.phone || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Company</div>
                  <div className="font-medium">{customer.company || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Country</div>
                  <div className="font-medium">{customer.country || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Customer Since</div>
                  <div className="font-medium">{formatDate(customer.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Order</div>
                  <div className="font-medium">
                    {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : 'Never'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders & Tickets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Orders ({customer.orders.length})</h2>

            {customer.orders.length > 0 ? (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.plan.charAt(0).toUpperCase() + order.plan.slice(1)} Plan
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.amount, order.currency)}
                        </span>
                        {order.invoice && (
                          <span className="ml-2 text-gray-500">
                            • Invoice: {order.invoice.invoiceNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/crads/orders/${order.id}`}
                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        View Order →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders yet
              </div>
            )}
          </div>

          {/* Contact Forms */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Recent Contact Forms ({customer.contacts.length})
            </h2>

            {customer.contacts.length > 0 ? (
              <div className="space-y-3">
                {customer.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-sm text-gray-600">{contact.phone}</div>
                        )}
                        <div className="text-sm text-gray-600 mt-2">{contact.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(contact.createdAt)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No contact forms submitted
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative z-10 animate-scale-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <i className="pi pi-exclamation-triangle text-red-600 text-3xl"></i>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">Delete Customer</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete ? 
              This will permanently delete all associated orders, invoices, and support tickets. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
