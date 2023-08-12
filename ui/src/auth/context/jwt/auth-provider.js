import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
// redux
import { useDispatch } from 'react-redux';
import { getPartyId } from 'src/redux/slices/checkout';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const REMEMBER_ME = 'rememberMe';
const STORAGE_KEY = 'accessToken';
const ROLE_KEY = 'userRole';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dis = useDispatch();

  const initialize = useCallback(async () => {
    try {
      const rememberMe = sessionStorage.getItem(REMEMBER_ME);
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      const userRole = sessionStorage.getItem(ROLE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, rememberMe);
        const response = await axios.get(endpoints.auth.me);

        const user = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password, rememberMe) => {
    const data = {
      email,
      password,
      rememberMe,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user } = response.data;

    // const partyId = currentUser?.name;
    const partyId = user.ledgerId;

    console.log('🚀 ~ file: auth-provider.js:120 ~ login ~ partyId:', partyId);

    const newPartyId = {
      partyId,
    };
    try {
      dis(getPartyId(newPartyId));
    } catch (error) {
      console.error(error);
    }

    const hasAdminPermission = user.permissions[0];
    if (!hasAdminPermission) {
      throw new Error('You do not have admin permission.');
    }
    setSession(accessToken, rememberMe);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
