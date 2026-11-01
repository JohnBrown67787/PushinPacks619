# PushinPacks - Developer Guide

Complete guide to the new utilities, hooks, and patterns introduced in this audit.

---

## 🎣 Hooks

### usePersistedCart Hook

**Purpose**: Manage shopping cart with localStorage persistence

**Location**: `src/hooks/usePersistedCart.js`

**Usage**:
```javascript
import { usePersistedCart } from '../hooks/usePersistedCart';

export default function MyComponent() {
  const {
    cart,           // Array of cart items
    isLoading,      // Boolean - true while loading from localStorage
    addToCart,      // Function - add item to cart
    removeFromCart, // Function - remove item by ID
    updateQuantity, // Function - update item quantity by delta
    clearCart,      // Function - clear entire cart
    getTotalItems,  // Function - get total items count
    getTotalPrice,  // Function - get total price
  } = usePersistedCart();

  const handleAddProduct = (product) => {
    addToCart(product); // Automatically saves to localStorage
  };

  return (
    <div>
      <p>Items in cart: {getTotalItems()}</p>
      <p>Total: ${getTotalPrice().toFixed(2)}</p>
    </div>
  );
}
```

**Key Features**:
- Automatically loads from localStorage on mount
- Automatically saves to localStorage on change
- Prevents memory leaks
- Handles errors gracefully

---

### useAsyncData Hook

**Purpose**: Handle async data fetching with loading and error states

**Location**: `src/hooks/useAsyncData.js`

**Usage**:
```javascript
import { useAsyncData } from '../hooks/useAsyncData';

export default function ProductsComponent() {
  const { data, isLoading, error, retry } = useAsyncData(
    async () => {
      const response = await fetch('/api/products');
      return response.json();
    },
    [] // Dependencies array
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      Error: {error}
      <button onClick={retry}>Try Again</button>
    </div>
  );

  return <div>{/* Render data */}</div>;
}
```

**Key Features**:
- Handles loading state automatically
- Catches and displays errors
- Provides retry function
- Memory leak safe

---

## 🛠️ Utilities

All utilities are in `src/lib/utils.js`

### Formatting Functions

```javascript
import { formatPrice, parsePrice, truncate, capitalize } from '../lib/utils';

// formatPrice - Convert number to currency string
formatPrice(99.99);  // "$99.99"
formatPrice("99.99"); // "$99.99"

// parsePrice - Extract number from price string
parsePrice("$99.99"); // 99.99

// truncate - Shorten text with ellipsis
truncate("Long text here", 10); // "Long text..."

// capitalize - Capitalize first letter
capitalize("hello"); // "Hello"
```

### Validation Functions

```javascript
import { 
  isValidEmail, 
  isValidPhone, 
  isValidPostalCode 
} from '../lib/utils';

isValidEmail("user@example.com");    // true
isValidPhone("+1 (555) 123-4567");  // true
isValidPostalCode("90210");          // true
```

### Array Functions

```javascript
import { deduplicate, groupBy, sortBy } from '../lib/utils';

// deduplicate - Remove duplicate values
deduplicate([1, 2, 2, 3]);           // [1, 2, 3]
deduplicate(products, 'id');         // Remove by object key

// groupBy - Group items by key
groupBy(products, 'category');       // { "cat1": [...], "cat2": [...] }

// sortBy - Sort array by key
sortBy(products, 'price');           // Ascending
sortBy(products, 'price', true);     // Descending
```

### Performance Functions

```javascript
import { debounce, throttle } from '../lib/utils';

// debounce - Execute after delay (for search, resize, etc.)
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300); // Execute 300ms after last call

// throttle - Execute at most once per interval (for scroll, resize)
const handleScroll = throttle(() => {
  checkLoadMore();
}, 1000); // Execute at most once per second
```

### Storage Functions

```javascript
import { 
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove
} from '../lib/utils';

// Safe wrappers - don't throw errors
safeLocalStorageSet('key', { data: 'value' });      // true/false
const data = safeLocalStorageGet('key', {});        // Returns default if error
safeLocalStorageRemove('key');                      // true/false
```

### Calculation Functions

```javascript
import { calculateDiscount, getTotalPrice } from '../lib/utils';

// calculateDiscount - Calculate discount amount
calculateDiscount(100, 0.20);  // { amount: 20, percentage: 20, finalPrice: 80 }

// getTotalPrice - Sum cart prices
getTotalPrice(cartItems);      // 299.99
```

---

## 📋 Constants

All constants are in `src/lib/constants.js`

```javascript
import {
  CART_STORAGE_KEY,
  CART_NOTIFICATION_DURATION,
  DISCOUNT_TIERS,
  SUBSCRIBE_DISCOUNT,
  BREAKPOINTS,
  ITEMS_PER_PAGE,
  ANIMATION_DURATION,
  VALIDATION_MESSAGES,
  API_ENDPOINTS,
  PURCHASE_MODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../lib/constants';

// Use instead of magic strings
localStorage.setItem(CART_STORAGE_KEY, data);

// Check breakpoints
if (window.innerWidth < BREAKPOINTS.tablet) {
  // Mobile layout
}

// Use consistent messages
showNotification(SUCCESS_MESSAGES.addedToCart('Item', 2));
// "Added 2x Item to cart"

// Pricing tiers
if (quantity >= DISCOUNT_TIERS.five.minQty) {
  price *= (1 - DISCOUNT_TIERS.five.discount); // 20% off
}
```

