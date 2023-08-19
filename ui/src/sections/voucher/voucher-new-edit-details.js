import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';
// utils
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency } from 'src/utils/format-number';
// _mock

// components
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VoucherNewEditDetails({ selectedParent }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // console.log('🚀 selectedParent  :', selectedParent);

  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const values = watch();

  // console.log(
  //   '🚀 ~ file: voucher-new-edit-details.js:35 ~ VoucherNewEditDetails ~ values:',
  //   values
  // );

  const totalOnRow = values.products.map((product) => product.quantity * product.price);

  const subTotal = sum(totalOnRow);

  const totalAmount = subTotal - values.discount - values.shipping + values.taxes;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = endpoints.product.list;
        // const url = `http://192.168.1.69:3005${endpoints.product.list}`;
        const res = await axiosInstance.get(url);
        const data = await res.data;
        console.log('🚀 ~ file: voucher-new-edit-details.js:52 ~ fetchData ~ data:', data);
        const filteredNames = data.filter((product) => product.parentId === selectedParent);
        const product = filteredNames;
        console.log('🚀 ~ file: voucher-new-edit-details.js:56 ~ fetchData ~ newp:', product);
        setProducts(product);
      } catch (error) {
        console.log('error ', error);
      }
    };
    fetchData();
  }, [selectedParent]);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      productName: '',
      notes: '',
      quantity: 1,
      discount: 0,
      price: ' ',
      total: 0,
      productId: '',
      taxRate: 0,
      uom: ' ',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`products[${index}].quantity`, Number(event.target.value));
      setValue(
        `products[${index}].total`,
        values.products.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.products]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      console.log('price update');
      setValue(`products[${index}].price`, Number(event.target.value));
      console.log(
        '🚀 ~ file: voucher-new-edit-details.js:107 ~ VoucherNewEditDetails ~ event.target.value:',
        event.target.value
      );
      setValue(
        `products[${index}].total`,
        values.products.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.products]
  );

  const handleChangeNote = useCallback(
    (event, index) => {
      setValue(`products[${index}].notes`, event.target.value);
    },
    [setValue]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
      </Stack>

      {/* <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box
          sx={{
            width: 160,
            ...(values.shipping && { color: 'error.main' }),
          }}
        >
          {values.shipping ? `- ${fCurrency(values.shipping)}` : '-'}
        </Box>
      </Stack> */}

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box
          sx={{
            width: 160,
            ...(values.discount && { color: 'error.main' }),
          }}
        >
          {values.discount ? `- ${fCurrency(values.discount)}` : '0.00'}
        </Box>
      </Stack>

      {/* <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{values.taxes ? fCurrency(values.taxes) : '-'}</Box>
      </Stack> */}

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details of voucher:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFAutocomplete
                name={`products[${index}].productName`}
                label="Name"
                size="small"
                fullWidth
                onChange={(event, newValue) => {
                  // Find the selected product object based on the selected product name
                  const selectedProductObject = products.find(
                    (product) => product.productName === newValue
                  );
                  setSelectedProduct(selectedProductObject); // Store the selected product object in the statee in the state
                  // Update the form's value with the selected product's details
                  setValue(`products[${index}].productName`, selectedProductObject.productName);
                  setValue(`products[${index}].productId`, selectedProductObject.productId);
                  setValue(`products[${index}].total`, selectedProductObject.total);
                  setValue(`products[${index}].notes`, 'New product added ');
                  setValue(`products[${index}].uom`, selectedProductObject.uom);
                  setValue(`products[${index}].taxRate`, selectedProductObject.taxRate);
                  setValue(`products[${index}].quantity`, 1);
                  setValue(`products[${index}].discount`, selectedProductObject.discount);
                  setValue(`products[${index}].price`, selectedProductObject.MRP);

                  // ... other fields you want to update
                  const qq = { target: { value: 1 } };
                  const pr = { target: { value: selectedProductObject.MRP } };
                  console.log(
                    '🚀 ~ file: voucher-new-edit-details.js:273 ~ VoucherNewEditDetails ~ event:',
                    pr.target.value
                  );
                  // Trigger the change event for the other fields if needed
                  handleChangeQuantity(qq, index); // Update quantity-related calculations
                  handleChangePrice(pr, index); // Update price-related calculations
                }}
                options={products ? products.map((product) => product.productName) : []}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { productName, id } = products.filter(
                    (product) => product.productName === option
                  )[0];

                  if (!productName) {
                    return null;
                  }

                  return (
                    <li {...props} key={id}>
                      {productName}
                    </li>
                  );
                }}
              />

              <RHFTextField
                name={`products[${index}].notes`}
                size="small"
                type="text"
                label="Note"
                placeholder="Note..."
                onChange={(event) => handleChangeNote(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 300 } }}
              />

              <RHFTextField
                name={`products[${index}].quantity`}
                size="small"
                type="number"
                label="Quantity"
                placeholder="0"
                onChange={(event) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />

              <RHFTextField
                name={`products[${index}].price`}
                size="small"
                type="number"
                label="Price"
                placeholder="0.00"
                // value={`products[${index}].price`}
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>₹</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 96 } }}
              />
              <RHFTextField
                name={`products[${index}].discount`}
                disabled
                size="small"
                type="number"
                label="Discount"
                placeholder="0.00"
                // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                value={
                  // '0.00'
                  values.products[index].discount === 0 ? '0.00' : values.products[index].discount
                }
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 94 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                name={`products[${index}].total`}
                disabled
                size="small"
                type="number"
                label="Total"
                placeholder="0.00"
                value={
                  values.products[index].total === 0
                    ? ''
                    : (values.products[index].quantity * values.products[index].price).toFixed(2)
                }
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>₹</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 104 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        {/* <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        > */}
        {/* <RHFTextField
            size="small"
            label="Shipping($)"
            name="shipping"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}

        {/* <RHFTextField
            size="small"
            label="Discount($)"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}

        {/* <RHFTextField
            size="small"
            label="Taxes(%)"
            name="taxes"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}
        {/* </Stack> */}
      </Stack>

      {renderTotal}
    </Box>
  );
}
VoucherNewEditDetails.propTypes = {
  selectedParent: PropTypes.object,
};
