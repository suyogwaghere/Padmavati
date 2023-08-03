// @mui
import Container from '@mui/material/Container';
// routes
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// api
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
//
import { useGetCategory } from 'src/api/category';
import OrderNewEditForm from '../order-new-edit-form';

// ----------------------------------------------------------------------

export default function OrderEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { category: currentCategory } = useGetCategory(`${id}`);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Order',
            href: paths.dashboard.order.root,
          },
          { name: currentCategory?.categoryName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OrderNewEditForm currentCategory={currentCategory} />
    </Container>
  );
}
