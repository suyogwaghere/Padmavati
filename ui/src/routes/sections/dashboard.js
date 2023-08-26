import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
// voucher
// import VoucherEditPage from 'src/pages/dashboard/voucher/edit';
// import VoucherCreatePage from 'src/pages/dashboard/voucher/new';
import { VoucherDetailsView, VoucherEditView, VoucherListView } from '../../sections/voucher/view';
// ----------------------------------------------------------------------
const MaintenancePage = lazy(() => import('src/pages/maintenance'));

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// LEDGER
const LedgerListPage = lazy(() => import('../../pages/dashboard/ledger/list'));
// PRODUCT
const ProductListPage = lazy(() => import('src/pages/product/list'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));
// USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// BLANK PAGE
const VoucherCreatePage = lazy(() => import('src/pages/dashboard/voucher/new'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserListPage />, index: true },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: 'checkout', element: <ProductCheckoutPage /> },
        ],
      },
      {
        path: 'ledger',
        children: [
          { element: <LedgerListPage />, index: true },
          { path: 'list', element: <LedgerListPage /> },
        ],
      },
      {
        path: 'voucher',
        children: [
          { element: <VoucherListView />, index: true },
          { path: 'list', element: <VoucherListView /> },
          { path: 'new', element: <VoucherCreatePage /> },
          { path: ':id', element: <VoucherDetailsView /> },
          { path: ':id/edit', element: <VoucherEditView /> },
        ],
      },
      {
        path: 'maintenance',
        children: [
          { element: <MaintenancePage />, index: true },
          // { path: 'maintenance', element: <MaintenancePage /> },
        ],
      },
    ],
  },
];