---

## 🔥 Components

### ErrorBoundary

**Location**: `src/components/ErrorBoundary.js`

**Purpose**: Catch React errors and display fallback UI

**Usage**:
```javascript
import ErrorBoundary from '../components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Features**:
- Catches component errors
- Shows user-friendly message
- Shows error details in development
- Provides reload button

---

### LoadingSkeletons

**Location**: `src/components/LoadingSkeletons.js`

**Purpose**: Show placeholder loading states

**Usage**:
```javascript
import { 
  ProductCardSkeleton, 
  ProductGridSkeleton,
  TextSkeleton,
  ImageSkeleton 
} from '../components/LoadingSkeletons';

// Single skeleton
<ProductCardSkeleton />

// Grid of skeletons
<ProductGridSkeleton count={6} />

// Text skeleton
<TextSkeleton width="100%" height="16px" />

// Image skeleton
<ImageSkeleton width="100%" height="300px" />
```

---

## 🔄 Patterns

### Pattern 1: Form Validation

```javascript
import { isValidEmail, VALIDATION_MESSAGES } from '../lib/utils';

function EmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (!value) {
      setError(VALIDATION_MESSAGES.required);
    } else if (!isValidEmail(value)) {
      setError(VALIDATION_MESSAGES.email);
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input value={email} onChange={handleChange} />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
}
```

### Pattern 2: Async Data with Loading

```javascript
import { useAsyncData } from '../hooks/useAsyncData';
import { ProductGridSkeleton } from '../components/LoadingSkeletons';
import ErrorBoundary from '../components/ErrorBoundary';

function ProductList() {
  const { data: products, isLoading, error } = useAsyncData(
    async () => {
      const res = await fetch('/api/products');
      return res.json();
    },
    []
  );

  return (
    <ErrorBoundary>
      {isLoading && <ProductGridSkeleton />}
      {error && <div>Error loading products</div>}
      {products && (
        <div>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </ErrorBoundary>
  );
}
```

### Pattern 3: Debounced Search

```javascript
import { debounce } from '../lib/utils';

function SearchProducts() {
  const [results, setResults] = useState([]);

  const handleSearch = debounce(async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  }, 300);

  return (
    <input 
      placeholder="Search..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

### Pattern 4: Conditional Styling

```javascript
import { classNames, conditionalClass } from '../lib/utils';

function Button({ isLoading, isDisabled }) {
  return (
    <button
      className={classNames(
        'btn',
        'btn-primary',
        conditionalClass(isLoading, 'btn-loading'),
        conditionalClass(isDisabled, 'btn-disabled')
      )}
    >
      {isLoading ? 'Loading...' : 'Click me'}
    </button>
  );
}
```

---

## ✅ Best Practices

### 1. Always use constants instead of magic strings
```javascript
// ❌ Bad
localStorage.setItem('pushinpacks_cart', JSON.stringify(cart));

// ✅ Good
import { CART_STORAGE_KEY } from '../lib/constants';
localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
```

### 2. Use utility functions for common operations
```javascript
// ❌ Bad
const price = parseFloat(priceString.replace('$', '').replace(',', ''));

// ✅ Good
import { parsePrice } from '../lib/utils';
const price = parsePrice(priceString);
```

### 3. Wrap async operations with error handling
```javascript
// ❌ Bad
const data = await fetch(url).then(r => r.json());

// ✅ Good
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
} catch (error) {
  console.error('Fetch error:', error);
}
```

### 4. Use hooks for stateful logic
```javascript
// ❌ Bad - Manual localStorage management
useEffect(() => {
  const saved = localStorage.getItem('cart');
  if (saved) setCart(JSON.parse(saved));
}, []);

// ✅ Good - Use hook
const { cart } = usePersistedCart();
```

### 5. Use ErrorBoundary for error protection
```javascript
// ❌ Bad - Errors crash the app
export default App;

// ✅ Good - Wrap in ErrorBoundary
export default () => <ErrorBoundary><App /></ErrorBoundary>;
```

---

## 🚀 Performance Tips

1. **Use debounce for search/filters**
2. **Use throttle for scroll/resize listeners**
3. **Use React.memo for expensive components**
4. **Use LoadingSkeletons for perceived performance**
5. **Lazy load images and components**

---

## 📚 Further Learning

- Read `WEBSITE_AUDIT_PLAN.md` for full audit details
- Read `AUDIT_PROGRESS_REPORT.md` for progress tracking
- Review components in `src/components/` for patterns
- Check `src/hooks/` for state management examples

---

**Last Updated**: November 1, 2026  
**Version**: 1.0  
**Created by**: Claude AI (Educational Project)
