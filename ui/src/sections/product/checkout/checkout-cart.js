import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// redux
import { useDispatch } from 'react-redux';
import { getPartyId } from 'src/redux/slices/checkout';
// API
import { useSearchLedgers } from 'src/api/ledger';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
// routes
import { paths } from 'src/routes/paths';
// components
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
//
import { useAuthContext } from '../../../auth/hooks';
import CheckoutCartProductList from './checkout-cart-product-list';
import CheckoutSummary from './checkout-summary';

// ----------------------------------------------------------------------

export default function CheckoutCart({
  checkout,
  onNextStep,
  onDeleteCart,
  onApplyDiscount,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onReset,
}) {
  const { cart, total, discount, subTotal, adminNote } = checkout;

  const totalItems = sum(cart.map((item) => item.quantity));
  const { user } = useAuthContext();
  const isSales = user.permissions.includes('sales');
  const dispatch = useDispatch();

  const empty = !cart.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [partyId, setPartyId] = useState();

  const debouncedQuery = useDebounce(searchQuery, 500);
  const { searchResults } = useSearchLedgers(debouncedQuery);

  const { enqueueSnackbar } = useSnackbar();
  const handleSearch = useCallback((input) => {
    setSearchQuery(input);
  }, []);
  const handlePartyNameChange = (event, newInputValue) => {
    const selectedLedger = searchResults.find((ledger) => ledger.name === newInputValue);
    if (selectedLedger) {
      setPartyId(selectedLedger.l_ID);
    } else {
      setPartyId(null); // Set partyId to null if ledger is not found
    }
  };
  useEffect(() => {
    if (partyId !== null) {
      dispatch(getPartyId({ partyId }));
    }
  }, [dispatch, partyId]);
  //  const {
  //    handleSubmit,
  //    formState: { isSubmitting },
  //  } = methods;
  const onSubmit = async (data) => {
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
      // onReset();
      console.info('DATA ', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3, p: 2 }}>
          {isSales ? (
            <Autocomplete
              fullWidth
              name="partyName"
              label="Party A/c Name"
              onInputChange={(event, newValue) => handleSearch(newValue)}
              onChange={handlePartyNameChange}
              // Filter and sanitize searchResults
              options={
                searchResults
                  ? searchResults
                      .filter((ledger) => ledger && ledger.name)
                      .map((ledger) => ledger.name)
                  : []
              }
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Party A/c Name" />}
            />
          ) : null}
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!empty ? (
            <CheckoutCartProductList
              products={cart}
              onDelete={onDeleteCart}
              onIncreaseQuantity={onIncreaseQuantity}
              onDecreaseQuantity={onDecreaseQuantity}
            />
          ) : (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.dashboard.product.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total}
          adminNote={adminNote}
          discount={discount}
          subTotal={subTotal}
          onApplyDiscount={onApplyDiscount}
        />

        {/* <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!cart.length}
          onClick={onNextStep}
        >
          Check Out
        </Button> */}
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!cart.length}
          onClick={onSubmit}
          // onClick={onNextStep}
          // loading={onSubmit}
        >
          Complete Order
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

CheckoutCart.propTypes = {
  checkout: PropTypes.object,
  onNextStep: PropTypes.func,
  onDeleteCart: PropTypes.func,
  onApplyDiscount: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
  onReset: PropTypes.func,
};
