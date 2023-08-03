const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    ledger: {
      root: `${ROOTS.DASHBOARD}/ledger`,
      new: `${ROOTS.DASHBOARD}/brand/ledger`,
      edit: (id) => `${ROOTS.DASHBOARD}/ledger/${id}/edit`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      checkout: `${ROOTS.DASHBOARD}/product/checkout`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    },
    voucher: {
      root: `${ROOTS.DASHBOARD}/voucher`,
      new: `${ROOTS.DASHBOARD}/voucher/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/voucher/${id}`,
    },
  },
};
