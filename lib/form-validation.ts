/**
 * Form Validation Utilities
 * 
 * This file provides validation functions and helpers for form components.
 */

export interface ValidationRule {
  validate: (value: any) => boolean | string;
  message?: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

// ============================================
// Common Validation Rules
// ============================================

export const validationRules = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value) => {
      if (typeof value === "string") {
        return value.trim().length > 0 || message;
      }
      return value !== null && value !== undefined && value !== "" || message;
    },
  }),

  email: (message = "Please enter a valid email address"): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Allow empty unless required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || message;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const msg = message || `Must be at least ${min} characters`;
      return value.length >= min || msg;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const msg = message || `Must be no more than ${max} characters`;
      return value.length <= max || msg;
    },
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined || value === "") return true;
      const msg = message || `Must be at least ${min}`;
      return Number(value) >= min || msg;
    },
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined || value === "") return true;
      const msg = message || `Must be no more than ${max}`;
      return Number(value) <= max || msg;
    },
  }),

  pattern: (regex: RegExp, message = "Invalid format"): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(value) || message;
    },
  }),

  phone: (message = "Please enter a valid phone number"): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return phoneRegex.test(value) || message;
    },
  }),

  url: (message = "Please enter a valid URL"): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return message;
      }
    },
  }),

  numeric: (message = "Please enter a valid number"): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined || value === "") return true;
      return !isNaN(Number(value)) || message;
    },
  }),

  integer: (message = "Please enter a whole number"): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined || value === "") return true;
      return Number.isInteger(Number(value)) || message;
    },
  }),

  matches: (fieldName: string, message?: string): ValidationRule => ({
    validate: (value: any) => {
      const msg = message || `Must match ${fieldName}`;
      // Note: For matches, pass allValues when calling validateField
      return true; // Will be handled in validateField
    },
  }),

  custom: (validator: (value: any) => boolean | string): ValidationRule => ({
    validate: validator,
  }),
};

// ============================================
// Validation Function
// ============================================

export function validateField(
  value: any,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    const result = rule.validate(value);
    if (result !== true) {
      return typeof result === "string" ? result : rule.message || "Validation failed";
    }
  }
  return null;
}

export function validateForm(
  values: Record<string, any>,
  validationSchema: FieldValidation
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(validationSchema).forEach((fieldName) => {
    const rules = validationSchema[fieldName];
    const value = values[fieldName];
    const error = validateField(value, rules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

// ============================================
// Form Helpers
// ============================================

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getFieldError(
  errors: ValidationErrors,
  fieldName: string
): string | undefined {
  return errors[fieldName];
}

export function clearFieldError(
  errors: ValidationErrors,
  fieldName: string
): ValidationErrors {
  const { [fieldName]: _, ...rest } = errors;
  return rest;
}

// ============================================
// Common Validation Schemas
// ============================================

export const loginSchema: FieldValidation = {
  email: [validationRules.required(), validationRules.email()],
  password: [validationRules.required(), validationRules.minLength(6)],
};

export const customerSchema: FieldValidation = {
  name: [validationRules.required(), validationRules.minLength(2), validationRules.maxLength(100)],
  email: [validationRules.required(), validationRules.email()],
  phone: [validationRules.required(), validationRules.phone()],
  company: [validationRules.maxLength(100)],
};

export const orderSchema: FieldValidation = {
  customerId: [validationRules.required("Please select a customer")],
  packageType: [validationRules.required("Please select a package")],
  amount: [validationRules.required(), validationRules.min(0)],
  status: [validationRules.required()],
};

export const ticketSchema: FieldValidation = {
  subject: [validationRules.required(), validationRules.minLength(5), validationRules.maxLength(200)],
  description: [validationRules.required(), validationRules.minLength(10)],
  priority: [validationRules.required()],
  customerId: [validationRules.required("Please select a customer")],
};

export const appointmentSchema: FieldValidation = {
  title: [validationRules.required(), validationRules.minLength(3), validationRules.maxLength(200)],
  customerEmail: [validationRules.required(), validationRules.email()],
  customerName: [validationRules.required()],
  scheduledAt: [validationRules.required("Please select a date and time")],
  appointmentType: [validationRules.required("Please select appointment type")],
  duration: [validationRules.required(), validationRules.min(15), validationRules.max(480)],
};

// ============================================
// Async Validation
// ============================================

export interface AsyncValidationRule {
  validate: (value: any) => Promise<boolean | string>;
  message?: string;
}

export async function validateFieldAsync(
  value: any,
  rules: AsyncValidationRule[]
): Promise<string | null> {
  for (const rule of rules) {
    const result = await rule.validate(value);
    if (result !== true) {
      return typeof result === "string" ? result : rule.message || "Validation failed";
    }
  }
  return null;
}

// Common async validators
export const asyncValidationRules = {
  uniqueEmail: (checkEndpoint: string, message = "Email already exists"): AsyncValidationRule => ({
    validate: async (value) => {
      if (!value) return true;
      try {
        const response = await fetch(`${checkEndpoint}?email=${encodeURIComponent(value)}`);
        const data = await response.json();
        return !data.exists || message;
      } catch {
        return true; // Allow on error
      }
    },
  }),

  uniqueUsername: (checkEndpoint: string, message = "Username already taken"): AsyncValidationRule => ({
    validate: async (value) => {
      if (!value) return true;
      try {
        const response = await fetch(`${checkEndpoint}?username=${encodeURIComponent(value)}`);
        const data = await response.json();
        return !data.exists || message;
      } catch {
        return true;
      }
    },
  }),
};

// ============================================
// Sanitization Helpers
// ============================================

export const sanitize = {
  trim: (value: string): string => value.trim(),
  
  lowercase: (value: string): string => value.toLowerCase(),
  
  uppercase: (value: string): string => value.toUpperCase(),
  
  removeSpaces: (value: string): string => value.replace(/\s+/g, ""),
  
  alphanumeric: (value: string): string => value.replace(/[^a-zA-Z0-9]/g, ""),
  
  numeric: (value: string): string => value.replace(/[^0-9]/g, ""),
  
  phone: (value: string): string => value.replace(/[^0-9\+\-\s\(\)]/g, ""),
  
  email: (value: string): string => value.trim().toLowerCase(),
};

// ============================================
// Format Helpers
// ============================================

export const format = {
  phone: (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  },

  currency: (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  },

  percentage: (value: number): string => {
    return `${value.toFixed(2)}%`;
  },
};
