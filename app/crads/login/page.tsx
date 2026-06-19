"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function CradsLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/crads/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Show success message
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful! Redirecting...',
        life: 1500,
      });

      // Short delay then redirect - don't set loading to false during redirect
      setTimeout(() => {
        const redirect = searchParams.get("redirect") || "/crads/dashboard";
        router.push(redirect);
      }, 500);
      
    } catch (err: any) {
      setError(err.message);
      toast.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: err.message || 'Invalid credentials',
        life: 3000,
      });
      setLoading(false); // Only set to false on error
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Toast ref={toast} />
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/Contain/slider-bg-1-2.jpg)'
          }}
        ></div>
        
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"></div>
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-[#FFD300] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">CabScript</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Admin Dashboard<br />
            <span className="text-[#FFD300]">Management System</span>
          </h2>
          
          <p className="text-gray-200 text-xl leading-relaxed mb-12">
            Manage your taxi booking platform efficiently with our comprehensive admin tools.
          </p>

          {/* Features List */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FFD300]/20 rounded-lg flex items-center justify-center shrink-0">
                <i className="pi pi-check text-[#FFD300] text-xl"></i>
              </div>
              <span className="text-gray-200 text-lg">Real-time booking management</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FFD300]/20 rounded-lg flex items-center justify-center shrink-0">
                <i className="pi pi-check text-[#FFD300] text-xl"></i>
              </div>
              <span className="text-gray-200 text-lg">Customer & driver analytics</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FFD300]/20 rounded-lg flex items-center justify-center shrink-0">
                <i className="pi pi-check text-[#FFD300] text-xl"></i>
              </div>
              <span className="text-gray-200 text-lg">Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-[#FFD300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">CabScript</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
            {/* Form Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
              <p className="text-gray-600 text-lg">Sign in to access your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border-l-4 border-red-500 flex items-start gap-3">
                <i className="pi pi-exclamation-circle text-red-500 text-lg mt-0.5"></i>
                <div>
                  <p className="text-red-800 font-semibold text-sm">Login Failed</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#FFD300] focus:ring-4 focus:ring-yellow-100 transition-all outline-none text-gray-900 text-base"
                    placeholder="admin@cabscript.com"
                    disabled={loading}
                  />
                  <i className="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-base font-bold text-gray-900 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#FFD300] focus:ring-4 focus:ring-yellow-100 transition-all outline-none text-gray-900 text-base"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <i className="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} text-lg`}></i>
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD300] hover:bg-yellow-400 text-gray-900 py-4.5 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-10 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="pi pi-spin pi-spinner text-xl"></i>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <i className="pi pi-arrow-right"></i>
                  </span>
                )}
              </button>
            </form>

           
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            © 2025 CabScript. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
