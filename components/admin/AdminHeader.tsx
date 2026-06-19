"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell, FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminHeader() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 fixed top-0 right-0 left-64 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Page Title or Breadcrumb */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-gray-400 hover:text-white">
            <FaBars className="w-5 h-5" />
          </button>
          <h1 className="text-white text-lg font-semibold">Admin Dashboard</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
            >
              <FaUserCircle className="w-8 h-8" />
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold">{admin?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{admin?.role || 'Administrator'}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-semibold text-white">{admin?.name}</p>
                  <p className="text-xs text-gray-400">{admin?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  {loading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
