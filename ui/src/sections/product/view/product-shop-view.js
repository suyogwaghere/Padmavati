import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
// routes
import { paths } from 'src/routes/paths';
// _mock
// api
import { useGetProducts, useSearchProducts } from 'src/api/product';
// components
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import CartIcon from '../common/cart-icon';
import { useCheckout } from '../hooks';
import ProductFiltersResult from '../product-filters-result';
import ProductList from '../product-list';
import ProductOffersCarousel from '../product-offers-carousel';
import ProductSearch from '../product-search';

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView() {
  // const products = useSelector((state) => state.products.fetchedProducts);
  // const { parents, parentsLoading, parentsEmpty } = useGetProductParents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parents = [
    {
      parentId: '1333',
      parentName: 'Farmina Pet Food',
    },
    {
      parentId: '1338',
      parentName: 'Khanal Foods Private Ltd',
    },
    {
      parentId: '1351',
      parentName: 'Pura Premium',
    },
    {
      parentId: '5247',
      parentName: 'MANKIND PETSTAR',
    },
    {
      parentId: '4932',
      parentName: 'HIMALAYA PET PRODUCTS',
    },
    {
      parentId: '1358',
      parentName: 'Venttura Feed Supplement',
    },
  ];
  const offers = [
    {
      img: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
      title: 'Special Offer 1',
      subtitle: 'Save 20% on selected items!',
    },
    {
      img: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
      title: 'Flash Sale!',
      subtitle: 'Limited-time offer: Up to 50% off!',
    },
    {
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
      title: 'New Arrival',
      subtitle: 'Discover our latest collection now!',
    },
    // Add more offers as needed
  ];
  let firstParent = 0;
  if (parents.length > 0) {
    firstParent = parents[0].parentId;
  }

  const settings = useSettingsContext();

  const { checkout } = useCheckout();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');

  const [searchQuery, setSearchQuery] = useState('');

  const [parentSelected, setParentSelected] = useState(firstParent);

  const debouncedQuery = useDebounce(searchQuery);

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const [filters, setFilters] = useState(defaultFilters);

  // const [visibleProducts, setVisibleProducts] = useState(10);

  const { products, productsLoading, productsEmpty } = useGetProducts(
    parentSelected || firstParent
  );

  useEffect(() => {
    if (parents.length > 0 && parentSelected === null && parentSelected === undefined) {
      setParentSelected(parents[0].parentId); // Set the first parent's parentId
    }
  }, [parents, parentSelected]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const dataFiltered = applyFilter({
    inputData: products,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);
  // const productsLoading = false;
  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleChange = (event, newValue) => {
    console.log('🚀 ~ file: product-shop-view.js:106 ~ handleChange ~ newValue:', newValue);

    setParentSelected(newValue);
  };

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(_id) => paths.product.details(_id)}
      />

      {/* <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={['all', ...PRODUCT_CATEGORY_OPTIONS]}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack> */}
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const renderParents = (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: '100%' },
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={parentSelected || parents[0]?.parentId}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{ width: '100%' }}
      >
        {parents.map((parent) => (
          <Tab key={parent.parentId} fullWidth label={parent.parentName} value={parent.parentId} />
        ))}
      </Tabs>
    </Box>
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.cart.length} />
      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Shop
      </Typography>
      <ProductOffersCarousel offers={offers} />
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
          alignItems: 'center',
        }}
      >
        {renderParents}
      </Stack>
      {(notFound && renderNotFound) || productsEmpty}

      <ProductList products={dataFiltered} loading={productsLoading} />
      {/* {visibleProducts < 915 && (
        <Fab
          sx={{
            ml: 'auto',
            mr: 'auto',
            my: 3,
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
          }}
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
        >
          Load More
        </Fab>
      )} */}
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
        }}
      >
        {visibleProducts < 915 && (
          <Fab
            variant="extended"
            onClick={() => setVisibleProducts(visibleProducts + 10)}
            size="medium"
            color="primary"
            aria-label="add"
          >
            Load More
          </Fab>
        )}
      </Box> */}

      {/* <button type="button" onClick={() => setVisibleProducts(visibleProducts + 10)}>
        </button>  */}
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    inputData = orderBy(inputData, ['totalSold'], ['desc']);
  }

  if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['price'], ['asc']);
  }

  // FILTERS
  if (gender.length) {
    inputData = inputData.filter((product) => gender.includes(product.gender));
  }

  if (category !== 'all') {
    inputData = inputData.filter((product) => product.category === category);
  }

  if (colors.length) {
    inputData = inputData.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter((product) => product.price >= min && product.price <= max);
  }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
