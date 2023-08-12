import { Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
// sections
import { OverviewAppViewAdmin } from 'src/sections/overview/app/view';
import { VoucherListView } from 'src/sections/voucher/view';
import { useAuthContext } from '../../auth/hooks';

// const ProductListPage = lazy(() => import('src/pages/product/list'));
// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>
      {user.permissions.includes('admin') ? (
        <Grid>
          <Grid>
            <OverviewAppViewAdmin />
          </Grid>
          <Grid my={3}>
            <VoucherListView />
          </Grid>
        </Grid>
      ) : (
        <Navigate to={paths.dashboard.product.root} replace />
      )}
    </>
  );
}
