/**
 * Form Components Usage Examples
 * 
 * This file demonstrates how to use the form components library
 * with various patterns and best practices.
 */

"use client";

import { useState, FormEvent } from "react";
import {
  Input,
  Select,
  TextArea,
  DatePicker,
  FileUpload,
  Checkbox,
  RadioGroup,
  Switch,
  Button,
  validationRules,
  validateForm,
  hasErrors,
  type SelectOption,
  type RadioOption,
  type ValidationErrors,
} from "@/components/admin/forms";

// ============================================
// Example 1: Basic Contact Form
// ============================================

export function BasicContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateForm(formData, {
      name: [validationRules.required(), validationRules.minLength(2)],
      email: [validationRules.required(), validationRules.email()],
      message: [validationRules.required(), validationRules.minLength(10)],
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Submit
    setLoading(true);
    console.log("Submitting:", formData);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted successfully!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
        placeholder="John Doe"
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
        placeholder="john@example.com"
      />

      <TextArea
        label="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
        required
        rows={4}
        placeholder="Your message..."
      />

      <Button type="submit" loading={loading} fullWidth>
        Send Message
      </Button>
    </form>
  );
}

// ============================================
// Example 2: Customer Registration Form
// ============================================

export function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    packageType: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const packageOptions: SelectOption[] = [
    { value: "STARTUP", label: "Startup ($2,999)" },
    { value: "PROFESSIONAL", label: "Professional ($4,999)" },
    { value: "ENTERPRISE", label: "Enterprise ($9,999)" },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, {
      name: [validationRules.required(), validationRules.minLength(2)],
      email: [validationRules.required(), validationRules.email()],
      phone: [validationRules.required(), validationRules.phone()],
      company: [validationRules.maxLength(100)],
      packageType: [validationRules.required("Please select a package")],
      agreeToTerms: [validationRules.custom((value: any) => value === true || "You must agree to terms")],
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    console.log("Customer registered:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />

        <Input
          label="Company (Optional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          error={errors.company}
        />
      </div>

      <Select
        label="Package Type"
        value={formData.packageType}
        onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
        options={packageOptions}
        placeholder="Select a package"
        error={errors.packageType}
        required
      />

      <Checkbox
        label="I agree to the terms and conditions"
        checked={formData.agreeToTerms}
        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
        error={errors.agreeToTerms}
      />

      <div className="flex gap-3">
        <Button type="submit" variant="primary">
          Register Customer
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ============================================
// Example 3: Appointment Scheduling Form
// ============================================

export function AppointmentForm() {
  const [formData, setFormData] = useState({
    title: "",
    appointmentType: "",
    scheduledAt: "",
    duration: "60",
    sendReminders: true,
    notes: "",
  });

  const appointmentTypes: RadioOption[] = [
    { value: "DEMO", label: "Product Demo", description: "Schedule a product demonstration" },
    { value: "SUPPORT", label: "Support Session", description: "Technical support appointment" },
    { value: "CONSULTATION", label: "Consultation", description: "Business consultation meeting" },
  ];

  return (
    <form className="max-w-2xl space-y-6">
      <Input
        label="Appointment Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        placeholder="e.g., Product Demo for ABC Corp"
      />

      <RadioGroup
        label="Appointment Type"
        name="appointmentType"
        options={appointmentTypes}
        value={formData.appointmentType}
        onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          label="Date & Time"
          mode="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
          required
        />

        <Select
          label="Duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          options={[
            { value: "30", label: "30 minutes" },
            { value: "60", label: "1 hour" },
            { value: "90", label: "1.5 hours" },
            { value: "120", label: "2 hours" },
          ]}
          required
        />
      </div>

      <Switch
        label="Send Reminders"
        description="Send email reminders 24 hours and 1 hour before appointment"
        checked={formData.sendReminders}
        onChange={(e) => setFormData({ ...formData, sendReminders: e.target.checked })}
      />

      <TextArea
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={4}
        placeholder="Additional notes or requirements..."
        showCharacterCount
        maxLength={500}
      />

      <div className="flex gap-3">
        <Button type="submit" variant="primary">
          Schedule Appointment
        </Button>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ============================================
// Example 4: File Upload Form
// ============================================

export function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form className="max-w-md space-y-4">
      <Select
        label="Document Type"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        options={[
          { value: "LICENSE", label: "License Agreement" },
          { value: "INVOICE", label: "Invoice" },
          { value: "SUPPORT", label: "Support Document" },
          { value: "OTHER", label: "Other" },
        ]}
        placeholder="Select document type"
        required
      />

      <FileUpload
        label="Upload Document"
        acceptedFormats={[".pdf", ".doc", ".docx", ".txt"]}
        maxSize={10}
        preview={true}
        onFileSelect={setFile}
        helperText="PDF, DOC, DOCX, or TXT (Max 10MB)"
        required
      />

      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Brief description of the document..."
      />

      <Button type="submit" fullWidth disabled={!file}>
        Upload Document
      </Button>
    </form>
  );
}

// ============================================
// Example 5: Advanced Search Form
// ============================================

export function AdvancedSearchForm() {
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    includeArchived: false,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Advanced Search</h3>
      
      <div className="space-y-4">
        <Input
          label="Search"
          value={filters.searchQuery}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by name, email, or order number..."
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: "", label: "All Statuses" },
              { value: "PENDING", label: "Pending" },
              { value: "COMPLETED", label: "Completed" },
              { value: "CANCELLED", label: "Cancelled" },
            ]}
          />

          <Checkbox
            label="Include archived items"
            checked={filters.includeArchived}
            onChange={(e) => setFilters({ ...filters, includeArchived: e.target.checked })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="From Date"
            mode="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />

          <DatePicker
            label="To Date"
            mode="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Min Amount"
            type="number"
            value={filters.minAmount}
            onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
            placeholder="0"
            leftIcon={<span className="text-gray-500">$</span>}
          />

          <Input
            label="Max Amount"
            type="number"
            value={filters.maxAmount}
            onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
            placeholder="10000"
            leftIcon={<span className="text-gray-500">$</span>}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setFilters({
                searchQuery: "",
                status: "",
                dateFrom: "",
                dateTo: "",
                minAmount: "",
                maxAmount: "",
                includeArchived: false,
              })
            }
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
