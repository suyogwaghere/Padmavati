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
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/me',
    login: '/login',
    register: '/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  ledger: {
    list: '/api/ledgers/list',
    details: '/api/ledger/details',
    search: '/api/ledger/search',
    sync: '/api/ledgers/sync',
  },
  product: {
    list: '/api/products/list',
    details: '/api/product/details',
    search: '/api/product/search',
    sync: '/api/products/sync',
  },
  category: {
    list: '/api/category/list',
    details: (id) => `/api/categories/${id}`,
    search: '/api/category/search',
  },
  brand: {
    list: '/api/brands/list',
    details: (id) => `/api/brands/${id}`,
    search: '/api/brands/search',
  },
  user: {
    list: '/api/users/list',
    details: (id) => `/api/users/${id}`,
    search: '/api/user/search',
  },
  voucher: {
    list: '/api/vouchers/list',
    details: (id) => `/api/vouchers/${id}`,
    search: '/api/vouchers/search',
  },
};
