import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
// import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { updateAdminNote } from 'src/redux/slices/checkout';
import { useDispatch } from 'react-redux';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subTotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false,
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const [adminNote, setAdminNote] = useState('');
  const handleInsertNote = (event) => {
    const newNote = event.target.value;
    setAdminNote(newNote);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (adminNote.length > 0) {
      dispatch(updateAdminNote(adminNote));
      console.log(
        '🚀 ~ file: checkout-cart-product.js:42 ~ handleTextInputChange ~ newNote:',
        adminNote
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminNote]);
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          enableEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          {/* <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? fCurrency(shipping) : displayShipping}
            </Typography>
          </Stack> */}

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              {/* <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography> */}
            </Box>
          </Stack>

          {/* {enableDiscount && onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )} */}

          <TextField
            fullWidth
            placeholder="Note"
            value={adminNote}
            size="small"
            onChange={handleInsertNote}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

CheckoutSummary.propTypes = {
  discount: PropTypes.number,
  enableDiscount: PropTypes.bool,
  enableEdit: PropTypes.bool,
  onApplyDiscount: PropTypes.func,
  onEdit: PropTypes.func,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  total: PropTypes.number,
};
