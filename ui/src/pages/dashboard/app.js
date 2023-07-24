import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView, OverviewAppViewAdmin } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const ROLE_KEY = 'userRole';
  const userRole = sessionStorage.getItem(ROLE_KEY);
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>
      {/* <OverviewAppView /> */}
      {userRole.includes('admin') ? <OverviewAppViewAdmin /> : <OverviewAppView />}
    </>
  );
}
