import { NextResponse } from 'next/server';
import { _orders } from 'src/_mock';

// ----------------------------------------------------------------------
// CONSTANTS - Configuration and validation
// ----------------------------------------------------------------------

/**
 * Maximum allowed limit to prevent performance issues
 */
const MAX_LIMIT = 100;

/**
 * Default pagination settings
 */
const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;

/**
 * Valid sort fields to prevent SQL injection-like attacks
 */
const VALID_SORT_FIELDS = [
  'order_id',
  'customer',
  'customer_name',
  'payment_status',
  'order_date',
  'created_at',
  'final_amount',
  'order_status'
];

/**
 * Valid sort orders
 */
const VALID_SORT_ORDERS = ['asc', 'desc'];

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * Validate and sanitize pagination parameters
 * @param {string} pageParam - Page parameter from query string
 * @param {string} limitParam - Limit parameter from query string
 * @returns {Object} Validated pagination values
 */
const validatePagination = (pageParam, limitParam) => {
  const page = Math.max(0, parseInt(pageParam || DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limitParam || DEFAULT_LIMIT)));

  return { page, limit };
};

/**
 * Validate and sanitize sorting parameters
 * @param {string} sortBy - Sort field from query string
 * @param {string} sortOrder - Sort order from query string
 * @returns {Object} Validated sorting values
 */
const validateSorting = (sortBy, sortOrder) => {
  const validSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'order_id';
  const validSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

  return { sortBy: validSortBy, sortOrder: validSortOrder };
};

/**
 * Apply status filter to orders array
 * @param {Array} orders - Orders array to filter
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered orders array
 */
const applyStatusFilter = (orders, status) => {
  if (!status || status === 'all') return orders;

  return orders.filter(order => order.order_status === status);
};

/**
 * Apply payment status filter to orders array
 * @param {Array} orders - Orders array to filter
 * @param {string} paymentStatus - Payment status to filter by
 * @returns {Array} Filtered orders array
 */
const applyPaymentStatusFilter = (orders, paymentStatus) => {
  if (!paymentStatus || paymentStatus === 'all' || paymentStatus === '') {
    return orders;
  }

  return orders.filter(order => order.payment_status === paymentStatus);
};

/**
 * Apply date filter to orders array
 * @param {Array} orders - Orders array to filter
 * @param {string} startDate - ISO date string to filter by (exact date match)
 * @returns {Array} Filtered orders array
 */
const applyDateFilter = (orders, startDate) => {
  if (!startDate) return orders;

  try {
    // Normalize the filter date to YYYY-MM-DD format
    let filterDateStr = startDate;
    if (startDate.includes('T')) {
      filterDateStr = startDate.split('T')[0];
    } else if (startDate.length > 10) {
      filterDateStr = startDate.substring(0, 10);
    }

    // Always log this for debugging
    console.log('🔍 Date Filter Debug:');
    console.log('- Raw startDate:', startDate);
    console.log('- Normalized filterDateStr:', filterDateStr);
    console.log('- Total orders to filter:', orders.length);

    const filteredOrders = orders.filter(order => {
      // Normalize order date to YYYY-MM-DD format
      let orderDateStr = order.order_date;
      if (order.order_date.includes('T')) {
        orderDateStr = order.order_date.split('T')[0];
      } else if (order.order_date.length > 10) {
        orderDateStr = order.order_date.substring(0, 10);
      }

      const matches = orderDateStr === filterDateStr;

      // Log only the first few for debugging
      if (filteredOrders.length < 5) {
        console.log(`Order ${order.order_id}: "${orderDateStr}" === "${filterDateStr}" = ${matches}`);
      }

      return matches;
    });

    console.log(`✅ Date filter result: ${filteredOrders.length} orders matched`);
    if (filteredOrders.length > 0) {
      console.log('Sample matched orders:', filteredOrders.slice(0, 3).map(o => ({
        id: o.order_id,
        date: o.order_date,
        customer: o.customer_name
      })));
    }

    return filteredOrders;
  } catch (error) {
    console.error('❌ Date filter error:', error);
    return orders;
  }
};

/**
 * Apply search filter to orders array
 * Searches across multiple fields: order_id, orderNumber, customer_name, email, phone
 * @param {Array} orders - Orders array to filter
 * @param {string} search - Search term
 * @returns {Array} Filtered orders array
 */
const applySearchFilter = (orders, search) => {
  if (!search) return orders;

  const searchTerm = search.toLowerCase().trim();
  if (!searchTerm) return orders;

  return orders.filter(order => {
    const searchableFields = [
      order.order_id,
      order.orderNumber,
      order.orderNumber?.replace('#', ''),
      order.customer_name,
      order.email,
      order.phone
    ];

    return searchableFields.some(field =>
      field?.toString().toLowerCase().includes(searchTerm)
    );
  });
};

/**
 * Sort orders array by specified field and order
 * @param {Array} orders - Orders array to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Sorted orders array
 */
