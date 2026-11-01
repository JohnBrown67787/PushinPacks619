// FORMAT UTILITIES

export function formatPrice(price) {
  const numPrice = typeof price === 'string'
    ? parseFloat(price.replace(/[^0-9.]/g, ''))
    : Number(price);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

export function parsePrice(priceString) {
  return parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
}

export function formatQuantity(quantity) {
  return quantity > 1 ? `${quantity}x` : '';
}

export function calculateDiscount(originalPrice, discountPercent) {
  const discount = originalPrice * discountPercent;
  return {
    amount: discount,
    percentage: (discountPercent * 100).toFixed(0),
    finalPrice: originalPrice - discount,
  };
}

export function getTotalPrice(cart) {
  return cart.reduce((total, item) => {
    const itemPrice = parsePrice(item.price || '0');
    return total + itemPrice * (item.qty || 1);
  }, 0);
}

// VALIDATION UTILITIES

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\+?[\d\s\-()]+$/.test(phone);
}

export function isValidPostalCode(code) {
  return /^[A-Z0-9]{3,10}$/i.test(code);
}

// STRING UTILITIES

export function truncate(text, length = 100) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim('-');
}

export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ARRAY UTILITIES

export function deduplicate(array, key = null) {
  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
}

export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

export function sortBy(array, key, descending = false) {
  const sorted = [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return descending ? 1 : -1;
    if (aVal > bVal) return descending ? -1 : 1;
    return 0;
  });

  return sorted;
}

// OBJECT UTILITIES

export function pick(object, keys) {
  return keys.reduce((result, key) => {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
}

export function omit(object, keys) {
  return Object.keys(object).reduce((result, key) => {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
    return result;
  }, {});
}

// DEBOUNCE & THROTTLE

export function debounce(callback, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

export function throttle(callback, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      callback(...args);
      lastCall = now;
    }
  };
}

// CLASS NAME UTILITIES

export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function conditionalClass(condition, trueClass, falseClass = '') {
  return condition ? trueClass : falseClass;
}

// LOCAL STORAGE UTILITIES

export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const value = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeLocalStorageSet(key, value) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch {
    return false;
  }
}

export function safeLocalStorageRemove(key) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}

// ASYNC UTILITIES

export async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}
