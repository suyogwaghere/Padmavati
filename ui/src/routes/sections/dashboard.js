import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import BrandEditPage from 'src/pages/dashboard/brand/edit';
import BrandCreatePage from 'src/pages/dashboard/brand/new';
import UserEditPage from 'src/pages/dashboard/user/edit';
import UserListPage from 'src/pages/dashboard/user/list';
import UserCreatePage from 'src/pages/dashboard/user/new';
import VoucherEditPage from 'src/pages/dashboard/voucher/edit';
import VoucherCreatePage from 'src/pages/dashboard/voucher/new';
import VoucherEditView from 'src/sections/voucher/view/voucher-edit-view';
import VoucherListView from '../../sections/voucher/view/voucher-list-view';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/app'));

// LEDGER
const LedgerListPage = lazy(() => import('src/pages/dashboard/ledger/list'));

// PRODUCT
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));

// Category
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
const CategoryCreatePage = lazy(() => import('src/pages/dashboard/category/new'));
const CategoryEditPage = lazy(() => import('src/pages/dashboard/category/edit'));

// Brands
const BrandListPage = lazy(() => import('src/pages/dashboard/brand/list'));

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
        path: 'category',
        children: [
          { element: <CategoryListPage />, index: true },
          { path: 'list', element: <CategoryListPage /> },
          { path: 'new', element: <CategoryCreatePage /> },
          { path: ':id/edit', element: <CategoryEditPage /> },
        ],
      },

      {
        path: 'brand',
        children: [
          { element: <BrandListPage />, index: true },
          { path: 'brand', element: <BrandListPage /> },
          { path: 'new', element: <BrandCreatePage /> },
          { path: ':id/edit', element: <BrandEditPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'User',
        children: [
          { element: <UserListPage />, index: true },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
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
        path: 'Voucher',
        children: [
          { element: <VoucherListView />, index: true },
          { path: 'list', element: <VoucherListView /> },
          { path: 'new', element: <VoucherCreatePage /> },
          { path: ':id', element: <VoucherEditPage /> },
          { path: ':id/edit', element: <VoucherEditView /> },
        ],
      },
    ],
  },
];
