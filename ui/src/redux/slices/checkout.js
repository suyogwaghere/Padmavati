import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';

// ----------------------------------------------------------------------

const initialState = {
  activeStep: 0,
  partyId: '',
  adminNote: '',
  cart: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

const slice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    getPartyId(state, action) {
      const id = action.payload;
      state.partyId = id;
    },
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));

      const subTotal = sum(cart.map((product) => product.sellPrice * product.quantity));

      state.cart = cart;
      state.discount = state.discount || 0;
      state.shipping = state.shipping || 0;
      state.billing = state.billing || null;
      state.subTotal = subTotal;
      state.total = subTotal - state.discount;
      state.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;

      const cartEmpty = !state.cart.length;

      if (cartEmpty) {
        state.cart = [...state.cart, newProduct];
      } else {
        state.cart = state.cart.map((product) => {
          const existProduct = product.id === newProduct.id;

          if (existProduct) {
            return {
              ...product,
              // colors: uniq([...product.colors, ...newProduct.colors]),
              quantity: product.quantity + 1,
            };
          }

          return product;
        });
      }

      state.cart = uniqBy([...state.cart, newProduct], 'id');
      state.totalItems = sum(state.cart.map((product) => product.quantity));
    },
    updateCartItemNote(state, action) {
      const data = action.payload;
      const { notes, disc } = data;

      console.log('🚀 ~ file: checkout.js:74 ~ updateCartItemNote ~ disc:', disc);

      console.log('🚀 ~ file: checkout.js:74 ~ updateCartItemNote ~ notes:', notes);

      state.cart = state.cart.map((product) =>
        product.productId === data.productId ? { ...product, notes, discount: disc } : product
      );
      console.log('🚀Updated added: ', state.cart);
    },
    updateAdminNote(state, action) {
      const data = action.payload;
      state.adminNote = data;
      console.log('🚀admin note added: ', data);
    },

    deleteCart(state, action) {
      const updateCart = state.cart.filter((product) => product.id !== action.payload);

      if (updateCart.length === 0) {
        console.log('cart empty');
        state.totalItems = 0;
        state.subTotal = 0;
        state.total = 0;
      }

      state.cart = updateCart;
    },

    resetCart(state) {
      state.cart = [];
      state.billing = null;
      // state.partyId = '';
      state.activeStep = 0;
      state.total = 0;
      state.subTotal = 0;
      state.discount = 0;
      state.shipping = 0;
      state.totalItems = 0;
    },

    backStep(state) {
      state.activeStep -= 1;
    },

    nextStep(state) {
      state.activeStep += 1;
    },

    gotoStep(state, action) {
      state.activeStep = action.payload;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.cart = updateCart;
    },

    createBilling(state, action) {
      state.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;

      state.discount = discount;
      state.total = state.subTotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;

      state.shipping = shipping;
      state.total = state.subTotal - state.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  updateCartItemNote,
  getPartyId,
  updateAdminNote,
  adminNote,
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;
