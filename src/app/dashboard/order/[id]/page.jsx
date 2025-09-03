import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/global-config';
import OrderDetailsView from 'src/sections/order/view/order-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }) {
  const orderId = params.id;
  const currentOrder = _orders.find((order) => order.order_id === orderId);

  return <OrderDetailsView order={currentOrder} />;
}

// ----------------------------------------------------------------------

const dynamic = 'force-dynamic';
export { dynamic };