const applySorting = (orders, sortBy, sortOrder) => {
  return [...orders].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'order_id':
        aValue = parseInt(a.order_id.replace(/\D/g, '')) || 0;
        bValue = parseInt(b.order_id.replace(/\D/g, '')) || 0;
        break;
      case 'customer':
      case 'customer_name':
        aValue = a.customer_name?.toLowerCase() || '';
        bValue = b.customer_name?.toLowerCase() || '';
        break;
      case 'payment_status':
        aValue = a.payment_status?.toLowerCase() || '';
        bValue = b.payment_status?.toLowerCase() || '';
        break;
      case 'order_date':
      case 'created_at':
        aValue = new Date(a.order_date || a.created_at);
        bValue = new Date(b.order_date || b.created_at);
        break;
      case 'final_amount':
        aValue = parseFloat(a.final_amount) || 0;
        bValue = parseFloat(b.final_amount) || 0;
        break;
      case 'order_status':
        aValue = a.order_status?.toLowerCase() || '';
        bValue = b.order_status?.toLowerCase() || '';
        break;
      default:
        aValue = parseInt(a.order_id.replace(/\D/g, '')) || 0;
        bValue = parseInt(b.order_id.replace(/\D/g, '')) || 0;
    }

    // Handle different data types
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else {
      aValue = String(aValue);
      bValue = String(bValue);
      return sortOrder === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }
  });
};

/**
 * Calculate global statistics from full orders array
 * Always calculates from unfiltered data for dashboard display
 * @param {Array} orders - Full orders array
 * @returns {Object} Statistics object
 */
const calculateGlobalStats = (orders) => ({
  total: orders.length,
  unfulfilled: orders.filter(order => order.order_status === 'unfulfilled').length,
  fulfilled: orders.filter(order => order.order_status === 'fulfilled').length,
  cancelled: orders.filter(order => order.order_status === 'cancelled').length,
  pendingPayments: orders.filter(order => order.payment_status === 'Pending').length,
  paid: orders.filter(order => order.payment_status === 'paid').length,
  partialPayments: orders.filter(order => order.payment_status === 'Partial').length,
  fullRefunds: orders.filter(order => order.payment_status === 'Full Refund').length,
  partialRefunds: orders.filter(order => order.payment_status === 'Partial Refund').length,
});

// ----------------------------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------------------------

/**
 * GET /api/orders
 * 
 * Retrieve filtered, sorted, and paginated orders
 * 
 * Query Parameters:
 * @param {string} page - Page number (0-based, default: 0)
 * @param {string} limit - Items per page (max: 100, default: 10)
 * @param {string} status - Order status filter (unfulfilled|fulfilled|cancelled)
 * @param {string} paymentStatus - Payment status filter (paid|Pending|Partial|Full Refund|Partial Refund)
 * @param {string} search - Search term (searches order ID, customer name, email, phone)
 * @param {string} startDate - ISO date string for date filtering
 * @param {string} sortBy - Field to sort by (order_id|customer_name|payment_status|order_date|final_amount|order_status)
 * @param {string} sortOrder - Sort direction (asc|desc, default: desc)
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   data: Order[],           // Paginated order results
 *   pagination: {
 *     page: number,          // Current page (0-based)
 *     limit: number,         // Items per page
 *     total: number,         // Total filtered results
 *     totalPages: number     // Total pages available
 *   },
 *   stats: {                 // Global (unfiltered) statistics
 *     total: number,
 *     unfulfilled: number,
 *     fulfilled: number,
 *     cancelled: number,
 *     pendingPayments: number,
 *     paid: number,
 *     partialPayments: number,
 *     fullRefunds: number,
 *     partialRefunds: number
 *   }
 * }
 */
export async function GET(request) {
  try {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const { page, limit } = validatePagination(
      searchParams.get('page'),
      searchParams.get('limit')
    );
    const { sortBy, sortOrder } = validateSorting(
      searchParams.get('sortBy'),
      searchParams.get('sortOrder')
    );

    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const orderType = searchParams.get('orderType');
    const search = searchParams.get('search');
    // Change this line to read the string version
    const startDate = searchParams.get('startDateString') || searchParams.get('startDate');

    // Log request for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('API called with:', {
        page, limit, status, paymentStatus, orderType, search, startDate, sortBy, sortOrder
      });
    }

    // Start with full orders array
    let filteredOrders = [..._orders];

    // Apply filters in sequence
    filteredOrders = applyStatusFilter(filteredOrders, status);
    filteredOrders = applyPaymentStatusFilter(filteredOrders, paymentStatus);
    filteredOrders = applyDateFilter(filteredOrders, startDate);
    filteredOrders = applySearchFilter(filteredOrders, search);

    // Apply order type filter if provided
    if (orderType && orderType !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.order_type === orderType);
    }

    // Sort the filtered results
    filteredOrders = applySorting(filteredOrders, sortBy, sortOrder);

    // Apply pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Calculate global statistics (always from full unfiltered dataset)
    const stats = calculateGlobalStats(_orders);

    // Build response
    const response = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
      },
      stats
    };

    // Log result count for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Returning ${paginatedOrders.length} orders (${filteredOrders.length} total filtered)`);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders
 * 
 * Delete multiple orders by ID
 * 
 * Query Parameters:
 * @param {string} ids - Comma-separated list of order IDs to delete
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   deletedIds: string[]
 * }
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: 'No order IDs provided' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').filter(id => id.trim());

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid order IDs provided' },
        { status: 400 }
      );
    }

    // Simulate deletion delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Log deletion attempt for auditing (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Deleting orders: ${ids.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} order${ids.length === 1 ? '' : 's'}`,
      deletedIds: ids
    });

  } catch (error) {
    console.error('Error in DELETE /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete orders',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}