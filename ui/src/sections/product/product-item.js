import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Fab from '@mui/material/Fab';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// utils
import { fCurrency } from 'src/utils/format-number';
// redux
import { addToCart } from 'src/redux/slices/checkout';
import { useDispatch } from 'src/redux/store';
// components

// components
// import Label from 'src/components/label';
// import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
// import { ColorPreview } from 'src/components/color-utils';
// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const {
    id,
    productName,
    coverUrl,
    // colors,
    // available,
    // sizes,
    sellPrice,
    purchasePrice,
    MRP,
  } = product;

  const dispatch = useDispatch();

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      productName,
      coverUrl,
      // available,
      sellPrice,
      // colors,
      MRP,
      quantity: 1,
    };
    try {
      dispatch(addToCart(newProduct));
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >
      {/* {newLabel.enabled && (
        <Label variant="filled" color="info">
          {newLabel.content}
        </Label>
      )}
      {saleLabel.enabled && (
        <Label variant="filled" color="error">
          {saleLabel.content}
        </Label>
      )} */}
    </Stack>
  );

  // const renderImg = (
  //   <Box sx={{ position: 'relative', p: 1 }}>

  //     <Image alt={productName} src={coverUrl} ratio="1/1" sx={{ borderRadius: 1.5 }} />
  //   </Box>
  // );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      {/* <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {productName}
      </Link> */}
      <Typography variant="caption" component="div" sx={{ color: 'text.primary', mt: 1 }}>
        {productName}
      </Typography>
      <Fab
        color="warning"
        size="medium"
        className="add-cart-btn"
        onClick={handleAddCart}
        sx={{
          right: 12,
          up: 12,
          // zIndex: 9,
          // opacity: 0,
          position: 'absolute',
          // transition: (theme) =>
          //   theme.transitions.create('all', {
          //     easing: theme.transitions.easing.easeInOut,
          //     duration: theme.transitions.duration.shorter,
          //   }),
        }}
      >
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Fab>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <ColorPreview colors={colors} /> */}
        <Typography variant="caption" component="div" sx={{ color: 'text.primary', mt: 1 }}>
          Price: ₹
          {purchasePrice && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(purchasePrice)}
            </Box>
          )}{' '}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Typography variant="caption" component="div" sx={{ color: 'text.primary', mt: 1 }}>
            MRP: ₹ <Box component="span">{fCurrency(sellPrice)}</Box>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderLabels}

      {/* {renderImg} */}

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
