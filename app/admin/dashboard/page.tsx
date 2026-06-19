"use client";

import { useState, useEffect } from 'react';
import { 
  FaShoppingCart, 
  FaEnvelope, 
  FaUsers, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaSpinner
} from 'react-icons/fa';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

interface ContactStats {
  totalContacts: number;
  newContacts: number;
  resolvedContacts: number;
}

interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [orderStats, setOrderStats] = useState<Stats | null>(null);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, contactsRes, customersRes] = await Promise.all([
        fetch('/api/admin/orders?limit=5'),
        fetch('/api/admin/contacts?limit=5'),
        fetch('/api/admin/customers?limit=5'),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrderStats(data.stats);
        setRecentOrders(data.orders);
      }

      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContactStats(data.stats);
      }

      if (customersRes.ok) {
        const data = await customersRes.json();
        setCustomerStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="w-8 h-8 text-[#FFD300] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 bg-opacity-10 p-3 rounded-lg">
              <FaDollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-semibold">
              <FaArrowUp className="w-3 h-3 mr-1" />
              12.5%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-white text-2xl font-bold">
            ${orderStats?.totalRevenue?.toLocaleString() || '0'}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 bg-opacity-10 p-3 rounded-lg">
              <FaShoppingCart className="w-6 h-6 text-blue-500" />
            </div>
            <span className="flex items-center text-blue-500 text-sm font-semibold">
              <FaArrowUp className="w-3 h-3 mr-1" />
              8.2%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Orders</h3>
          <p className="text-white text-2xl font-bold">{orderStats?.totalOrders || 0}</p>
        </div>

        {/* Total Customers */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 bg-opacity-10 p-3 rounded-lg">
              <FaUsers className="w-6 h-6 text-purple-500" />
            </div>
            <span className="flex items-center text-purple-500 text-sm font-semibold">
              <FaArrowUp className="w-3 h-3 mr-1" />
              15.3%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Customers</h3>
          <p className="text-white text-2xl font-bold">{customerStats?.totalCustomers || 0}</p>
        </div>

        {/* New Contacts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
              <FaEnvelope className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="flex items-center text-red-500 text-sm font-semibold">
              <FaArrowDown className="w-3 h-3 mr-1" />
              3.1%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">New Contacts</h3>
          <p className="text-white text-2xl font-bold">{contactStats?.newContacts || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <a href="/crads/orders" className="text-[#FFD300] hover:text-[#E6BE00] text-sm font-semibold">
            View All →
          </a>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Order #</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Customer</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Plan</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Amount</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 last:border-0">
                    <td className="py-4 text-white font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-4 text-gray-300">{order.customerName}</td>
                    <td className="py-4 text-gray-300">{order.planName}</td>
                    <td className="py-4 text-white font-semibold">${order.amount.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'COMPLETED' ? 'bg-green-500 bg-opacity-10 text-green-500' : ''}
                        ${order.status === 'PENDING' ? 'bg-yellow-500 bg-opacity-10 text-yellow-500' : ''}
                        ${order.status === 'PROCESSING' ? 'bg-blue-500 bg-opacity-10 text-blue-500' : ''}
                        ${order.status === 'FAILED' ? 'bg-red-500 bg-opacity-10 text-red-500' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
}
