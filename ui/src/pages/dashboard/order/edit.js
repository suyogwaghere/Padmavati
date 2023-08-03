import { Helmet } from 'react-helmet-async';
import { OrderEditView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function ProductEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      <OrderEditView />
    </>
  );
}
