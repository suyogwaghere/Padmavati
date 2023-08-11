import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/me',
    login: '/login',
    register: '/register',
  },
  ledger: {
    list: '/api/ledgers/list',
    details: '/api/ledger/details',
    search: '/api/ledger/search',
    sync: '/api/ledgers/sync',
  },
  product: {
    list: '/api/products/list',
    parent: '/api/products/parent/list',
    details: '/api/product/details',
    search: '/api/products/search',
    sync: '/api/products/sync',
  },
  user: {
    list: '/api/users/list',
    details: (id) => `/api/users/${id}`,
    search: '/api/user/search',
  },
  voucher: {
    list: '/api/vouchers/list',
    user: '/api/vouchers/user/list',
    details: (id) => `/api/vouchers/${id}`,
    search: '/api/vouchers/search',
  },
};
