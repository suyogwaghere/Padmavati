import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppViewAdmin } from 'src/sections/overview/app/view';

const ProductListPage = lazy(() => import('src/pages/product/list'));
// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const ROLE_KEY = 'userRole';
  const userRole = sessionStorage.getItem(ROLE_KEY);
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      {userRole.includes('admin') ? <OverviewAppViewAdmin /> : <ProductListPage />}
    </>
  );
}
