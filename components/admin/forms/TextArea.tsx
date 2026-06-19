"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "default",
      fullWidth = true,
      showCharacterCount = false,
      maxLength,
      className = "",
      disabled,
      required,
      value,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "border border-gray-300 bg-white focus:border-blue-500",
      filled: "border-0 bg-gray-100 focus:bg-gray-200",
      outlined: "border-2 border-gray-300 bg-transparent focus:border-blue-500",
    };

    const baseClasses = `
      px-4
      py-3
      rounded-lg
      transition-all
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      resize-y
      ${variantClasses[variant]}
      ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `;

    const currentLength = value?.toString().length || 0;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={baseClasses}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
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

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error && (
              <p
                id={`${props.id}-error`}
                className="text-sm text-red-600 flex items-center gap-1"
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
              <p id={`${props.id}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {showCharacterCount && maxLength && (
            <span
              className={`text-xs ${
                currentLength > maxLength * 0.9
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
