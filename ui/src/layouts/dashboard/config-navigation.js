import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';
// auth
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  ledger: icon('ic_ledger'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { user } = useAuthContext();
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'overview',
      //   items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
      // },
      // USER
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'Account',
      //   items: [
      //     {
      //       title: 'Account',
      //       path: paths.dashboard.root,
      //       icon: ICONS.dashboard,
      //       children: [
      //         {
      //           title: t('User'),
      //           path: '',
      //           children: [
      //             { title: user?.displayName, path: '' },
      //             { title: user?.email, path: '' },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          // PRODUCT

          {
            title: t('product'),
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              { title: t('list'), path: paths.dashboard.product.root },
              // { title: t('create'), path: paths.dashboard.product.new },
              // { title: t('details'), path: paths.dashboard.product.demo.details },
              // { title: t('create'), path: paths.dashboard.product.new },
              { title: t('checkout'), path: paths.dashboard.product.checkout },
              // { title: t('edit'), path: paths.dashboard.product.demo.edit },
            ],
          },
          {
            title: t('Vouchers'),
            path: paths.dashboard.voucher.root,
            icon: ICONS.invoice,
            children: [
              { title: t('list'), path: paths.dashboard.voucher.root },
              { title: t('create'), path: paths.dashboard.voucher.new },
            ],
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, user?.displayName, user?.email]
  );
  const dataAdmin = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('list'), path: paths.dashboard.user.root },
              { title: t('create'), path: paths.dashboard.user.new },
            ],
          },

          // LEDGERS

          {
            title: t('Ledger'),
            path: paths.dashboard.ledger.root,
            icon: ICONS.ledger,
            children: [
              { title: t('list'), path: paths.dashboard.ledger.root },
              // { title: t('create'), path: paths.dashboard.product.new },
            ],
          },
          // PRODUCT

          {
            title: t('product'),
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              { title: t('list'), path: paths.dashboard.product.root },
              // { title: t('create'), path: paths.dashboard.product.new },
              // { title: t('details'), path: paths.dashboard.product.demo.details },
              // { title: t('create'), path: paths.dashboard.product.new },
              { title: t('checkout'), path: paths.dashboard.product.checkout },
              // { title: t('edit'), path: paths.dashboard.product.demo.edit },
            ],
          },
          {
            title: t('Vouchers'),
            path: paths.dashboard.voucher.root,
            icon: ICONS.invoice,
            children: [
              { title: t('list'), path: paths.dashboard.voucher.root },
              { title: t('create'), path: paths.dashboard.voucher.new },
            ],
          },
        ],
      },
    ],
    [t]
  );

  if (user !== null) {
    return user.permissions.includes('admin') ? dataAdmin : data;
  }
  return data;
}
