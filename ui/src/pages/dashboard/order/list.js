import { Helmet } from 'react-helmet-async';
import { OrderListView } from 'src/sections/order/view';
// sections

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
