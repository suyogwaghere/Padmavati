import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// API
import { useSearchLedgers } from 'src/api/ledger';
// redux
import { useDispatch } from 'react-redux';
import { getPartyId } from 'src/redux/slices/checkout';

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

export default function VoucherNewEditStatusDate({ setSelectedParent, currentVoucher }) {
  const { control, setValue, watch } = useFormContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [partyId, setPartyId] = useState();

  const debouncedQuery = useDebounce(searchQuery, 500);
  const { searchResults } = useSearchLedgers(debouncedQuery);

  const { parents, parentsLoading, parentsEmpty } = useGetProductParents();

  const dispatch = useDispatch();
  const values = watch();

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
  // console.log('🚀 ~ file: auth-provider.js:120 ~ login ~ partyId:', partyId);

  // const newPartyId = {
  //   partyId,
  // };
  useEffect(() => {
    if (partyId !== null) {
      dispatch(getPartyId({ partyId }));
    }
  }, [dispatch, partyId]);
  useEffect(() => {
    if (partyId !== null) {
      setValue('partyId', partyId);
    }
  }, [setValue, partyId]);
  // try {
  //   // dis(getPartyId(newPartyId));
  // } catch (error) {
  //   console.error(error);
  // }

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      {values.voucherNumber && (
        <RHFTextField
          name="voucherNumber"
          disabled
          label="Voucher number"
          value={values.voucherNumber}
        />
      )}
      <Autocomplete
        fullWidth
        name="partyName"
        label="Party A/c Name"
        disabled={currentVoucher !== null}
        onInputChange={(event, newValue) => handleSearch(newValue)}
        onChange={handlePartyNameChange}
        // Filter and sanitize searchResults
        options={
          searchResults
            ? searchResults.filter((ledger) => ledger && ledger.name).map((ledger) => ledger.name)
            : []
        }
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={currentVoucher ? currentVoucher?.partyName : 'Party A/c Name'}
            inputProps={{
              ...params.inputProps,
              disabled: currentVoucher, // Disable the input field conditionally
            }}
          />
        )}
      />
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
  currentVoucher: PropTypes.object,
};
