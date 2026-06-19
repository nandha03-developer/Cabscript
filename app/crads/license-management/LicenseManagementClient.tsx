"use client";

import { useState } from "react";

interface LicenseDetails {
  key: string;
  order: {
    id: string;
    orderNumber: string;
    plan: string;
    status: string;
    customer: {
      name: string;
      email: string;
      company?: string;
    };
    createdAt: string;
    paidAt?: string;
    deliveredAt?: string;
    licenseExpiry?: string;
  };
  activations: Array<{
    deviceInfo: string;
    activatedAt: string;
    lastActivatedAt: string;
    ipAddress: string;
  }>;
  isRevoked: boolean;
  isExpired: boolean;
  canActivate: boolean;
}

export default function LicenseManagementClient() {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [licenseDetails, setLicenseDetails] = useState<LicenseDetails | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const searchLicense = async () => {
    if (!searchKey.trim()) {
      setMessage({ type: "error", text: "Please enter a license key" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setLicenseDetails(null);

    try {
      const response = await fetch(`/api/admin/license?key=${encodeURIComponent(searchKey)}`);
      const data = await response.json();

      if (response.ok) {
        setLicenseDetails(data);
      } else {
        setMessage({ type: "error", text: data.error || "License key not found" });
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage({ type: "error", text: "Failed to search license key" });
    } finally {
      setLoading(false);
    }
  };

  const revokeLicense = async (reason: string) => {
    if (!licenseDetails) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/license?key=${encodeURIComponent(licenseDetails.key)}&reason=${encodeURIComponent(reason)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "License key revoked successfully" });
        searchLicense(); // Refresh details
      } else {
        setMessage({ type: "error", text: data.error || "Failed to revoke license" });
      }
    } catch (error) {
      console.error("Revoke error:", error);
      setMessage({ type: "error", text: "Failed to revoke license key" });
    } finally {
      setLoading(false);
    }
  };

  const deactivateDevice = async (deviceInfo: string) => {
    if (!licenseDetails) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/license", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: licenseDetails.key,
          deviceInfo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Device deactivated successfully" });
        searchLicense(); // Refresh details
      } else {
        setMessage({ type: "error", text: data.error || "Failed to deactivate device" });
      }
    } catch (error) {
      console.error("Deactivate error:", error);
      setMessage({ type: "error", text: "Failed to deactivate device" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">License Key Management</h1>
          <p className="mt-2 text-gray-600">Search, validate, and manage license keys</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Search License Key</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value.toUpperCase())}
              placeholder="Enter license key (e.g., XXXX-XXXX-XXXX-XXXX...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono"
              onKeyPress={(e) => e.key === "Enter" && searchLicense()}
            />
            <button
              onClick={searchLicense}
              disabled={loading}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* License Details */}
        {licenseDetails && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">License Details</h2>
                <div className="flex gap-2">
                  {licenseDetails.isRevoked && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Revoked
                    </span>
                  )}
                  {licenseDetails.isExpired && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      Expired
                    </span>
                  )}
                  {!licenseDetails.isRevoked && !licenseDetails.isExpired && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">License Key</p>
                  <p className="font-mono text-lg font-semibold text-gray-900 mt-1">
                    {licenseDetails.key}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                    {licenseDetails.order.plan}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {licenseDetails.order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                    {licenseDetails.order.status}
                  </p>
                </div>
                {licenseDetails.order.licenseExpiry && (
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(licenseDetails.order.licenseExpiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Activations</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {licenseDetails.activations.length} active
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900 mt-1">{licenseDetails.order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 mt-1">{licenseDetails.order.customer.email}</p>
                </div>
                {licenseDetails.order.customer.company && (
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="text-gray-900 mt-1">{licenseDetails.order.customer.company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Active Installations ({licenseDetails.activations.length})
              </h3>
              {licenseDetails.activations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active installations</p>
              ) : (
                <div className="space-y-3">
                  {licenseDetails.activations.map((activation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activation.deviceInfo}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Activated:{" "}
                          {new Date(activation.activatedAt).toLocaleDateString()}{" "}
                          {new Date(activation.activatedAt).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last Active:{" "}
                          {new Date(activation.lastActivatedAt).toLocaleDateString()}{" "}
                          {new Date(activation.lastActivatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deactivateDevice(activation.deviceInfo)}
                        disabled={loading}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {!licenseDetails.isRevoked && (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                <p className="text-gray-600 mb-4">
                  Revoking a license key will permanently disable it. This action cannot be undone.
                </p>
                <button
                  onClick={() => {
                    const reason = prompt("Enter reason for revocation:");
                    if (reason) revokeLicense(reason);
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  Revoke License Key
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
