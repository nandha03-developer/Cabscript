"use client";

export const dynamic = 'force-dynamic';
import React from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/Contain/slider-bg-1-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Navigation */}
        <Navigation />

        {/* Privacy Policy Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  PRIVACY POLICY
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section with Light Background */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              {/* White Card */}
              <div className="bg-white shadow-2xl drop-shadow-xl rounded-lg p-8 md:p-12" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'}}>
                {/* Introduction */}
                <div className="mb-6">
                  <p className="text-gray-500 leading-relaxed text-[22px] font-bold">
                    Cabscript respects your privacy and is committed to protecting your personal information. This
                    Privacy Policy explains how we collect, use, and safeguard your data when you use our services,
                    including the Uber Clone app, website, and related platforms.
                  </p>
                </div>

              {/* Data Security */}
              <div className="mb-6">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold">Data Security</h2>
                <p className="text-gray-500 text-[18px] leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your data against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              {/* What we collect */}
              {/* What we collect */}
              <div className="mb-6">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold ">What we collect from you?</h2>
                <p className="text-gray-500 text-[18px] leading-relaxed mb-3">
                  "Personal Information" includes your name, address information, personal e-mail address and URL,
                  account username and password, as well as other, similar information. "Non-Identifying Personal
                  Information" includes information about you, including, without limitation, your Internet service
                  provider, browser type, domain name, the Web Site that referred you to us, the web pages you request,
                  the date and time of those requests, and entry and exit points.
                </p>

                <ul className="space-y-2">
                  <li className="flex items-start text-gray-500 text-[18px]">
                    <span className="text-gray-400 mr-2 mt-0.5">•</span>
                    Before or at the time of collecting personal information, we will identify the purposes for which
                    information is being collected.
                  </li>
                  <li className="flex items-start text-gray-500 text-[18px]">
                    <span className="text-gray-400 mr-2 mt-0.5">•</span>
                    We will only retain personal information as long as necessary for the fulfillment of those purposes.
                  </li>
                  <li className="flex items-start text-gray-500 text-[18px]">
                    <span className="text-gray-400 mr-2 mt-0.5">•</span>
                    We will collect personal information by lawful and fair means and, where appropriate, with the
                    knowledge or consent of the individual concerned.
                  </li>
                  <li className="flex items-start text-gray-500 text-[18px]">
                    <span className="text-gray-400 mr-2 mt-0.5">•</span>
                    We will protect personal information by reasonable security safeguards against loss or theft, as well
                    as unauthorized access, disclosure, copying, use or modification.
                  </li>
                </ul>
              </div>

              {/* Use of Personal Information */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Use of Personal Information</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  We use your personal information for the following purposes:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To process and deliver your orders</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To provide customer support and respond to your inquiries</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To send you important updates about your purchase and our services</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To send marketing communications (only with your consent, which can be withdrawn at any time)</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To improve our website and services through analytics</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>To comply with legal obligations</span>
                  </li>
                </ul>
              </div>

              {/* Legal Basis for Processing (GDPR) */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Legal Basis for Processing (GDPR)</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  Under GDPR, we process your personal data based on the following legal grounds:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Contract:</strong> Processing is necessary to fulfill our contract with you (order delivery, customer support)</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Consent:</strong> You have given explicit consent for marketing communications and analytics cookies</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Legitimate Interest:</strong> To improve our services, prevent fraud, and ensure website security</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Legal Obligation:</strong> To comply with tax, accounting, and other legal requirements</span>
                  </li>
                </ul>
              </div>

              {/* Data Retention */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Data Retention</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  We retain your personal information only as long as necessary for the purposes outlined in this policy:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Order Data:</strong> 7 years (for accounting and tax compliance)</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Customer Accounts:</strong> Until account deletion is requested</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Marketing Data:</strong> Until consent is withdrawn or 2 years of inactivity</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Support Tickets:</strong> 3 years after resolution</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>Analytics Data:</strong> 26 months (Google Analytics default)</span>
                  </li>
                </ul>
              </div>

              {/* International Data Transfers */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">International Data Transfers</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA), 
                  including the United States where our servers are located. We ensure appropriate safeguards are in place:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>Standard Contractual Clauses (SCCs) approved by the European Commission</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>Data processing agreements with all third-party service providers</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>Encryption in transit and at rest for all sensitive data</span>
                  </li>
                </ul>
              </div>

              {/* Your Data Protection Rights */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Your Data Protection Rights</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  Under GDPR and other data protection laws, you have the following rights:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Access</h3>
                    <p className="text-gray-600 text-[16px]">
                      Request a copy of all personal data we hold about you. We'll provide this within 30 days.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Rectification</h3>
                    <p className="text-gray-600 text-[16px]">
                      Request correction of inaccurate or incomplete personal data.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Erasure ("Right to be Forgotten")</h3>
                    <p className="text-gray-600 text-[16px]">
                      Request deletion of your personal data when there's no compelling reason for continued processing.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Restriction of Processing</h3>
                    <p className="text-gray-600 text-[16px]">
                      Request that we limit the processing of your personal data under certain circumstances.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Data Portability</h3>
                    <p className="text-gray-600 text-[16px]">
                      Receive your personal data in a structured, machine-readable format and transmit it to another controller.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Object</h3>
                    <p className="text-gray-600 text-[16px]">
                      Object to processing of your personal data for direct marketing purposes at any time.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#FFD300] pl-4">
                    <h3 className="font-bold text-gray-700 mb-2">Right to Withdraw Consent</h3>
                    <p className="text-gray-600 text-[16px]">
                      Withdraw your consent at any time where we rely on consent to process your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Exercise Your Rights */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">How to Exercise Your Rights</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  To exercise any of your data protection rights, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Email:</span>
                      <a href="mailto:privacy@cabscript.com" className="text-[#FFD300] hover:underline">privacy@cabscript.com</a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Subject Line:</span>
                      <span>"Data Protection Request - [Your Request Type]"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Response Time:</span>
                      <span>Within 30 days of receipt</span>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600 text-[18px] leading-relaxed">
                  We may need to verify your identity before processing your request. This is a security measure to ensure 
                  personal data is not disclosed to unauthorized parties.
                </p>
              </div>

              {/* Supervisory Authority */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Right to Lodge a Complaint</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  If you believe we have not handled your personal data properly, you have the right to lodge a complaint 
                  with your local data protection supervisory authority:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>EU/EEA:</strong> Contact your national Data Protection Authority (<a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">Find your DPA</a>)</span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>UK:</strong> Information Commissioner's Office (ICO) - <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">ico.org.uk</a></span>
                  </li>
                  <li className="flex items-start text-gray-600 text-[18px]">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span><strong>USA:</strong> Federal Trade Commission (FTC) - <a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">ftc.gov</a></span>
                  </li>
                </ul>
              </div>

              {/* Third-Party Services */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Third-Party Services</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  We use the following trusted third-party services to process your data:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Privacy Policy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Stripe</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Payment Processing</td>
                        <td className="px-6 py-4 text-sm"><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">View Policy</a></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Razorpay</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Payment Processing</td>
                        <td className="px-6 py-4 text-sm"><a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">View Policy</a></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Google Analytics</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Website Analytics</td>
                        <td className="px-6 py-4 text-sm"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">View Policy</a></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Facebook Pixel</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Advertising & Analytics</td>
                        <td className="px-6 py-4 text-sm"><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">View Policy</a></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Tawk.to</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Live Chat Support</td>
                        <td className="px-6 py-4 text-sm"><a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#FFD300] hover:underline">View Policy</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Updates to Policy */}
              <div className="mb-8">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                  We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. 
                  For significant changes, we may also notify you via email.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-0">
                <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Contact Us</h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Data Protection Officer:</span>
                      <a href="mailto:privacy@cabscript.com" className="text-[#FFD300] hover:underline">support@laabamone.com</a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">General Support:</span>
                      <a href="mailto:support@cabscript.com" className="text-[#FFD300] hover:underline">support@cabscript.com</a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Phone:</span>
                      <a href="tel:+1234567890" className="text-[#FFD300] hover:underline">0452-4905167</a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Address:</span>
                      <span>Priya Complex 285 A, East Cross Street, opp. Road, Madurai, Tamil Nadu - 625020</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

            
            </div>
          </div>
            <div className="flex justify-center mt-10">
                <Link
                  href="/terms"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Terms & Conditions
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
        </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
