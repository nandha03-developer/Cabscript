/**
 * Custom React hooks for DataTable component
 * 
 * These hooks provide common functionality for managing table state,
 * fetching data, and handling user interactions.
 */

import { useState, useEffect, useReducer, useCallback, useRef } from "react";
import {
  TableState,
  TableAction,
  tableReducer,
  PaginatedResponse,
  FilterConfig,
  SortDirection,
} from "@/lib/data-table-types";

// ============================================
// useTableState Hook
// ============================================

interface UseTableStateOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSortKey?: string;
  initialSortDirection?: SortDirection;
  initialFilters?: FilterConfig;
}

export function useTableState(options: UseTableStateOptions = {}) {
  const initialState: TableState = {
    page: options.initialPage || 1,
    pageSize: options.initialPageSize || 25,
    sortKey: options.initialSortKey || "",
    sortDirection: options.initialSortDirection || "asc",
    filters: options.initialFilters || {},
    selectedIds: [],
  };

  const [state, dispatch] = useReducer(tableReducer, initialState);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    dispatch({ type: "SET_PAGE_SIZE", payload: pageSize });
  }, []);

  const setSort = useCallback((key: string, direction: SortDirection) => {
    dispatch({ type: "SET_SORT", payload: { key, direction } });
  }, []);

  const setFilters = useCallback((filters: FilterConfig) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setSelected = useCallback((ids: string[]) => {
    dispatch({ type: "SET_SELECTED", payload: ids });
  }, []);

  const toggleSelected = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_SELECTED", payload: id });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    dispatch({ type: "SELECT_ALL", payload: ids });
  }, []);

  const clearSelected = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTED" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    setPage,
    setPageSize,
    setSort,
    setFilters,
    setSelected,
    toggleSelected,
    selectAll,
    clearSelected,
    reset,
  };
}

// ============================================
// useTableData Hook (Server-side)
// ============================================

interface UseTableDataOptions<T> {
  endpoint: string;
  tableState: TableState;
  autoFetch?: boolean;
  transform?: (data: any) => T[];
  onSuccess?: (data: PaginatedResponse<T>) => void;
  onError?: (error: Error) => void;
}

export function useTableData<T>({
  endpoint,
  tableState,
  autoFetch = true,
  transform,
  onSuccess,
  onError,
}: UseTableDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: tableState.page.toString(),
        pageSize: tableState.pageSize.toString(),
      });

      if (tableState.sortKey) {
        params.append("sortKey", tableState.sortKey);
        params.append("sortDirection", tableState.sortDirection);
      }

      Object.entries(tableState.filters).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const items = transform ? transform(result.data || result) : result.data || result;
      const total = result.total || items.length;
      const pages = result.totalPages || Math.ceil(total / tableState.pageSize);

      setData(items);
      setTotalItems(total);
      setTotalPages(pages);

      if (onSuccess) {
        onSuccess({
          data: items,
          total,
          page: tableState.page,
          pageSize: tableState.pageSize,
          totalPages: pages,
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, tableState, transform, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    refetch,
  };
}

// ============================================
// useDebounce Hook
// ============================================

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// useTableSearch Hook
// ============================================

interface UseTableSearchOptions {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function useTableSearch({
  onSearch,
  debounceMs = 300,
}: UseTableSearchOptions) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return {
    searchQuery,
    setSearchQuery,
  };
}

// ============================================
// useTableExport Hook
// ============================================

interface UseTableExportOptions<T> {
  data: T[];
  columns: { key: string; label: string }[];
  filename?: string;
}

export function useTableExport<T extends Record<string, any>>({
  data,
  columns,
  filename = "export",
}: UseTableExportOptions<T>) {
  const exportToCSV = useCallback(() => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          // Escape values containing commas or quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? "";
        })
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data, columns, filename]);

  const exportToJSON = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data, filename]);

  return {
    exportToCSV,
    exportToJSON,
  };
}

// ============================================
// useTableSelection Hook
// ============================================

interface UseTableSelectionOptions<T> {
  data: T[];
  keyField?: string;
  mode?: "single" | "multiple";
  onChange?: (selectedIds: string[]) => void;
}

export function useTableSelection<T extends Record<string, any>>({
  data,
  keyField = "id",
  mode = "multiple",
  onChange,
}: UseTableSelectionOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const isAllSelected = useCallback(
    () => data.length > 0 && selectedIds.length === data.length,
    [data, selectedIds]
  );

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (mode === "single") {
          const newSelection = prev.includes(id) ? [] : [id];
          onChange?.(newSelection);
          return newSelection;
        } else {
          const newSelection = prev.includes(id)
            ? prev.filter((selectedId) => selectedId !== id)
            : [...prev, id];
          onChange?.(newSelection);
          return newSelection;
        }
      });
    },
    [mode, onChange]
  );

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const newSelection =
        prev.length === data.length ? [] : data.map((row) => row[keyField]);
      onChange?.(newSelection);
      return newSelection;
    });
  }, [data, keyField, onChange]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    onChange?.([]);
  }, [onChange]);

  const getSelectedRows = useCallback(() => {
    return data.filter((row) => selectedIds.includes(row[keyField]));
  }, [data, selectedIds, keyField]);

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    toggleSelection,
    toggleAll,
    clearSelection,
    getSelectedRows,
  };
}

// ============================================
// useTablePersistence Hook (Save state to localStorage)
// ============================================

interface UseTablePersistenceOptions {
  key: string;
  tableState: TableState;
}

export function useTablePersistence({
  key,
  tableState,
}: UseTablePersistenceOptions) {
  const isMounted = useRef(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(`table_state_${key}`);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Note: This would require the parent component to handle state restoration
        console.log("Loaded table state:", parsedState);
      }
    } catch (error) {
      console.error("Failed to load table state:", error);
    }

    isMounted.current = true;
  }, [key]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (!isMounted.current || typeof window === "undefined") return;

    try {
      localStorage.setItem(`table_state_${key}`, JSON.stringify(tableState));
    } catch (error) {
      console.error("Failed to save table state:", error);
    }
  }, [key, tableState]);

  const clearPersistedState = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`table_state_${key}`);
  }, [key]);

  return {
    clearPersistedState,
  };
}
