import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// routes
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// components
import FormProvider from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
//
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutDelivery from './checkout-delivery';
import CheckoutPaymentMethods from './checkout-payment-methods';
import CheckoutSummary from './checkout-summary';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  {
    value: 10,
    label: 'Standard',
    description: '3-5 Days delivery',
  },
  {
    value: 20,
    label: 'Express',
    description: '2-3 Days delivery',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    label: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
  },
  {
    value: 'credit',
    label: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
  },
  {
    value: 'cash',
    label: 'Cash',
    description: 'Pay with cash when your order is delivered.',
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment({
  checkout,
  onReset,
  onNextStep,
  onBackStep,
  onGotoStep,
  onApplyShipping,
}) {
  const { total, discount, subTotal, shipping, billing } = checkout;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     onNextStep();

  //     onReset();
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    console.log('data ', data);
    try {
      const inputData = {
        partyId: checkout.partyId.partyId,
        products: checkout.cart,
        adminNote: checkout.adminNote,
      };

      console.log('🚀 ~ file: checkout-payment.js:116 ~ onSubmit ~ inputData:', inputData);

      await axiosInstance
        .post(`/api/voucher/create`, inputData)
        .then((res) => {
          enqueueSnackbar('Create success!');
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
      onNextStep();
      onReset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={onApplyShipping} options={DELIVERY_OPTIONS} />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo onBackStep={onBackStep} billing={billing} />

          <CheckoutSummary
            enableEdit
            total={total}
            subTotal={subTotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CheckoutPayment.propTypes = {
  onReset: PropTypes.func,
  checkout: PropTypes.object,
  onBackStep: PropTypes.func,
  onGotoStep: PropTypes.func,
  onNextStep: PropTypes.func,
  onApplyShipping: PropTypes.func,
};
