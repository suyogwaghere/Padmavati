import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import checkoutReducer from './slices/checkout';
// import productsReducer from './slices/productsSlice'; // Import your products slice reducer

// ----------------------------------------------------------------------

const checkoutPersistConfig = {
  key: 'checkout',
  storage,
  keyPrefix: 'redux-',
};
// const productsPersistConfig = {
//   key: 'products',
//   storage,
//   keyPrefix: 'redux-',
// };
export const rootReducer = combineReducers({
  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
  // products: persistReducer(productsPersistConfig, productsReducer),
});
// export const pReducer = combineReducers({
//   // checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
//   products: persistReducer(productsPersistConfig, productsReducer),
// });
