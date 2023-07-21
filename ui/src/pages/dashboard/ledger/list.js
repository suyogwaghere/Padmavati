import { Helmet } from 'react-helmet-async';
import LedgerListView from 'src/sections/ledger/view/ledger-list-view';
import { ProductListView } from 'src/sections/product/view';
// sections

// ----------------------------------------------------------------------

export default function LedgerListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Ledger List</title>
      </Helmet>

      <LedgerListView />
    </>
  );
}
