// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
//
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import OrderNewEditForm from '../order-new-edit-form';

// ----------------------------------------------------------------------

export default function OrderCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product list"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Order',
            href: paths.dashboard.order.root,
          },
          { name: 'New Order' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OrderNewEditForm />
    </Container>
  );
}
