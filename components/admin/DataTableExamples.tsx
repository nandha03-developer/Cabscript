/**
 * DataTable Component Usage Examples
 * 
 * This file demonstrates how to use the reusable DataTable component
 * across different admin modules.
 */

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import {
  StatusBadge,
  formatDate,
  formatDateTime,
  formatCurrency,
  LinkCell,
  ActionButton,
  ActionDropdown,
  BooleanBadge,
  Avatar,
} from "@/components/admin/TableCells";

// ============================================
// Example 1: Simple Customer List
// ============================================

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const customerColumns: Column<Customer>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <LinkCell href={`/crads/customers/${row.id}`}>{value}</LinkCell>
    ),
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    filterable: true,
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Joined",
    sortable: true,
    render: (value) => formatDate(value),
  },
];

function CustomerList({ customers }: { customers: Customer[] }) {
  return (
    <DataTable
      data={customers}
      columns={customerColumns}
      keyField="id"
      pagination={{
        currentPage: 1,
        totalPages: 10,
        pageSize: 25,
        totalItems: 250,
        onPageChange: (page) => console.log("Page:", page),
      }}
      onRowClick={(row) => console.log("Clicked:", row)}
      exportable={true}
      exportFilename="customers"
    />
  );
}

// ============================================
// Example 2: Orders with Status and Actions
// ============================================

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const orderColumns: Column<Order>[] = [
  {
    key: "orderNumber",
    label: "Order #",
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <LinkCell href={`/crads/orders/${row.id}`}>
        <span className="font-mono">{value}</span>
      </LinkCell>
    ),
  },
  {
    key: "customerName",
    label: "Customer",
    sortable: true,
    filterable: true,
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value) => {
      const variantMap: Record<string, "success" | "warning" | "danger" | "info"> = {
        COMPLETED: "success",
        PENDING: "warning",
        CANCELLED: "danger",
        PROCESSING: "info",
      };
      return <StatusBadge status={value} variant={variantMap[value]} />;
    },
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    render: (value) => formatDate(value),
  },
];

function OrderList({ orders }: { orders: Order[] }) {
  const handleDelete = (id: string) => {
    console.log("Delete:", id);
  };

  const handleView = (id: string) => {
    console.log("View:", id);
  };

  return (
    <DataTable
      data={orders}
      columns={orderColumns}
      keyField="id"
      actions={(row) => (
        <ActionDropdown
          actions={[
            {
              label: "View Details",
              onClick: () => handleView(row.id),
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
            },
            {
              label: "Download Invoice",
              onClick: () => console.log("Download:", row.id),
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
            {
              label: "Delete",
              onClick: () => handleDelete(row.id),
              variant: "danger",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ),
            },
          ]}
        />
      )}
      selectable={true}
      bulkActions={[
        {
          label: "Export Selected",
          onClick: (ids) => console.log("Export:", ids),
        },
        {
          label: "Delete Selected",
          onClick: (ids) => console.log("Delete:", ids),
        },
      ]}
      exportable={true}
      exportFilename="orders"
    />
  );
}

// ============================================
// Example 3: Support Tickets with Complex Rendering
// ============================================

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  customer: {
    name: string;
    avatar?: string;
  };
  priority: string;
  status: string;
  assignedTo?: string;
  unread: boolean;
  createdAt: Date;
}

const ticketColumns: Column<SupportTicket>[] = [
  {
    key: "ticketNumber",
    label: "Ticket #",
    sortable: true,
    width: "120px",
    render: (value, row) => (
      <LinkCell href={`/crads/tickets/${row.id}`}>
        <div className="flex items-center gap-2">
          <span className="font-mono">{value}</span>
          {row.unread && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </div>
      </LinkCell>
    ),
  },
  {
    key: "subject",
    label: "Subject",
    sortable: true,
    filterable: true,
  },
  {
    key: "customer",
    label: "Customer",
    sortable: false,
    render: (value) => (
      <div className="flex items-center gap-2">
        <Avatar name={value.name} imageUrl={value.avatar} size="sm" />
        <span>{value.name}</span>
      </div>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    filterable: true,
    render: (value) => {
      const variantMap: Record<string, "danger" | "warning" | "info"> = {
        HIGH: "danger",
        MEDIUM: "warning",
        LOW: "info",
      };
      return <StatusBadge status={value} variant={variantMap[value]} />;
    },
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value) => {
      const variantMap: Record<string, "success" | "warning" | "info"> = {
        RESOLVED: "success",
        IN_PROGRESS: "info",
        OPEN: "warning",
      };
      return <StatusBadge status={value} variant={variantMap[value]} />;
    },
  },
  {
    key: "assignedTo",
    label: "Assigned To",
    sortable: true,
    render: (value) => value || <span className="text-gray-400">Unassigned</span>,
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value) => formatDateTime(value),
  },
];

function TicketList({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <DataTable
      data={tickets}
      columns={ticketColumns}
      keyField="id"
      onRowClick={(row) => console.log("Open ticket:", row)}
      pagination={{
        currentPage: 1,
        totalPages: 5,
        pageSize: 25,
        totalItems: 125,
        onPageChange: (page) => console.log("Page:", page),
        onPageSizeChange: (size) => console.log("Page size:", size),
      }}
      selectable={true}
      bulkActions={[
        {
          label: "Assign to Me",
          onClick: (ids) => console.log("Assign:", ids),
        },
        {
          label: "Mark as Resolved",
          onClick: (ids) => console.log("Resolve:", ids),
        },
        {
          label: "Close Tickets",
          onClick: (ids) => console.log("Close:", ids),
        },
      ]}
      exportable={true}
      exportFilename="support-tickets"
    />
  );
}

// ============================================
// Example 4: Server-side Sorting and Filtering
// ============================================

function OrderListWithServerSide() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortKey,
        sortDirection,
        ...filters,
      });
      
      const response = await fetch(`/api/crads/orders?${params}`);
      const data = await response.json();
      
      setOrders(data.orders);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when parameters change
  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, sortKey, sortDirection, filters]);

  return (
    <DataTable
      data={orders}
      columns={orderColumns}
      keyField="id"
      loading={loading}
      pagination={{
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize,
        totalItems,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
      onSort={(key, direction) => {
        setSortKey(key);
        setSortDirection(direction);
      }}
      onFilter={setFilters}
      exportable={true}
      exportFilename="orders"
    />
  );
}

export {
  CustomerList,
  OrderList,
  TicketList,
  OrderListWithServerSide,
};
