import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PersistGate } from 'redux-persist/lib/integration/react';
//
import { persistor, store } from './store';

// ----------------------------------------------------------------------

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

ReduxProvider.propTypes = {
  children: PropTypes.node,
};
