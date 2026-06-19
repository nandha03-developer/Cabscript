"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaCommentDots,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import Spinner from "./Spinner";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Clear form fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || 'Failed to send message');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-yellow">
      {/* Banner Section */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat h-[550px] md:h-[480px]" // 🔹 height increased for good space
        style={{
          backgroundImage: "url('/Contain/contact-bg-1-1.jpg')", // replace with your image path
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Centered text */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center h-[50%]">
          <p className="text-gray-50 text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-10 h-0.5 bg-yellow-400"></span> Get in Touch
          </p>
          <h2 className="text-4xl md:text-4xl font-extrabold text-white mt-3 drop-shadow-lg">
            Contact Us Today
          </h2>
        </div>
      </div>

      {/* Floating Form Section */}
      <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4">
        <div className="bg-white rounded-sm p-6 md:p-8 flex flex-col lg:flex-row items-start justify-between">
          {/* Left Side Image - Positioned Much Higher and More to Left */}
          <div className="lg:w-[45%] w-full flex justify-center lg:justify-start mb-6 lg:mb-0 lg:-mt-48 lg:-ml-8">
            <Image
              src="/Contain/contact-person-1-1.png"
              alt="Support"
              width={380}
              height={520}
              className="object-contain"
            />
          </div>

          {/* Right Side Form - Clean Design */}
          <div className="lg:w-[55%] w-full lg:mt-4">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left">
              Free Online Quote Now!
            </h3>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                <FaCheckCircle className="text-green-500 text-xl shrink-0" />
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    disabled={loading}
                    className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 disabled:opacity-50"
                  />
                  <FaUser className="absolute top-3 right-0 text-gray-400 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email ID"
                    required
                    disabled={loading}
                    className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 disabled:opacity-50"
                  />
                  <FaEnvelope className="absolute top-3 right-0 text-gray-400 text-lg" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone No."
                    disabled={loading}
                    className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 disabled:opacity-50"
                  />
                  <FaPhone className="absolute top-3 right-0 text-gray-400 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    disabled={loading}
                    className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 disabled:opacity-50"
                  />
                  <FaEdit className="absolute top-3 right-0 text-gray-400 text-lg" />
                </div>
              </div>

              {/* Message Box */}
              <div className="relative">
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  disabled={loading}
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none transition-colors duration-300 disabled:opacity-50"
                ></textarea>
                <FaCommentDots className="absolute top-3 right-0 text-gray-400 text-lg" />
              </div>

              {/* Button */}
              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" color="text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Extra padding bottom for layout spacing */}
      <div className="h-[400px]"></div>
    </section>
  );
};

export default ContactSection;
