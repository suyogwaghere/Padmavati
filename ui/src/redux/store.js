import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from 'redux-persist';
import { rootReducer } from './root-reducer';
// import fetchProducts from './slices/fetchP';

// ----------------------------------------------------------------------

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export const useSelector = useAppSelector;

export const useDispatch = () => useAppDispatch();
