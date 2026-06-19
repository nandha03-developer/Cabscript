/**
 * Form Components Library - Index
 * 
 * This file exports all form components and utilities for easy importing.
 */

// Form Components
export { default as Input } from "./Input";
export type { InputProps } from "./Input";

export { default as Select } from "./Select";
export type { SelectProps, SelectOption } from "./Select";

export { default as TextArea } from "./TextArea";
export type { TextAreaProps } from "./TextArea";

export { default as DatePicker } from "./DatePicker";
export type { DatePickerProps } from "./DatePicker";

export { default as FileUpload } from "./FileUpload";
export type { FileUploadProps } from "./FileUpload";

export { default as Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { default as RadioGroup } from "./RadioGroup";
export type { RadioGroupProps, RadioOption } from "./RadioGroup";

export { default as Switch } from "./Switch";
export type { SwitchProps } from "./Switch";

export { default as Button } from "./Button";
export type { ButtonProps } from "./Button";

// Re-export validation utilities
export {
  validationRules,
  validateField,
  validateForm,
  hasErrors,
  getFieldError,
  clearFieldError,
  asyncValidationRules,
  validateFieldAsync,
  sanitize,
  format,
  loginSchema,
  customerSchema,
  orderSchema,
  ticketSchema,
  appointmentSchema,
  type ValidationRule,
  type FieldValidation,
  type ValidationErrors,
  type AsyncValidationRule,
} from "@/lib/form-validation";
