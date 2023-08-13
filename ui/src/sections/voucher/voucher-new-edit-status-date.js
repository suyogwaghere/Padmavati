import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useGetProductParents } from 'src/api/product';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function VoucherNewEditStatusDate({ setSelectedParent }) {
  const { control, watch } = useFormContext();

  const { parents, parentsLoading, parentsEmpty } = useGetProductParents();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      {values.voucherNumber && (
        <RHFTextField name="voucherNumber" label="Voucher number" value={values.voucherNumber} />
      )}
      <Autocomplete
        fullWidth
        name="parent_name"
        label="Parent Name"
        clearOnEscape
        id="clear-on-escape"
        onInputChange={(event, newValue) => newValue}
        onChange={(event, newInputValue) => {
          const selectedOption = parents.find((option) => option.parentName === newInputValue);

          if (selectedOption) {
            setSelectedParent(selectedOption.parentId);
          } else {
            setSelectedParent(newInputValue);
          }
        }}
        // Filter and sanitize parents
        options={
          parents
            ? parents
                .filter((option) => option && option.parentName)
                .map((option) => option.parentName)
            : []
        }
        renderInput={(params) => <TextField {...params} label="Parent Name" />}
      />
      <RHFSelect
        fullWidth
        disabled
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
      {values.voucherNumber && (
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
      )}
    </Stack>
  );
}
VoucherNewEditStatusDate.propTypes = {
  setSelectedParent: PropTypes.func,
};
