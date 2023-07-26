import { Helmet } from 'react-helmet-async';
import { VoucherCreateView } from 'src/sections/voucher/view';
// sections

// ----------------------------------------------------------------------

export default function VoucherCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <VoucherCreateView />
      {/* <UserCreateView /> */}
    </>
  );
}
