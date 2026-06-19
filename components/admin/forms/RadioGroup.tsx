"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      orientation = "vertical",
      size = "md",
      name,
      disabled,
      required,
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
      border-gray-300
      text-blue-600
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      transition-all
      duration-200
      ${sizeClasses[size]}
      ${error ? "border-red-500" : ""}
    `;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={`
            ${orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-3"}
          `}
        >
          {options.map((option, index) => (
            <label
              key={option.value}
              className={`
                flex items-start gap-3
                ${disabled || option.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              `}
            >
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                name={name}
                value={option.value}
                disabled={disabled || option.disabled}
                className={baseClasses}
                {...props}
              />
              <div className="flex-1">
                <span className="text-sm text-gray-700">{option.label}</span>
                {option.description && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
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
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
