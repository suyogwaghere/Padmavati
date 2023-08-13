import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { Typography } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LedgerTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow }) {
  const {
    l_ID,
    name,
    group,
    openingValue,
    address,
    country,
    state,
    gstIn,
    whatsapp_no,
    mobile_no,
    pincode,
    station,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Typography variant="subtitle">{l_ID}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{name}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{group}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle">{`${
            // eslint-disable-next-line no-nested-ternary
            openingValue > 0
              ? `${openingValue} Cr`
              : openingValue === 0
              ? openingValue
              : `${Math.abs(openingValue)} Dr`
          }`}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{address}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{country}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{state}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{gstIn}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{whatsapp_no}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{mobile_no}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{pincode}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle">{station}</Typography>
        </TableCell>
        {/*
         <TableCell align="right">
            <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(confirm);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

LedgerTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
