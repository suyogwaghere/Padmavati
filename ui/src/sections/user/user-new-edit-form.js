import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
// components
// import TextField from '@mui/material/';
import { IconButton, InputAdornment } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSearchLedgers } from 'src/api/ledger';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
// ----------------------------------------------------------------------
const userOptions = ['admin', 'customer', 'sales'];
export default function UserNewEditForm({ currentUser }) {
  const [userType, setUserType] = useState(userOptions[1]);
  // const [partyId, setPartyId] = useState(0);
  // const [val1, setValue] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  // const { ledgers } = useSearchLedgers(query);
  const { searchResults } = useSearchLedgers(debouncedQuery);

  // const [inputValue, setInputValue] = useState('');

  // console.log('🚀 ~ file: user-new-edit-form.js:41 ~ UserNewEditForm ~ inputValue:', inputValue);
  const handleSearch = useCallback((input) => {
    setSearchQuery(input);
  }, []);
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const NewUserSchema = Yup.object().shape({
    // permissions: Yup.string().required('Please Select User a Permission'),
    name: Yup.string().required('User Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('email is required'),
    password: Yup.string()
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      )
      .test('', (value, context) => {
        // Check if the condition is true
        if (!currentUser) {
          // Apply the required validation
          return Yup.string().required('Password is required').isValidSync(value);
        }
        // Skip the required validation
        return true;
      }),
    contactNo: Yup.string('Enter Contact Number')
      .required('Contact Number is required')
      .max(10, 'Must be less than 10 characters'),
  });

  const handleContactNoChange = (event) => {
    const input = event.target.value;
    const digitsOnly = input.replace(/\D/g, ''); // Remove non-digit characters
    const truncatedValue = digitsOnly.slice(0, 10); // Limit to 10 digits
    event.target.value = truncatedValue;
  };

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      contactNo: currentUser?.contactNo || '',
      partyName: currentUser?.partyName || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form data: ', data);
    try {
      if (currentUser) {
        const inputData = {
          name: data.name,
          ledgerId: data.partyId ? data.partyId : 0,
          email: data.email,
          contactNo: data.contactNo,
          permissions: [userType],
        };
        await axiosInstance
          .patch(`/api/users/${currentUser.id}`, inputData)
          .then((res) => {
            reset();
            enqueueSnackbar('Update success!');
            router.push(paths.dashboard.user.root);
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
          name: data.name,
          ledgerId: data.partyId ? data.partyId * 1 : 0,
          email: data.email,
          password: data.password,
          contactNo: data.contactNo,
          isActive: true,
          permissions: [userType],
        };
        await axiosInstance
          .post(`/register`, inputData)
          .then((res) => {
            reset();
            enqueueSnackbar('Create success!');
            router.push(paths.dashboard.user.root);
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
            Name,Email,Contact No...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {!currentUser ? (
              <RHFSelect
                name="userType"
                label="User Type"
                sx={{ width: 300 }}
                value={userType}
                key={userType}
                InputLabelProps={{ shrink: true }}
                onChange={(event, newInputValue) => {
                  setUserType(newInputValue.props.value);
                  methods.setValue('userType', newInputValue.props.value);
                }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {userOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            ) : null}

            <Autocomplete
              fullWidth
              name="partyName"
              disabled={!currentUser}
              label="Party A/c Name"
              onInputChange={(event, newValue) => handleSearch(newValue)}
              onChange={(event, newInputValue) => {
                const selectedLedger = searchResults.find(
                  (ledger) => ledger.name === newInputValue
                );
                if (selectedLedger) {
                  methods.setValue('partyName', selectedLedger.name);
                  methods.setValue('partyId', selectedLedger.l_ID); // Add this line to save partyId
                } else {
                  methods.setValue('partyName', newInputValue);
                  methods.setValue('partyId', ''); // Set partyId to empty if ledger is not found
                }
              }}
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={currentUser ? currentUser?.ledger[0].name : 'Party A/c Name'}
                />
              )}
            />
            <RHFTextField name="name" label="Name" />
            {/* !currentUser.permissions.includes('admin')  */}
            {currentUser ? (
              <RHFTextField
                name="email"
                InputProps={{
                  readOnly: true,
                }}
                label="Email"
              />
            ) : (
              <RHFTextField
                name="email"
                InputProps={{
                  readOnly: false,
                }}
                label="Email"
              />
            )}
            {!currentUser ? (
              <RHFTextField
                name="password"
                label="Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}
            <RHFTextField
              name="contactNo"
              type="tel"
              label="Contact"
              inputProps={{ maxLength: 10, onInput: handleContactNoChange }}
            />
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
          {!currentUser ? 'Create User' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
