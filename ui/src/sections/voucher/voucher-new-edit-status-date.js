import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useGetLedgers } from 'src/api/ledger';
import { useGetProducts, useGetProductParents } from 'src/api/product';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function VoucherNewEditStatusDate({ setSelectedParent }) {
  const { control, watch } = useFormContext();

  const { ledgers, ledgersLoading, ledgersEmpty, refreshLedgers } = useGetLedgers();
  const { products, productsLoading, productsEmpty } = useGetProducts();
  const { parents, parentsLoading, parentsEmpty } = useGetProductParents();
  // const products = useSelector((state) => state.products.fetchedProducts);

  const values = watch();

  // const uniqueParents = {};
  const uniqueProducts = products.filter((product) => {
    if (!parents[product.parentName]) {
      // If parentName is not already in the uniqueParents object, add it and mark it as seen
      parents[product.parentName] = true;
      return true; // Include this product in the filtered array
    }
    return false; // Skip this product as its parentName has already been seen
  });

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedParent(newValue);
  };
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField name="voucherNumber" label="Voucher number" value={values.voucherNumber} />

      <RHFSelect
        fullWidth
        name="parent_name"
        label="Parent Name"
        InputLabelProps={{ shrink: true }}
        onChange={handleSelectChange}
        PaperPropsSx={{ textTransform: 'capitalize' }}
      >
        {parents.map((option) => (
          <MenuItem
            key={option.parentName ? option.parentName : ' '}
            value={option.parentId ? option.parentId : ' '}
          >
            {option.parentName ? option.parentName : ''}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: 'capitalize' }}
      >
        {[
          { value: 1, name: 'synced' },
          { value: 0, name: 'pending' },
          { value: 2, name: 'cancelled' },
        ].map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <Controller
        name="createdAt"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Date create"
            value={new Date(field.value)}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </Stack>
  );
}
VoucherNewEditStatusDate.propTypes = {
  setSelectedParent: PropTypes.func,
};
