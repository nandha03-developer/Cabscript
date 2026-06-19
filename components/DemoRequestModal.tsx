"use client";
import { useState } from "react";
import { trackDemoRequest } from "@/lib/analytics";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError("Too many requests. Please try again later.");
        } else if (data.details) {
          const errors: Record<string, string> = {};
          data.details.forEach((detail: { field: string; message: string }) => {
            errors[detail.field] = detail.message;
          });
          setFieldErrors(errors);
          setError("Please correct the errors below.");
        } else {
          setError(data.error || "An error occurred. Please try again.");
        }
        return;
      }

      setSuccess(data.message || "Demo request submitted successfully!");
      
      // Track conversion
      trackDemoRequest();
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        preferredDate: "",
        preferredTime: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Demo request error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/10 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Request a Demo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Schedule a personalized demo at your preferred time. Our team will contact you to confirm the session.
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="demo-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border ${fieldErrors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all`}
                  placeholder="John Doe"
                />
                {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="demo-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all`}
                  placeholder="john@example.com"
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="demo-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="demo-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${fieldErrors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all`}
                  placeholder="+1234567890"
                />
                {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
              </div>

              <div>
                <label htmlFor="demo-company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="demo-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${fieldErrors.company ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all`}
                  placeholder="Your Company"
                />
                {fieldErrors.company && <p className="mt-1 text-sm text-red-600">{fieldErrors.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="demo-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="demo-date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border ${fieldErrors.preferredDate ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all`}
                />
                {fieldErrors.preferredDate && <p className="mt-1 text-sm text-red-600">{fieldErrors.preferredDate}</p>}
              </div>

              <div>
                <label htmlFor="demo-time" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  id="demo-time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border ${fieldErrors.preferredTime ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all bg-white`}
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                  <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                  <option value="12:00-13:00">12:00 PM - 01:00 PM</option>
                  <option value="14:00-15:00">02:00 PM - 03:00 PM</option>
                  <option value="15:00-16:00">03:00 PM - 04:00 PM</option>
                  <option value="16:00-17:00">04:00 PM - 05:00 PM</option>
                  <option value="17:00-18:00">05:00 PM - 06:00 PM</option>
                </select>
                {fieldErrors.preferredTime && <p className="mt-1 text-sm text-red-600">{fieldErrors.preferredTime}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#FFD300] text-gray-900 rounded-lg font-semibold hover:bg-[#e6be00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Request Demo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
