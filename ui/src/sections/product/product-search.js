import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';
// @mui
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import Snackbar from '@mui/material/Snackbar';
// routes
// import { useRouter } from 'src/routes/hook';
// components
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
// redux
import { useSnackbar } from 'src/components/snackbar';
import { addToCart } from 'src/redux/slices/checkout';
import { useDispatch } from 'src/redux/store';

// ----------------------------------------------------------------------

export default function ProductSearch({
  query,
  results,
  onSearch,
  setClearedResults,
  hrefItem,
  loading,
}) {
  // const router = useRouter();
  const [inputV, setInputValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const handleClick = (e, product) => {
    e.preventDefault();
    // router.push(hrefItem(id));
    setClearedResults([]);
    // onSearch('');
    // setInputValue('');

    const {
      id,
      productId,
      productName,
      coverUrl,
      uom,
      taxRate,
      notes,
      // sellPrice,
      purchasePrice,
      MRP,
    } = product;
    const newProduct = {
      id,
      productId,
      productName,
      coverUrl,
      uom,
      // sellPrice,
      taxRate,
      MRP,
      quantity: 1,
      notes,
    };
    const modifiedProduct = {
      ...product, // Copy all properties from the original product
      price: product.MRP, // Rename sellPrice to price
      quantity: 1,
    };

    // Remove the sellPrice property from the modifiedProduct
    delete modifiedProduct.sellPrice;
    try {
      dispatch(addToCart(modifiedProduct));
      enqueueSnackbar(`${modifiedProduct.productName} added in cart`, {
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyUp = (event) => {
    if (query) {
      if (event.key === 'Enter') {
        const selectItem = results.filter((product) => product.productName === query)[0];

        handleClick(selectItem.id);
      }
    }
  };

  return (
    <Autocomplete
      fullWidth
      loading={loading}
      autoHighlight
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={inputV}
      // clearOnEscape
      popupIcon={null}
      options={results}
      onOpen={(event, newValue) => {
        setClearedResults([]);
      }}
      onInputChange={(event, newValue) => {
        onSearch(newValue);
      }}
      getOptionLabel={(option) => option?.productName || ''}
      // noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      noOptionsText="Search Product"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      // slotProps={{
      //   popper: {
      //     placement: 'bottom-start',
      //     sx: {
      //       minWidth: 320,
      //     },
      //   },
      //   paper: {
      //     sx: {
      //       [` .${autocompleteClasses.option}`]: {
      //         pl: 0.75,
      //       },
      //     },
      //   },
      // }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue }) => {
        const matches = match(product.productName, inputValue);
        const parts = parse(product.productName, matches);

        return (
          <Box
            component="li"
            sx={{
              width: '100% !important',
              // alignItems: 'center !important', // Align items along the center vertically
              display: 'flex !important', // Use flex display
              // justifyContent: 'space-between !important', // Distribute items along the horizontal axis
            }}
            {...props}
            onClick={(e) => handleClick(e, product)}
            key={product.id}
          >
            {/* <Avatar
              key={product.id}
              alt={product.productName}
              src={product.coverUrl}
              variant="rounded"
              sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
            /> */}

            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
            {/* <Fab
              color="warning"
              size="medium"
              className="add-cart-btn"
              // onClick={handleAddCart}
              sx={{
                // right: 5,
                // left: 5,
                alignSelf: 'flex-end !important',
                // up: 0,
                // alignItems: 'flex-end',
                // bottom: 5,
                // display: 'flex',
                // zIndex: 9,
                // opacity: 0,
                // position: 'absolute',
                // transition: (theme) =>
                //   theme.transitions.create('all', {
                //     easing: theme.transitions.easing.easeInOut,
                //     duration: theme.transitions.duration.shorter,
                //   }),
              }}
            >
              <Iconify icon="solar:cart-plus-bold" width={24} />
            </Fab> */}
          </Box>
        );
      }}
    />
  );
}

ProductSearch.propTypes = {
  hrefItem: PropTypes.func,
  loading: PropTypes.bool,
  setClearedResults: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
