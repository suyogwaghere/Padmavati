// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useState, useMemo } from 'react';
// ----------------------------------------------------------------------

export function useGetProducts(parentId) {
  const URL = endpoints.product.list;
  const queryParams = `filter[where][parentId]=${parentId}`;
  const urlWithParams = `${URL}?${queryParams}`;
  const { data, isLoading, error, isValidating } = useSWR(urlWithParams, fetcher);

  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetProductParents() {
  const URL = endpoints.product.parent;
  // const queryParams = `filter[limit]=${lmt}`;
  // const urlWithParams = `${URL}?${queryParams}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      parents: data || [],
      parentsLoading: isLoading,
      parentsError: error,
      parentsValidating: isValidating,
      parentsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(products, debouncedQuery) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      setLoading(false);
    } else {
      const filteredResults = products.filter((product) =>
        product.productName.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
      setLoading(false);
    }
  }, [products, debouncedQuery]);

  return { searchResults, searchLoading };
}

// export function useSearchProducts(query) {
//   const URL = query ? [endpoints.product.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: data || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.length,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
// import useSWR from 'swr';
// import { useMemo } from 'react';
// // utils
// import { fetcher, endpoints } from 'src/utils/axios';

// // ----------------------------------------------------------------------

// export function useGetProducts() {
//   const URL = endpoints.product.list;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       products: data?.products || [],
//       productsLoading: isLoading,
//       productsError: error,
//       productsValidating: isValidating,
//       productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.products, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// export function useGetProduct(productId) {
//   const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
