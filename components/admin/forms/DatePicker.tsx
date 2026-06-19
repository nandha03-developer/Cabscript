"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  mode?: "date" | "datetime-local" | "time";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      mode = "date",
      size = "md",
      variant = "default",
      fullWidth = true,
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const variantClasses = {
      default: "border border-gray-300 bg-white focus:border-blue-500",
      filled: "border-0 bg-gray-100 focus:bg-gray-200",
      outlined: "border-2 border-gray-300 bg-transparent focus:border-blue-500",
    };

    const baseClasses = `
      rounded-lg
      transition-all
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `;

    const getIcon = () => {
      if (mode === "time") {
        return (
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      }
      return (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    };

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {getIcon()}
          </div>

          <input
            ref={ref}
            type={mode}
            className={`${baseClasses} pl-10`}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${props.id}-error`
                : helperText
                ? `${props.id}-helper`
                : undefined
            }
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
