// CART CONSTANTS
export const CART_STORAGE_KEY = 'pushinpacks_cart';
export const CART_NOTIFICATION_DURATION = 2800; // ms
export const CART_CHECKOUT_NOTIFICATION_DURATION = 3000; // ms

// PRICING
export const DISCOUNT_TIERS = {
  three: { minQty: 3, discount: 0.10 }, // 10% off
  five: { minQty: 5, discount: 0.20 }, // 20% off
};

export const SUBSCRIBE_DISCOUNT = 0.85; // 15% off regular price

// RESPONSIVE BREAKPOINTS
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 640,
  desktop: 768,
  wide: 900,
  ultraWide: 1024,
};

// PAGINATION
export const ITEMS_PER_PAGE = 12;
export const FEATURED_ITEMS_COUNT = 2;

// ANIMATIONS
export const ANIMATION_DURATION = {
  fast: 200, // ms
  normal: 350, // ms
  slow: 500, // ms
};

// FORM VALIDATION
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
};

// PRODUCT CATEGORIES
export const PRODUCT_CATEGORIES = {
  all: 'All',
};

// API ENDPOINTS
export const API_ENDPOINTS = {
  config: '/api/config',
  inquiries: '/api/inquiries',
  orders: '/api/orders',
};

// PURCHASE MODES
export const PURCHASE_MODES = {
  onetime: 'onetime',
  subscribe: 'subscribe',
};

// TAB NAMES
export const TABS = {
  overview: 'overview',
  lab: 'lab',
  reconstitution: 'reconstitution',
  shipping: 'shipping',
};

// ERROR MESSAGES
export const ERROR_MESSAGES = {
  loadingFailed: 'Failed to load content. Please try again.',
  cartEmpty: 'Your cart is empty',
  productNotFound: 'Product not found',
  checkoutFailed: 'Checkout failed. Please try again.',
  serverError: 'Server error. Please try again later.',
};

// SUCCESS MESSAGES
export const SUCCESS_MESSAGES = {
  addedToCart: (name, qty) => `Added ${qty}x ${name} to cart`,
  removedFromCart: 'Removed from cart',
  quantityUpdated: 'Quantity updated',
  checkoutSuccess: 'Order placed successfully!',
};

export const FEATURED_ITEMS_LIMIT = 6;
export const SEARCH_DEBOUNCE_MS = 300;
