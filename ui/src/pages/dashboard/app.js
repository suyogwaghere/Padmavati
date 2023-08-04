import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';

// sections
import { OverviewAppViewAdmin } from 'src/sections/overview/app/view';

// const ProductListPage = lazy(() => import('src/pages/product/list'));
// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const ROLE_KEY = 'userRole';
  const userRole = sessionStorage.getItem(ROLE_KEY);
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>
      {userRole.includes('admin') ? (
        <OverviewAppViewAdmin />
      ) : (
        <Navigate to={paths.dashboard.product.root} replace />
      )}
    </>
  );
}
