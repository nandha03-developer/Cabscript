"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      size = "md",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const baseClasses = `
      rounded
      border-gray-300
      text-blue-600
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      transition-all
      duration-200
      ${sizeClasses[size]}
      ${error ? "border-red-500" : ""}
      ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `;

    return (
      <div>
        <label
          className={`flex items-start gap-3 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <input
            ref={ref}
            type="checkbox"
            className={baseClasses}
            disabled={disabled}
            {...props}
          />
          {label && (
            <div className="flex-1">
              <span className="text-sm text-gray-700">{label}</span>
              {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
              )}
            </div>
          )}
        </label>

        {error && (
          <p className="mt-1.5 ml-8 text-sm text-red-600 flex items-center gap-1">
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
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
