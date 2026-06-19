"use client";

import { useState } from "react";

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
}

export default function EmailTestingPageClient() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "order-confirmation",
      name: "Order Confirmation",
      description: "Sent when a customer places an order",
    },
    {
      id: "license-key",
      name: "License Key Delivery",
      description: "Sent with license key and download links",
    },
    {
      id: "appointment-reminder",
      name: "Appointment Reminder",
      description: "Sent to remind customers about appointments",
    },
    {
      id: "password-reset",
      name: "Password Reset",
      description: "Sent when admin requests password reset",
    },
    {
      id: "support-ticket",
      name: "Support Ticket",
      description: "Sent when a support ticket is created",
    },
    {
      id: "invoice",
      name: "Invoice",
      description: "Sent with invoice details and PDF",
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: selectedTemplate,
          recipientEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: `✅ Test email sent to ${recipientEmail}` });
        setRecipientEmail("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send test email" });
      }
    } catch (error) {
      console.error("Send test email error:", error);
      setMessage({ type: "error", text: "Failed to send test email" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Testing</h1>
          <p className="mt-2 text-gray-600">Test email templates and delivery</p>
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

        {/* Email Configuration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">📧 Email Configuration</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Provider:</strong> {process.env.NEXT_PUBLIC_EMAIL_PROVIDER || "Console (Development)"}
            </p>
            <p>
              <strong>From Address:</strong> {process.env.NEXT_PUBLIC_EMAIL_FROM || "noreply@cabscript.com"}
            </p>
            <p className="mt-4 text-xs">
              💡 <strong>Tip:</strong> In development mode, emails are logged to console. Configure
              RESEND_API_KEY or SENDGRID_API_KEY in your .env.local file for production use.
            </p>
          </div>
        </div>

        {/* Test Email Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Send Test Email</h2>

          <form onSubmit={handleSendTest} className="space-y-6">
            {/* Email Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="">Select a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {selectedTemplate && (
                <p className="mt-2 text-sm text-gray-600">
                  {templates.find((t) => t.id === selectedTemplate)?.description}
                </p>
              )}
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                The test email will be sent to this address
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedTemplate || !recipientEmail}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Test Email"}
            </button>
          </form>
        </div>

        {/* Available Templates */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Available Email Templates</h2>
          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-yellow-400 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <p className="text-xs text-gray-500 mt-2">ID: {template.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">🔧 Email Service Setup</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Option 1: Resend (Recommended)</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Sign up at resend.com</li>
                <li>Generate an API key</li>
                <li>Add to .env.local: <code className="bg-gray-200 px-2 py-1 rounded">EMAIL_PROVIDER=resend</code></li>
                <li>Add: <code className="bg-gray-200 px-2 py-1 rounded">RESEND_API_KEY=re_xxxxx</code></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Option 2: SendGrid</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Sign up at sendgrid.com</li>
                <li>Generate an API key</li>
                <li>Add to .env.local: <code className="bg-gray-200 px-2 py-1 rounded">EMAIL_PROVIDER=sendgrid</code></li>
                <li>Add: <code className="bg-gray-200 px-2 py-1 rounded">SENDGRID_API_KEY=SG.xxxxx</code></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Optional Configuration</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-gray-200 px-2 py-1 rounded">EMAIL_FROM=noreply@yourdomain.com</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">EMAIL_FROM_NAME=Your Company Name</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
