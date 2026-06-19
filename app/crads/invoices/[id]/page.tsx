'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentDate: string | null;
  dueDate: string | null;
  pdfUrl: string | null;
  pdfGenerated: boolean;
  sentToCustomer: boolean;
  sentAt: string | null;
  notes: string | null;
  termsConditions: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    plan: string;
    status: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const toast = useRef<Toast>(null);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [autoPrint, setAutoPrint] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
    paymentMethod: '',
    paymentDate: '',
    dueDate: '',
  });

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crads/invoices/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const data = await response.json();
      setInvoice(data.invoice);
      setEditForm({
        status: data.invoice.status,
        notes: data.invoice.notes || '',
        paymentMethod: data.invoice.paymentMethod || '',
        paymentDate: data.invoice.paymentDate ? data.invoice.paymentDate.split('T')[0] : '',
        dueDate: data.invoice.dueDate ? data.invoice.dueDate.split('T')[0] : '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    
    // Check if print parameter is in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('print') === 'true') {
        setAutoPrint(true);
      }
    }
  }, [invoiceId]);

  // Auto-trigger print when invoice is loaded and autoPrint is true
  useEffect(() => {
    if (autoPrint && invoice && !loading) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [autoPrint, invoice, loading]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/crads/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editForm.status,
          notes: editForm.notes || null,
          paymentMethod: editForm.paymentMethod || null,
          paymentDate: editForm.paymentDate || null,
          dueDate: editForm.dueDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      await fetchInvoice();
      alert('Invoice updated successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsSent = async () => {
    try {
      const response = await fetch(`/api/crads/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentToCustomer: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark invoice as sent');
      }

      await fetchInvoice();
      alert('Invoice marked as sent!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/crads/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      router.push('/crads/invoices');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    try {
      // Show loading toast
      toast.current?.show({
        severity: 'info',
        summary: 'Generating PDF',
        detail: 'Please wait...',
        life: 2000,
      });

      // Create a clean version of the invoice for PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups to download PDF');
      }

      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice_${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              color: #333;
            }
            .invoice-header { 
              border-bottom: 3px solid #000; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .company-name { 
              font-size: 32px; 
              font-weight: bold; 
              margin-bottom: 5px; 
            }
            .company-info { 
              color: #666; 
              font-size: 14px; 
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px; 
            }
            .bill-to, .invoice-info { 
              width: 48%; 
            }
            .section-title { 
              font-weight: bold; 
              margin-bottom: 10px; 
              font-size: 14px;
              color: #000;
            }
            .info-line { 
              margin: 5px 0; 
              font-size: 14px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0; 
            }
            th { 
              background: #f5f5f5; 
              padding: 12px; 
              text-align: left; 
              font-weight: bold; 
              border-bottom: 2px solid #ddd;
              font-size: 13px;
            }
            td { 
              padding: 12px; 
              border-bottom: 1px solid #eee;
              font-size: 14px;
            }
            .text-right { text-align: right; }
            .totals { 
              margin-left: auto; 
              width: 300px; 
              margin-top: 20px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              font-size: 14px;
            }
            .total-row.final { 
              border-top: 2px solid #000; 
              margin-top: 10px; 
              padding-top: 10px;
              font-weight: bold; 
              font-size: 18px;
            }
            .payment-info {
              background: #e8f5e9;
              border: 2px solid #4caf50;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .notes {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .notes-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .notes-content {
              font-size: 13px;
              color: #666;
              line-height: 1.5;
            }
            @media print {
              body { padding: 20px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-name">CabScript.com</div>
            <div class="company-info">Taxi Booking Script Solutions<br>www.cabscript.com</div>
          </div>

          <div class="invoice-details">
            <div class="bill-to">
              <div class="section-title">Bill To:</div>
              <div class="info-line"><strong>${invoice.customerName}</strong></div>
              <div class="info-line">${invoice.customerEmail}</div>
              ${invoice.customerPhone ? `<div class="info-line">${invoice.customerPhone}</div>` : ''}
              ${invoice.customerAddress ? `<div class="info-line" style="white-space: pre-line;">${invoice.customerAddress}</div>` : ''}
            </div>
            <div class="invoice-info">
              <div class="info-line"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</div>
              <div class="info-line"><strong>Invoice Date:</strong> ${formatDate(invoice.createdAt)}</div>
              ${invoice.dueDate ? `<div class="info-line"><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</div>` : ''}
              <div class="info-line"><strong>Order Number:</strong> ${invoice.order.orderNumber}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items && invoice.items.length > 0 ? invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td class="text-right">${formatCurrency(item.total || item.unitPrice * item.quantity, invoice.currency)}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="text-align: center;">No items</td></tr>'}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            ${invoice.discount > 0 ? `
            <div class="total-row">
              <span>Discount:</span>
              <span style="color: #f44336;">-${formatCurrency(invoice.discount, invoice.currency)}</span>
            </div>` : ''}
            ${invoice.taxAmount > 0 ? `
            <div class="total-row">
              <span>Tax (${invoice.taxRate}%):</span>
              <span>${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
            </div>` : ''}
            <div class="total-row final">
              <span>Total:</span>
              <span>${formatCurrency(invoice.totalAmount, invoice.currency)}</span>
            </div>
          </div>

          ${invoice.paymentDate ? `
          <div class="payment-info">
            <strong>✓ Payment Received</strong><br>
            Paid on ${formatDate(invoice.paymentDate)}${invoice.paymentMethod ? ` via ${invoice.paymentMethod}` : ''}
          </div>` : ''}

          ${invoice.notes || invoice.termsConditions ? `
          <div class="notes">
            ${invoice.notes ? `
            <div style="margin-bottom: 20px;">
              <div class="notes-title">Notes:</div>
              <div class="notes-content">${invoice.notes}</div>
            </div>` : ''}
            ${invoice.termsConditions ? `
            <div>
              <div class="notes-title">Terms & Conditions:</div>
              <div class="notes-content">${invoice.termsConditions}</div>
            </div>` : ''}
          </div>` : ''}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        toast.current?.show({
          severity: 'success',
          summary: 'PDF Ready',
          detail: 'Use browser print dialog to save as PDF',
          life: 3000,
        });
      }, 500);

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'Failed to generate PDF',
        life: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SENT: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      REFUNDED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error || 'Invoice not found'}</p>
          <button
            onClick={() => router.push('/crads/invoices')}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Hide everything except invoice */
          body > * {
            display: none !important;
          }
          
          /* Show only the invoice print area */
          .invoice-print-area,
          .invoice-print-area * {
            display: block !important;
            visibility: visible !important;
          }
          
          .invoice-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* Hide all print:hidden elements */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Hide sidebar and update form */
          .lg\\:col-span-1 {
            display: none !important;
          }
          
          /* Make invoice full width */
          .lg\\:col-span-2 {
            grid-column: span 3 !important;
          }
          
          /* Ensure tables display properly */
          table {
            display: table !important;
          }
          
          thead {
            display: table-header-group !important;
          }
          
          tbody {
            display: table-row-group !important;
          }
          
          tr {
            display: table-row !important;
          }
          
          th, td {
            display: table-cell !important;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
      <div className="p-8">
        <Toast ref={toast} />
        {/* Header - Hide on print */}
        <div className="mb-6 print:hidden">
        <Link
          href="/crads/invoices"
          className="text-yellow-600 hover:text-yellow-700 font-medium mb-4 inline-block"
        >
          ← Back to Invoices
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
              {invoice.sentToCustomer && (
                <span className="text-sm text-green-600">
                  ✓ Sent {invoice.sentAt && `on ${formatDate(invoice.sentAt)}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!invoice.sentToCustomer && (
              <button
                onClick={handleMarkAsSent}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Mark as Sent
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="pi pi-file-pdf"></i>
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="pi pi-print"></i>
              Print
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Preview */}
        <div className="lg:col-span-2">
          <div className="invoice-print-area bg-white rounded-lg shadow-sm p-8 print:shadow-none">
            {/* Company Header */}
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">CabScript.com</h2>
              <p className="text-gray-600">Taxi Booking Script Solutions</p>
              <p className="text-sm text-gray-500 mt-2">www.cabscript.com</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{invoice.customerName}</p>
                  <p>{invoice.customerEmail}</p>
                  {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
                  {invoice.customerAddress && (
                    <p className="mt-2 whitespace-pre-line">{invoice.customerAddress}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Invoice Number</div>
                  <div className="font-semibold text-gray-900">{invoice.invoiceNumber}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Invoice Date</div>
                  <div className="font-medium text-gray-900">{formatDate(invoice.createdAt)}</div>
                </div>
                {invoice.dueDate && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Due Date</div>
                    <div className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Order Number</div>
                  <div className="font-medium text-blue-600">
                    <Link href={`/crads/orders/${invoice.order.id}`} className="print:text-gray-900">
                      {invoice.order.orderNumber}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-gray-900">{item.description}</td>
                        <td className="px-4 py-4 text-right text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-4 text-right text-gray-700">
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-900">
                          {formatCurrency(item.total || item.amount, invoice.currency)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between py-2 text-gray-700">
                    <span>Discount:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(invoice.discount, invoice.currency)}
                    </span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between py-2 text-gray-700">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-gray-200 text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoice.paymentDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">
                    Paid on {formatDate(invoice.paymentDate)}
                    {invoice.paymentMethod && ` via ${invoice.paymentMethod}`}
                  </span>
                </div>
              </div>
            )}

            {/* Notes & Terms */}
            {(invoice.notes || invoice.termsConditions) && (
              <div className="pt-6 border-t">
                {invoice.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
                {invoice.termsConditions && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.termsConditions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Update Form - Hide on print */}
        <div className="lg:col-span-1 print:hidden">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Update Invoice</h2>
            
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
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                  placeholder="e.g., Stripe, Razorpay"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={editForm.paymentDate}
                  onChange={(e) => setEditForm({ ...editForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
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
                  placeholder="Internal notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Invoice'}
              </button>
            </form>
          </div>

          {/* Related Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Related Information</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Customer</div>
                <Link
                  href={`/crads/customers/${invoice.customerId}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {invoice.order?.customer?.name || invoice.customerName} →
                </Link>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Order</div>
                <Link
                  href={`/crads/orders/${invoice.order.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {invoice.order.orderNumber} →
                </Link>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Plan</div>
                <div className="font-medium capitalize">{invoice.order.plan}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Created</div>
                <div className="font-medium">{formatDate(invoice.createdAt)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                <div className="font-medium">{formatDate(invoice.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
