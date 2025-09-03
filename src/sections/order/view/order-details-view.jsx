'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock/_order';
import { DashboardContent } from 'src/layouts/dashboard';

// Correct imports for default exports
import { OrderItemDetail } from '../order-details-item';
import OrderSpecialRequest from '../order-special-request';
import OrderAddonAssignment from '../order-addon-assignment';
import { OrderDetailsCustomer } from '../order-details-customer';
import { OrderDetailsStarting } from "../order-details-starting"
import { OrderDetailsDelivery } from '../order-details-delivery';
import OrderPaymentDetail from '../order-details-payment';

import { OrderDetailsToolbar } from '../order-details-toolbar';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ order }) {
  const [status, setStatus] = useState(order?.order_status);

  const handleChangeStatus = useCallback((newValue) => {
    // TODO: Call backend API to update order status here
    setStatus(newValue);
  }, []);

  const handleCancelOrder = useCallback(() => {
    // TODO: Call backend API to cancel the order here
    // Example: await api.cancelOrder(order.order_id);
    alert('Order cancelled!'); // Replace with your logic/UI
  }, [order]);

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        status={status}
        createdAt={order?.created_at}
        orderNumber={order?.orderNumber}
        backHref={paths.dashboard.order.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            {/* Item details section */}
            <OrderItemDetail
              items={order.items}
              subtotal={order.total_amount}
              discount={order.total_discount_amount}
              taxes={order.taxes}
              totalAmount={order.final_amount} // taxes already included
            />

            {/* Special request section */}
            <OrderSpecialRequest
              special_requests={order.special_requests}
              special_request_notes={order.special_request_notes}
            />

            {/* Add-on assignment section */}
            <OrderAddonAssignment addons={order?.addons} />

            {/* Payment info section */}
            <OrderPaymentDetail order={order} />


          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            {/* Customer info section */}
            <OrderDetailsCustomer customer={order?.customer} />

            <Divider sx={{ borderStyle: 'dashed' }} />
            {/* Starting info section */}
            <OrderDetailsStarting
              startType={order?.start_type}
              startDate={order?.start_date}
              eddDate={order?.edd_date}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />
            {/* Delivery info section */}
            <OrderDetailsDelivery delivery={order?.shippingAddress} />

          </Card>
          {/* Cancel Order Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              sx={{ fontWeight: 600 }}
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}