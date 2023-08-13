import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useCheckout } from 'src/sections/product/hooks';
// _mock
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import FormProvider from 'src/components/hook-form';
//
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import VoucherNewEditDetails from './voucher-new-edit-details';
import VoucherNewEditStatusDate from './voucher-new-edit-status-date';

// ----------------------------------------------------------------------

export default function VoucherNewEditForm({ currentVoucher }) {
  const router = useRouter();
  const [selectedParent, setSelectedParent] = useState(null);

  // selectedParent={selectedParent}
  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { checkout } = useCheckout();

  const createVoucherSchema = Yup.object().shape({
    // Define the validation rules for creating a new voucher
    // partyName: Yup.string().required('Party name is required'),
    // Add validation rules for other fields...
  });

  const NewInvoiceSchema = Yup.object().shape({
    createdAt: Yup.mixed().nullable().required('Create date is required'),
    // not required
    taxes: Yup.number(),
    status: Yup.number(),
    discount: Yup.number(),
    shipping: Yup.number(),
    totalAmount: Yup.number(),
    voucherNumber: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      partyId: currentVoucher?.partyId || checkout.partyId.partyId,
      partyName: currentVoucher?.partyName || '',
      voucherNumber: currentVoucher?.id || '',
      createdAt: currentVoucher?.createdAt || new Date(),
      taxes: currentVoucher?.taxes || 0,
      shipping: currentVoucher?.shipping || 0,
      status: currentVoucher?.is_synced || 0,
      discount: currentVoucher?.discount || 0,
      products: currentVoucher?.products || [
        {
          productName: '',
          productId: '',
          notes: '',
          // description: '',
          // service: '',
          uom: '',
          taxRate: 1,
          quantity: 1,
          discount: 0,
          price: 0,
          total: 0,
        },
      ],
      totalAmount: currentVoucher?.totalAmount || 0,
      adminNote: currentVoucher?.adminNote || 'testAdminNote',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentVoucher]
  );

  const defaultCreateValues = useMemo(
    () => ({
      // Set default values for creating a new voucher
      partyName: '',
      voucherNumber: '',
      createdAt: new Date(),
      // Set default values for other fields...
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log(data);
    console.log(data.createdAt);
    const date = new Date(data.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;

    const updatedVoucherData = {
      ...data,
      date: formattedDate,
    };
    try {
      await axiosInstance
        .post(`/api/voucher/update`, updatedVoucherData)
        .then((res) => {
          if (res.data.success) {
            reset();
            enqueueSnackbar('Voucher Updated Successfully!');
            router.push(paths.dashboard.voucher.root);
          } else {
            enqueueSnackbar('something went wrong!', { variant: 'error' });
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            err.response.data.error.message
              ? err.response.data.error.message
              : 'something went wrong!',
            { variant: 'error' }
          );
        });
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  const handleCreateVoucher = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log('Voucher Create Data : ', data);
    // const date = new Date(data.createdAt);
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // const formattedDate = `${day}-${month}-${year}`;

    const voucherData = {
      ...data,
    };
    try {
      await axiosInstance
        .post(`/api/voucher/create`, voucherData)
        .then((res) => {
          if (res.data.success) {
            reset();
            enqueueSnackbar('Voucher Created Successfully!');
            router.push(paths.dashboard.voucher.root);
          } else {
            enqueueSnackbar('something went wrong!', { variant: 'error' });
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            err.response.data.error.message
              ? err.response.data.error.message
              : 'something went wrong!',
            { variant: 'error' }
          );
        });
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  useEffect(() => {
    if (currentVoucher) {
      const {
        id,
        partyName,
        partyId,
        totalAmount,
        totalQuantity,
        createdAt,
        McName,
        Saletype,
        is_synced,
        taxes,
        adminNote,
        products,
      } = currentVoucher;
      const updatedValues = {
        partyName,
        partyId,
        McName,
        Saletype,
        adminNote,
        voucherNumber: id || '',
        createdAt: createdAt || new Date(),
        taxes: taxes || 0,
        status: is_synced || 0,
        products: products || [{ name: '', notes: '', quantity: 1, price: 0, total: 0 }],
        totalAmount: totalAmount || 0,
      };
      // Set the form values using the setValue method from react-hook-form
      Object.keys(updatedValues).forEach((key) => {
        methods.setValue(key, updatedValues[key]);
      });
    }
  }, [currentVoucher, methods]);

  return (
    <FormProvider methods={methods}>
      <Card>
        <VoucherNewEditStatusDate setSelectedParent={setSelectedParent} />

        <VoucherNewEditDetails selectedParent={selectedParent} />
      </Card>
      {currentVoucher && currentVoucher.is_synced === 0 ? (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend.value && isSubmitting}
            onClick={() => {
              console.log('here');
              handleCreateAndSend();
            }}
          >
            Update
          </LoadingButton>
        </Stack>
      ) : (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend.value && isSubmitting}
            onClick={() => {
              console.log('here');
              handleCreateVoucher();
            }}
          >
            Create Voucher
          </LoadingButton>
        </Stack>
      )}
    </FormProvider>
  );
}

VoucherNewEditForm.propTypes = {
  currentVoucher: PropTypes.object,
};
