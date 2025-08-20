'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';

// ----------------------------------------------------------------------
// CONSTANTS - Moved outside component to prevent recreation on every render
// These define the filter options and table structure
// ----------------------------------------------------------------------

/**
 * Available order status options for filtering
 * Backend should match these exact values in the order_status field
 */
const ORDER_STATUS_OPTIONS = [
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
];

/**
 * Available payment status options for filtering
 * Backend should match these exact values in the payment_status field
 * Empty string value means "show all payments"
 */
const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Full Refund', label: 'Full Refund' },
  { value: 'Partial Refund', label: 'Partial Refund' },
];

/**
 * Table column definitions
 * Backend API should return data with these field names
 * id: field name in API response
 * label: displayed column header
 * width: column width in pixels
 */
const TABLE_HEAD = [
  { id: 'order_id', label: 'Order', width: 120 },
  { id: 'customer', label: 'Customer', width: 280 },
  { id: 'payment_status', label: 'Payment Status', width: 140 },
  { id: 'order_date', label: 'Start Date', width: 140 },
  { id: 'items_count', label: 'Items', width: 80, align: 'center' },
  { id: 'final_amount', label: 'Total Amount', width: 120 },
  { id: 'order_status', label: 'Order Status', width: 120 },
  { id: '', width: 88 }, // Actions column
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

/**
 * OrderListView Component
 * 
 * Main component for displaying orders in a paginated, filterable, sortable table
 * Handles:
 * - Fetching order data from API with filtering/sorting/pagination
 * - Displaying summary statistics (total, unfulfilled, pending payments)
 * - User interactions (filtering, sorting, pagination)
 * 
 * API Endpoints Used:
 * - GET /api/orders - for filtered/paginated order data
 * - GET /api/orders/stats - for global statistics (unfiltered)
 */
export function OrderListView() {
  // ----------------------------------------------------------------------
  // TABLE HOOK - Manages sorting, pagination, and selection state
  // ----------------------------------------------------------------------

  /**
   * useTable hook manages table state:
   * - page: current page number (0-based)
   * - rowsPerPage: items per page
   * - orderBy: field to sort by (matches TABLE_HEAD ids)
   * - order: sort direction ('asc' or 'desc')
   * - selected: array of selected row IDs
   */
  const table = useTable({
    defaultOrderBy: 'order_id', // Default sort field - Backend should handle this
    defaultOrder: 'desc' // Default sort direction - 'desc' shows newest orders first
  });

  // ----------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------

  /**
   * Core data state
   */
  const [tableData, setTableData] = useState([]); // Current page order data from API
  const [loading, setLoading] = useState(true);   // Loading state for UI feedback
  const [totalCount, setTotalCount] = useState(0); // Total number of orders (for pagination)

  /**
   * Statistics state
   * globalStats: Unfiltered statistics for display at top of page
   * These come from /api/orders/stats endpoint
   */
  const [globalStats, setGlobalStats] = useState({
    total: 0,           // Total orders in system
    unfulfilled: 0,     // Total unfulfilled orders
    pendingPayments: 0, // Total orders with pending payments
  });

  /**
   * Filter state using useSetState hook for easy updates
   * These values are sent to API as query parameters
   */
  const filters = useSetState({
    name: '',
    orderStatus: 'unfulfilled',
    paymentStatus: '',
    startDate: null,
    startDateString: null, // <-- Add this line
  });
  const { state: currentFilters } = filters;

  // ----------------------------------------------------------------------
  // API FUNCTIONS
  // ----------------------------------------------------------------------

  /**
   * Fetch global statistics (unfiltered)
   * Called once on component mount
   * Endpoint: GET /api/orders/stats
   * 
   * Expected API Response:
   * {
   *   success: true,
   *   stats: {
   *     total: number,
   *     unfulfilled: number,
   *     pendingPayments: number
   *   }
   * }
   */
  const fetchGlobalStats = useCallback(async () => {
    try {
      // Only log in development to reduce production noise
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching global stats from /api/orders/stats');
      }

      const response = await fetch('/api/orders/stats');

      if (!response.ok) {
        throw new Error(`Failed to fetch global stats: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Global Stats API Response:', result.stats);
        }
        setGlobalStats(result.stats);
      } else {
        throw new Error(result.error || 'Failed to fetch global stats');
      }
    } catch (error) {
      console.error('Error fetching global stats:', error);
      // Fallback to empty stats on error
      setGlobalStats({
        total: 0,
        unfulfilled: 0,
        pendingPayments: 0,
      });
    }
  }, []); // No dependencies - only fetch once

  /**
   * Fetch filtered and paginated orders
   * Called whenever filters, pagination, or sorting changes
   * Endpoint: GET /api/orders
   * 
   * Query Parameters Sent:
   * - page: current page (0-based)
   * - limit: items per page
   * - status: order status filter
   * - paymentStatus: payment status filter
   * - sortBy: field to sort by
   * - sortOrder: sort direction (asc/desc)
   * - search: search term (optional)
   * - startDate: date filter (optional)
   * 
   * Expected API Response:
   * {
   *   success: true,
   *   data: [array of order objects],
   *   pagination: {
   *     page: number,
   *     limit: number,
   *     total: number,
   *     totalPages: number
   *   },
   *   stats: { ... } // filtered stats (not used currently)
   * }
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters for API call
      const queryParams = new URLSearchParams({
        page: table.page.toString(),
        limit: table.rowsPerPage.toString(),
        status: currentFilters.orderStatus,
        paymentStatus: currentFilters.paymentStatus,
        sortBy: table.orderBy,
        sortOrder: table.order,
        ...(currentFilters.name && { search: currentFilters.name }),
        // OLD: ...(currentFilters.startDate && { startDate: currentFilters.startDate.toISOString() }),
        // NEW: Use startDateString if present
        ...(currentFilters.startDateString && { startDateString: currentFilters.startDateString }),
      });

      // Log request details in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Frontend sending params:', {
          page: table.page,
          limit: table.rowsPerPage,
          sortBy: table.orderBy,
          sortOrder: table.order,
          status: currentFilters.orderStatus
        });
      }

      const response = await fetch(`/api/orders?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const result = await response.json();

      if (result.success) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Orders API Response:', result);
        }
        setTableData(result.data);
        setTotalCount(result.pagination.total);
      } else {
        throw new Error(result.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, currentFilters]);

  // ----------------------------------------------------------------------
  // EFFECTS - Handle component lifecycle and state changes
  // ----------------------------------------------------------------------

  /**
   * Fetch global stats on component mount
   */
  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  /**
   * Fetch orders when any dependency changes
   * This ensures data stays in sync with user actions
   */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Reset to first page when filters change
   * Prevents showing empty pages when filter results are fewer than current page
   */
  useEffect(() => {
    table.onResetPage();
  }, [
    currentFilters.orderStatus,
    currentFilters.paymentStatus,
    currentFilters.name,
    currentFilters.startDateString // <-- Use startDateString, not startDate
  ]);
  // ----------------------------------------------------------------------
  // COMPUTED VALUES - Memoized for performance
  // ----------------------------------------------------------------------

  /**
   * Display statistics (memoized to prevent unnecessary recalculations)
   * Always shows global (unfiltered) stats regardless of current filters
   */
  const displayStats = useMemo(() => ({
    total: globalStats.total || 0,
    unfulfilled: globalStats.unfulfilled || 0,
    pendingPayments: globalStats.pendingPayments || 0,
  }), [globalStats]);

  /**
   * Determine if reset button should be shown (memoized)
   * Shows when any non-default filter is active
   */
  const canReset = useMemo(() =>
    !!currentFilters.name ||
    currentFilters.orderStatus !== 'unfulfilled' ||
    !!currentFilters.paymentStatus ||
    !!currentFilters.startDateString, // <-- Use startDateString
    [currentFilters]
  );
  /**
   * Determine if "no data" state should be shown (memoized)
   */
  const notFound = useMemo(() => !loading && !tableData.length, [loading, tableData.length]);

  // ----------------------------------------------------------------------
  // RENDER LOADING STATE
  // ----------------------------------------------------------------------

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------------------------------

  return (
    <>
      <DashboardContent>
        {/* Page Header with Breadcrumbs and Add Button */}
        <CustomBreadcrumbs
          heading="Orders"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Order', href: paths.dashboard.order.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.root} // TODO: Change to actual order creation route
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add New Order
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* Summary Statistics Row - Shows global (unfiltered) stats */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box>
                <Box sx={{ typography: 'h4' }}>{displayStats.total}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Total Orders</Box>
              </Box>
              <Box>
                <Box sx={{ typography: 'h4', color: 'warning.main' }}>{displayStats.unfulfilled}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Unfulfilled</Box>
              </Box>
              <Box>
                <Box sx={{ typography: 'h4', color: 'info.main' }}>{displayStats.pendingPayments}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Pending Payments</Box>
              </Box>
            </Box>
          </Box>

          {/* Filter and Search Toolbar */}
          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            paymentOptions={PAYMENT_STATUS_OPTIONS}
            orderStatusOptions={ORDER_STATUS_OPTIONS}
          />

          {/* Main Data Table */}
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Scrollbar sx={{
              minHeight: 444,
              maxHeight: 444,
              height: 444,
            }}>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{
                  width: '100%',
                  minWidth: 1200,
                  tableLayout: 'fixed',
                  '& .MuiTableCell-root': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
              >
                {/* Table Header with Sorting */}
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.order_id)
                    )
                  }
                />

                {/* Table Body with Order Rows */}
                <TableBody>
                  {tableData.map((row) => (
                    <OrderTableRow
                      key={row.order_id}
                      row={row}
                      selected={table.selected.includes(row.order_id)}
                      onSelectRow={() => table.onSelectRow(row.order_id)}
                      detailsHref={paths.dashboard.order.details(row.order_id)}
                    />
                  ))}

                  {/* Empty Rows for Consistent Table Height */}
                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  {/* No Data State */}
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          {/* Pagination Controls */}
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={totalCount}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          />
        </Card>
      </DashboardContent>
    </>
  );
}