import React from "react";
import Link from "next/link";

// Status Badge Component
export interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {status}
    </span>
  );
};

// Date Formatter
export const formatDate = (date: Date | string | null): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// DateTime Formatter
export const formatDateTime = (date: Date | string | null): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Currency Formatter
export const formatCurrency = (amount: number | null, currency = "USD"): string => {
  if (amount === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Truncate Text
export const truncateText = (text: string | null, length = 50): string => {
  if (!text) return "-";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

// Link Cell
export interface LinkCellProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LinkCell: React.FC<LinkCellProps> = ({
  href,
  children,
  className = "",
}) => {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`text-blue-600 hover:text-blue-800 hover:underline ${className}`}
    >
      {children}
    </Link>
  );
};

// Action Button
export interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  children,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Actions Dropdown
export interface ActionDropdownProps {
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "danger";
  }[];
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Actions
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left ${
                    action.variant === "danger"
                      ? "text-red-700 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Boolean Badge
export interface BooleanBadgeProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanBadge: React.FC<BooleanBadgeProps> = ({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
}) => {
  return (
    <StatusBadge
      status={value ? trueLabel : falseLabel}
      variant={value ? "success" : "default"}
    />
  );
};

// Avatar
export interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  );
};

// Progress Bar
export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  variant = "default",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    default: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${variantClasses[variant]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 min-w-12 text-right">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};

// Multi-Badge
export interface MultiBadgeProps {
  items: string[];
  maxVisible?: number;
}

export const MultiBadge: React.FC<MultiBadgeProps> = ({
  items,
  maxVisible = 2,
}) => {
  const visible = items.slice(0, maxVisible);
  const remaining = items.length - maxVisible;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((item, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
        >
          {item}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
          +{remaining}
        </span>
      )}
    </div>
  );
};

// Empty State
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
