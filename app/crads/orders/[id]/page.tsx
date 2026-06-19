'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

interface Order {
  id: number;
  orderNumber: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentId: string | null;
  paymentStatus: string | null;
  billingName: string;
  billingEmail: string;
  billingPhone: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingCountry: string | null;
  billingZip: string | null;
  licenseKey: string | null;
  downloadUrl: string | null;
  licenseExpiry: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
  } | null;
  invoice: {
    id: number;
    invoiceNumber: string;
    status: string;
    totalAmount: number;
  } | null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
    licenseKey: '',
    downloadUrl: '',
    licenseExpiry: '',
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data.order);
      setEditForm({
        status: data.order.status,
        notes: data.order.notes || '',
        licenseKey: data.order.licenseKey || '',
        downloadUrl: data.order.downloadUrl || '',
        licenseExpiry: data.order.licenseExpiry ? data.order.licenseExpiry.split('T')[0] : '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/crads/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editForm.status,
          notes: editForm.notes || null,
          licenseKey: editForm.licenseKey || null,
          downloadUrl: editForm.downloadUrl || null,
          licenseExpiry: editForm.licenseExpiry || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      await fetchOrder();
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Order updated successfully!',
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/crads/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Order deleted successfully!',
        life: 2000,
      });
      
      setTimeout(() => {
        router.push('/crads/orders');
      }, 1500);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'An error occurred',
        life: 3000,
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const response = await fetch('/api/crads/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create invoice');
      }

      const data = await response.json();
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Invoice created successfully!',
        life: 2000,
      });
      setTimeout(() => {
        router.push(`/crads/invoices/${data.invoice.id}`);
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
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/crads/orders')}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Orders
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
          href="/crads/orders"
          className="text-yellow-600 hover:text-yellow-700 font-medium mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-gray-600">
                Created {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!order.invoice && (
              <button
                onClick={handleCreateInvoice}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <i className="pi pi-file-pdf mr-2"></i>
                Create Invoice
              </button>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              <i className="pi pi-trash mr-2"></i>
              Delete Order
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-60"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <i className="pi pi-exclamation-triangle text-3xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Order</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete order ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-600">Plan</div>
                <div className="font-semibold text-lg capitalize">{order.plan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Amount</div>
                <div className="font-semibold text-lg">{formatCurrency(order.amount, order.currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Payment Method</div>
                <div className="font-medium capitalize">{order.paymentMethod}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Payment ID</div>
                <div className="font-medium text-sm">{order.paymentId || 'N/A'}</div>
              </div>
            </div>

            {order.paidAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-green-800">Paid on {formatDate(order.paidAt)}</div>
              </div>
            )}

            {order.deliveredAt && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-semibold text-blue-800">Delivered on {formatDate(order.deliveredAt)}</div>
              </div>
            )}
          </div>

          {/* Update Order Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Update Order</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Key
                </label>
                <input
                  type="text"
                  value={editForm.licenseKey}
                  onChange={(e) => setEditForm({ ...editForm, licenseKey: e.target.value })}
                  placeholder="Enter license key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Download URL
                </label>
                <input
                  type="url"
                  value={editForm.downloadUrl}
                  onChange={(e) => setEditForm({ ...editForm, downloadUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry
                </label>
                <input
                  type="date"
                  value={editForm.licenseExpiry}
                  onChange={(e) => setEditForm({ ...editForm, licenseExpiry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={4}
                  placeholder="Add internal notes about this order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Order'}
              </button>
            </form>
          </div>

          {/* Current License Info */}
          {(order.licenseKey || order.downloadUrl) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">License Information</h2>
              
              {order.licenseKey && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">License Key</div>
                  <div className="font-mono bg-gray-50 p-3 rounded border text-sm">
                    {order.licenseKey}
                  </div>
                </div>
              )}

              {order.downloadUrl && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Download URL</div>
                  <a
                    href={order.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm break-all"
                  >
                    {order.downloadUrl}
                  </a>
                </div>
              )}

              {order.licenseExpiry && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Expires On</div>
                  <div className="font-medium">{formatDate(order.licenseExpiry)}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer & Billing Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Customer</h2>
            
            {order.customer ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{order.customer.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
                {order.customer.phone && (
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{order.customer.phone}</div>
                  </div>
                )}
                {order.customer.company && (
                  <div>
                    <div className="text-sm text-gray-600">Company</div>
                    <div className="font-medium">{order.customer.company}</div>
                  </div>
                )}
              
                <Link
                  href={`/crads/customers/${order.customer.id}`}
                  className="mt-4 inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  View Customer Profile →
                </Link>
              </div>
            ) : (
              <div className="text-gray-500">Customer information not available</div>
            )}
          </div>

          {/* Billing Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Billing Details</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{order.billingName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{order.billingEmail}</div>
              </div>
              {order.billingPhone && (
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium">{order.billingPhone}</div>
                </div>
              )}
              {order.billingAddress && (
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-medium">
                    {order.billingAddress}
                    {order.billingCity && <><br />{order.billingCity}</>}
                    {order.billingCountry && <><br />{order.billingCountry}</>}
                    {order.billingZip && <> {order.billingZip}</>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Invoice */}
          {order.invoice && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Invoice</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Invoice Number</div>
                  <div className="font-medium">{order.invoice.invoiceNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.invoice.status)}`}>
                    {order.invoice.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-semibold">{formatCurrency(order.invoice.totalAmount, order.currency)}</div>
                </div>
              </div>

              <Link
                href={`/crads/invoices/${order.invoice.id}`}
                className="mt-4 inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm"
              >
                View Invoice →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
