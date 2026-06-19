"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      checked,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeConfig = {
      sm: {
        switch: "w-9 h-5",
        dot: "w-4 h-4",
        translate: "translate-x-4",
      },
      md: {
        switch: "w-11 h-6",
        dot: "w-5 h-5",
        translate: "translate-x-5",
      },
      lg: {
        switch: "w-14 h-7",
        dot: "w-6 h-6",
        translate: "translate-x-7",
      },
    };

    const config = sizeConfig[size];

    return (
      <div className={className}>
        <label
          className={`flex items-start gap-3 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only"
              checked={checked}
              disabled={disabled}
              {...props}
            />
            <div
              className={`
                ${config.switch}
                rounded-full
                transition-colors
                duration-200
                ${
                  checked
                    ? error
                      ? "bg-red-500"
                      : "bg-blue-600"
                    : "bg-gray-200"
                }
                ${disabled ? "opacity-50" : ""}
              `}
            >
              <div
                className={`
                  ${config.dot}
                  bg-white
                  rounded-full
                  shadow-md
                  transform
                  transition-transform
                  duration-200
                  ${checked ? config.translate : "translate-x-0.5"}
                  absolute
                  top-1/2
                  -translate-y-1/2
                `}
              />
            </div>
          </div>

          {(label || description) && (
            <div className="flex-1">
              {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
              {description && (
                <p className="mt-0.5 text-xs text-gray-500">{description}</p>
              )}
            </div>
          )}
        </label>

        {error && (
          <p className="mt-1.5 ml-14 text-sm text-red-600 flex items-center gap-1">
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

Switch.displayName = "Switch";

export default Switch;
