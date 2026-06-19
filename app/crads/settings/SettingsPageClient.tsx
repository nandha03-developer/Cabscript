"use client";

import { useState, useEffect } from "react";
import { Input, Button, Switch } from "@/components/admin/forms";

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  createdAt: string;
}

export default function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Success/Error messages
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("/api/crads/auth/session");
      const data = await response.json();

      if (data.authenticated && data.admin) {
        setAdmin(data.admin);
        setName(data.admin.name);
        setEmail(data.admin.email);
        setTwoFactorEnabled(data.admin.twoFactorEnabled || false);
        setEmailNotifications(data.admin.emailNotifications !== false);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/crads/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        fetchAdminProfile();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/crads/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSecurity = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/crads/settings/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twoFactorEnabled,
          emailNotifications,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Security settings updated!" });
        fetchAdminProfile();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "system", label: "System", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your admin account and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cabscript.com"
                  required
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Account Role</p>
                      <p className="text-sm text-gray-600">{admin?.role || "ADMIN"}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      Admin
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {admin?.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" loading={saving}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setName(admin?.name || "");
                      setEmail(admin?.email || "");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-2xl">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  helperText="Use at least 8 characters with a mix of letters, numbers, and symbols"
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />

                <Button type="submit" loading={saving}>
                  Change Password
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>

              <div className="space-y-6 max-w-2xl">
                {/* Two-Factor Authentication */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Two-Factor Authentication
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          twoFactorEnabled
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account by requiring a verification
                      code in addition to your password
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    label=""
                  />
                </div>

                {/* Session Management */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Active Sessions</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Manage devices and sessions where you're currently logged in
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500">Active now</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                        This device
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleUpdateSecurity} loading={saving}>
                  Save Security Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h2>

              <div className="space-y-4 max-w-2xl">
                {/* Email Notifications */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive email notifications for important events and updates
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    label=""
                  />
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Notification Types</h3>

                  <div className="space-y-2">
                    {[
                      { label: "New Orders", description: "Get notified when a new order is placed" },
                      {
                        label: "Support Tickets",
                        description: "Alerts for new and updated support tickets",
                      },
                      {
                        label: "System Alerts",
                        description: "Important system notifications and updates",
                      },
                      {
                        label: "Weekly Reports",
                        description: "Receive weekly performance and analytics reports",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpdateSecurity} loading={saving}>
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>

              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Version</p>
                    <p className="text-lg font-semibold text-gray-900">1.0.0</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Environment</p>
                    <p className="text-lg font-semibold text-gray-900">Production</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Database</p>
                    <p className="text-lg font-semibold text-gray-900">PostgreSQL</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Storage</p>
                    <p className="text-lg font-semibold text-gray-900">AWS S3</p>
                  </div>
                </div>

                {/* System Actions */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">System Actions</h3>
                  <div className="space-y-2">
                    <Button variant="secondary" fullWidth>
                      Clear Cache
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Export System Logs
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Database Backup
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-red-200 pt-6">
                  <h3 className="text-sm font-semibold text-red-900 mb-3">Danger Zone</h3>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 mb-3">
                      These actions are irreversible. Please be certain before proceeding.
                    </p>
                    <Button variant="danger">
                      Delete Admin Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
