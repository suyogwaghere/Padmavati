import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
// components
import List from '@mui/material/List';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
//
import { useGetProducts } from 'src/api/product';
import ProductTableToolbar from './order-table-toolbar';
import NotificationItem from '../../layouts/_common/cart-popover/cart-item';
// ----------------------------------------------------------------------

export default function OrderNewEditForm({ currentCategory }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  // const { products, productsLoading, productsEmpty } = useGetProducts(5);

  const NewCategorySchema = Yup.object().shape({
    categoryName: Yup.string().required('Category Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      categoryName: currentCategory?.categoryName || '',
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCategory) {
      reset(defaultValues);
    }
  }, [currentCategory, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCategory) {
        const inputData = {
          categoryName: data.categoryName,
        };
        await axiosInstance
          .patch(`/api/orders/${currentCategory.id}`, inputData)
          .then((res) => {
            reset();
            enqueueSnackbar('Update success!');
            router.push(paths.dashboard.order.root);
          })
          .catch((err) => {
            enqueueSnackbar(
              err.response.data.error.message
                ? err.response.data.error.message
                : 'something went wrong!',
              { variant: 'error' }
            );
          });
      } else {
        const inputData = {
          categoryName: data.categoryName,
        };
        await axiosInstance
          .post(`/api/order/create`, inputData)
          .then((res) => {
            reset();
            enqueueSnackbar('Create success!');
            router.push(paths.dashboard.order.root);
          })
          .catch((err) => {
            console.error(err.response.data.error.message);
            enqueueSnackbar(
              err.response.data.error.message
                ? err.response.data.error.message
                : 'something went wrong!',
              { variant: 'error' }
            );
          });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="categoryName" label="Category Name" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentCategory ? 'Create Category' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );
  // const renderList = (
  //   <Scrollbar>
  //     <Card>
  //       <ProductTableToolbar
  //       // filters={filters}
  //       // onFilters={handleFilters}
  //       //
  //       // stockOptions={PRODUCT_STOCK_OPTIONS}
  //       // publishOptions={PUBLISH_OPTIONS}
  //       />
  //       <List disablePadding>
  //         {products.map((product) => (
  //           <NotificationItem key={product.id} product={product} />
  //         ))}
  //       </List>
  //     </Card>
  //   </Scrollbar>
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* {renderDetails} */}
        {/* {renderList} */}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

OrderNewEditForm.propTypes = {
  currentCategory: PropTypes.object,
};
