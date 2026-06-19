/**
 * Common TypeScript types for DataTable component
 * 
 * This file contains type definitions and utility types
 * for working with the DataTable component.
 */

// Column Definition Type
export interface ColumnDef<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

// Pagination Configuration
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// Sort Configuration
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// Filter Configuration
export type FilterValue = string | number | boolean | null;

export interface FilterConfig {
  [key: string]: FilterValue;
}

// Bulk Action Definition
export interface BulkAction {
  label: string;
  onClick: (selectedIds: string[]) => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

// Action Definition
export interface ActionDef {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
}

// Status Variant Type
export type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

// Status Badge Configuration
export interface StatusConfig {
  [key: string]: {
    label: string;
    variant: StatusVariant;
  };
}

// Common Status Configurations
export const ORDER_STATUS_CONFIG: StatusConfig = {
  PENDING: { label: "Pending", variant: "warning" },
  PROCESSING: { label: "Processing", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
  REFUNDED: { label: "Refunded", variant: "danger" },
};

export const INVOICE_STATUS_CONFIG: StatusConfig = {
  DRAFT: { label: "Draft", variant: "default" },
  PENDING: { label: "Pending", variant: "warning" },
  PAID: { label: "Paid", variant: "success" },
  OVERDUE: { label: "Overdue", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
};

export const TICKET_STATUS_CONFIG: StatusConfig = {
  OPEN: { label: "Open", variant: "warning" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  WAITING_CUSTOMER: { label: "Waiting on Customer", variant: "warning" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

export const TICKET_PRIORITY_CONFIG: StatusConfig = {
  LOW: { label: "Low", variant: "info" },
  MEDIUM: { label: "Medium", variant: "warning" },
  HIGH: { label: "High", variant: "danger" },
};

export const APPOINTMENT_STATUS_CONFIG: StatusConfig = {
  SCHEDULED: { label: "Scheduled", variant: "info" },
  CONFIRMED: { label: "Confirmed", variant: "success" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
  NO_SHOW: { label: "No Show", variant: "danger" },
  RESCHEDULED: { label: "Rescheduled", variant: "warning" },
};

export const REMINDER_STATUS_CONFIG: StatusConfig = {
  PENDING: { label: "Pending", variant: "warning" },
  SENT: { label: "Sent", variant: "success" },
  FAILED: { label: "Failed", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "default" },
};

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Table State Management
export interface TableState {
  page: number;
  pageSize: number;
  sortKey: string;
  sortDirection: SortDirection;
  filters: FilterConfig;
  selectedIds: string[];
}

// Table Action Types
export type TableAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_SORT"; payload: { key: string; direction: SortDirection } }
  | { type: "SET_FILTERS"; payload: FilterConfig }
  | { type: "SET_SELECTED"; payload: string[] }
  | { type: "TOGGLE_SELECTED"; payload: string }
  | { type: "SELECT_ALL"; payload: string[] }
  | { type: "CLEAR_SELECTED" }
  | { type: "RESET" };

// Table State Reducer
export function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };
    case "SET_SORT":
      return {
        ...state,
        sortKey: action.payload.key,
        sortDirection: action.payload.direction,
        page: 1,
      };
    case "SET_FILTERS":
      return { ...state, filters: action.payload, page: 1 };
    case "SET_SELECTED":
      return { ...state, selectedIds: action.payload };
    case "TOGGLE_SELECTED":
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter((id) => id !== action.payload)
          : [...state.selectedIds, action.payload],
      };
    case "SELECT_ALL":
      return {
        ...state,
        selectedIds:
          state.selectedIds.length === action.payload.length
            ? []
            : action.payload,
      };
    case "CLEAR_SELECTED":
      return { ...state, selectedIds: [] };
    case "RESET":
      return {
        page: 1,
        pageSize: 25,
        sortKey: "",
        sortDirection: "asc",
        filters: {},
        selectedIds: [],
      };
    default:
      return state;
  }
}

// Export Utility Types
export interface ExportOptions {
  filename: string;
  format: "csv" | "excel" | "pdf";
  columns?: string[];
  includeHeaders?: boolean;
}

// Search Configuration
export interface SearchConfig {
  placeholder?: string;
  debounceMs?: number;
  onSearch: (query: string) => void;
}

// Loading State Type
export type LoadingState = "idle" | "loading" | "success" | "error";

// Table View Mode
export type ViewMode = "table" | "grid" | "list";

// Column Visibility Configuration
export interface ColumnVisibility {
  [key: string]: boolean;
}

// Responsive Breakpoints
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveConfig {
  hideColumnsOn?: {
    [K in Breakpoint]?: string[];
  };
}

// Virtual Scrolling Configuration
export interface VirtualScrollConfig {
  enabled: boolean;
  rowHeight: number;
  overscan?: number;
}

// Cell Editing Configuration
export interface CellEditConfig<T> {
  editable: boolean;
  onEdit: (row: T, key: string, value: any) => Promise<void>;
  validator?: (value: any) => boolean | string;
}

// Row Selection Configuration
export interface RowSelectionConfig {
  mode: "single" | "multiple";
  onSelectionChange: (selectedIds: string[]) => void;
  disabled?: (row: any) => boolean;
}

// Empty State Configuration
export interface EmptyStateConfig {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Error State Configuration
export interface ErrorStateConfig {
  title: string;
  description?: string;
  retry?: {
    label: string;
    onClick: () => void;
  };
}

// Utility Functions
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function getStatusConfig(status: string, configMap: StatusConfig) {
  return configMap[status] || { label: status, variant: "default" as StatusVariant };
}

export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

export function getPageRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
