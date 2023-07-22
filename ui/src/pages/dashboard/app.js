import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView, OverviewAppViewAdmin } from 'src/sections/overview/app/view';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const { user } = useAuthContext();

  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>
      {user.permissions.includes('admin') ? <OverviewAppViewAdmin /> : <OverviewAppView />}
    </>
  );
}
