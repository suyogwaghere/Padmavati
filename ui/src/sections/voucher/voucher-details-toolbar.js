import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import { useCallback } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function VoucherDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const router = useRouter();
  const handleEditVoucher = (id) => {
    console.log('🚀 ~ file: voucher-details-toolbar.js:35 ~ test: ', id);
    router.push(paths.dashboard.voucher.edit(id));
  };

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order {orderNumber} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 1 && 'success') ||
                  (status === 0 && 'warning') ||
                  (status === 2 && 'error') ||
                  'default'
                }
              >
                {(status === 0 && 'Pending') ||
                  (status === 1 && 'Synced') ||
                  (status === 2 && 'Cancelled')}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            disabled
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {(status === 0 && 'Pending') ||
              (status === 1 && 'Synced') ||
              (status === 2 && 'Cancelled')}
          </Button>

          {/* <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button> */}

          <Button
            color="inherit"
            onClick={() => handleEditVoucher(orderNumber)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit Voucher
          </Button>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

VoucherDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
