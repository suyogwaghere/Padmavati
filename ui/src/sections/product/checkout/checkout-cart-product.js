import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @mui
// eslint-disable-next-line import/no-extraneous-dependencies
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import { useDispatch } from 'react-redux';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { updateCartItemNote } from 'src/redux/slices/checkout';
// import { ColorPreview } from 'src/components/color-utils';
//
import IncrementerButton from '../common/incrementer-button';

// ----------------------------------------------------------------------

export default function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }) {
  const {
    id,
    productId,
    productName,
    uom,
    // sellPrice,
    MRP,
    coverUrl,
    quantity,
    discount,
    available,
  } = row;
  const [notes, setTextInputValue] = useState('');
  const [disc, setDiscount] = useState(discount);

  const dispatch = useDispatch();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    if (notes.length > 3) {
      const data = {
        productId,
        notes,
        disc,
      };
      dispatch(updateCartItemNote(data));
      console.log(
        '🚀 ~ file: checkout-cart-product.js:42 ~ handleTextInputChange ~ newNote:',
        notes
      );
    }

    // return () => {
    //   second;
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, disc]);

  const handleTextInputChange = (event) => {
    const newNote = event.target.value;
    setTextInputValue(newNote);
  };
  const handleDiscountChange = (event) => {
    const newNote = event.target.value;
    setDiscount(newNote);
  };
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="rounded"
          alt={productName}
          src={coverUrl}
          sx={{ width: 64, height: 64, mr: 2 }}
        />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {productName}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'body2', color: 'text.secondary' }}
          >
            UOM: <Label sx={{ ml: 0.5 }}> {uom} </Label>
            <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
            {/* <ColorPreview colors={colors} /> */}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={quantity <= 1}
            disabledIncrease={quantity >= available}
          />

          {/* <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
            available:{available} 
          </Typography> */}
        </Box>
      </TableCell>
      <TableCell>
        <Accordion align="center" sx={{ m: 1, width: '15ch' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Note</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Write note"
              variant="outlined"
              size="small"
              value={notes}
              onChange={handleTextInputChange}
            />
          </AccordionDetails>
        </Accordion>
      </TableCell>
      <TableCell>{fCurrency(MRP)}</TableCell>

      {/* <TableCell align="center">
        <TextField
          label="discount"
          variant="outlined"
          size="small"
          value={disc}
          type="number"
          onChange={handleDiscountChange}
          inputProps={{ min: 0, max: 99 }}
          // onChange={handleTextInputChange}
        />
         <Typography variant="outlined" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
          {discount}
        </Typography> 
      </TableCell> */}

      <TableCell align="center">{discount || `0%`}</TableCell>
      <TableCell align="right">{fCurrency(MRP * quantity)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

CheckoutCartProduct.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};
