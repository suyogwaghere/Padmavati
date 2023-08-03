import { Helmet } from 'react-helmet-async';
import { OrderCreateView } from 'src/sections/order/view';
// sections

// ----------------------------------------------------------------------

export default function OrderCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Order list</title>
      </Helmet>

      <OrderCreateView />
    </>
  );
}
