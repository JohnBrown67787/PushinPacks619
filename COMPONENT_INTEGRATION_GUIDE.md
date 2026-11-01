# Component Integration Guide - Phase 3

**Version**: 1.0  
**Date**: November 1, 2026  
**Purpose**: Guide for integrating new UI components and forms into existing pages

---

## 🎯 Integration Overview

This guide shows how to integrate the new UI component library and form validation system into existing pages and forms.

### What's Now Available
- 6 UI components (Button, Input, Card, Badge, Modal, Tooltip)
- Form validation system (useForm hook)
- 2 Example integrated components (ContactForm, ProductCard)
- 35+ utility functions

---

## 📋 Integration Checklist

### Phase 3a: Forms & Validation (This Phase)
- [ ] Replace form inputs with `<Input>` component
- [ ] Replace form buttons with `<Button>` component
- [ ] Replace `useState` form logic with `useForm` hook
- [ ] Add validation with VALIDATORS
- [ ] Test form submission

### Phase 3b: Product & Card Layouts (Next Phase)
- [ ] Replace product cards with `<ProductCard>` component
- [ ] Use `<Card>` for content containers
- [ ] Use `<Badge>` for status/tags
- [ ] Update grid layouts

### Phase 3c: Dialogs & Overlays (Following Phase)
- [ ] Replace modal implementations with `<Modal>`
- [ ] Add confirmation dialogs
- [ ] Implement success/error modals

---

## 🔄 Common Integration Patterns

### Pattern 1: Simple Form to useForm Hook

**Before**:
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  // Manual validation...
  // Manual API call...
};
```

**After**:
```javascript
import { useForm, VALIDATORS } from '../hooks/useForm';
import { Input, Button } from '../components/ui';

const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
  { email: '', password: '' },
  async (data) => {
    // API call
  },
  {
    email: VALIDATORS.email,
    password: VALIDATORS.minLength(8)
  }
);
```

### Pattern 2: Styled Buttons to Button Component

**Before**:
```javascript
<button style={{
  padding: '10px 20px',
  background: '#22c55e',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
}}>
  Click Me
</button>
```

**After**:
```javascript
import { Button } from '../components/ui';

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Pattern 3: Simple Input to Input Component with Validation

**Before**:
```javascript
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
{emailError && <span className="error">{emailError}</span>}
```

**After**:
```javascript
import { Input } from '../components/ui';

<Input
  label="Email"
  type="email"
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.email ? errors.email : ''}
  hint="We'll never share your email"
/>
```

---

## 🔧 Example: Converting a Form

### Step 1: Identify Form Fields

List all form fields and their validation needs:
```
- Name: required
- Email: required, must be valid email
- Phone: required, must be valid phone
- Message: required, min 10 characters
```

### Step 2: Set Up useForm Hook

```javascript
import { useForm, VALIDATORS, combineValidators } from '../hooks/useForm';

const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
  {
    name: '',
    email: '',
    phone: '',
    message: ''
  },
  async (formData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    // Handle response
  },
  {
    name: VALIDATORS.required,
    email: VALIDATORS.email,
    phone: combineValidators(
      VALIDATORS.required,
      VALIDATORS.phone
    ),
    message: combineValidators(
      VALIDATORS.required,
      VALIDATORS.minLength(10)
    )
  }
);
```

### Step 3: Replace Form Elements

```javascript
import { Input, Button, Card } from '../components/ui';

<Card variant="elevated">
  <h2>Contact Us</h2>
  
  <form onSubmit={handleSubmit}>
    <Input
      label="Name"
      name="name"
      value={values.name}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.name ? errors.name : ''}
      required
    />
    
    <Input
      label="Email"
      type="email"
      name="email"
      value={values.email}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.email ? errors.email : ''}
      required
    />
    
    <Input
      label="Phone"
      type="tel"
      name="phone"
      value={values.phone}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.phone ? errors.phone : ''}
      required
    />
    
    <Button
      type="submit"
      variant="primary"
      loading={isSubmitting}
      disabled={isSubmitting}
    >
      Send Message
    </Button>
  </form>
</Card>
```

---

## 📦 Component Integration Examples

### Example 1: Using ContactForm Component

```javascript
import ContactForm from '../components/ContactForm';

export default function InquiryPage() {
  return (
    <div>
      <h1>Send us an Inquiry</h1>
      <ContactForm
        title="Product Inquiry"
        subtitle="Tell us what you're looking for"
        onSuccess={(data) => console.log('Sent:', data)}
        onError={(error) => console.error('Failed:', error)}
        fields={['name', 'email', 'phone', 'message']}
      />
    </div>
  );
}
```

### Example 2: Using ProductCard Component

```javascript
import ProductCard from '../components/ProductCard';

export default function ProductGrid() {
  const [favorites, setFavorites] = useState([]);

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          isFavorite={favorites.includes(product.id)}
          onAddToCart={(product) => {
            // Add to cart logic
          }}
          onToggleFavorite={(id) => {
            setFavorites(prev =>
              prev.includes(id)
                ? prev.filter(fav => fav !== id)
                : [...prev, id]
            );
          }}
        />
      ))}
    </div>
  );
}
```

### Example 3: Using Modal for Confirmation

```javascript
import { Modal, Button } from '../components/ui';

export default function DeleteConfirm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Delete
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  );
}
```

---

## 🔗 Pages Ready for Integration

### High Priority (Next Immediate)
1. **Checkout Page** (`src/app/checkout/page.js`)
   - Replace form inputs with `<Input>`
   - Use `useForm` for order form
   - Replace buttons with `<Button>`

2. **Contact/FAQ Pages**
   - Use `<ContactForm>` component
   - Or build custom with `useForm` hook

3. **Product Grid/Catalog**
   - Use `<ProductCard>` component
   - Build grid with integrated cards

### Medium Priority
4. Admin pages
5. User profile pages
6. Settings/preferences pages

### Lower Priority
7. Landing pages (if forms exist)
8. Help/documentation pages

---

## 🛠️ Integration Tips

### Tip 1: Keep Validation Messages Clear
```javascript
{
  name: VALIDATORS.required, // ✅ Good
  email: VALIDATORS.email,
  // Instead of custom error messages,
  // use the built-in ones for consistency
}
```

### Tip 2: Use Proper Field Names
```javascript
// Field names should match your API
{
  fullName: '',      // ✅ Good
  emailAddress: '',  // ✅ Good
  fname: '',         // ❌ Not descriptive
}
```

### Tip 3: Group Related Validations
```javascript
// Combine validators for complex rules
const passwordValidator = combineValidators(
  VALIDATORS.required,
  VALIDATORS.minLength(8),
  VALIDATORS.custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return 'Must contain uppercase letter';
    }
    return '';
  })
);
```

### Tip 4: Handle Loading States
```javascript
<Button
  type="submit"
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Sending...' : 'Send'}
</Button>
```

### Tip 5: Show Success/Error Feedback
```javascript
const [status, setStatus] = useState(null);

const onSuccess = (data) => {
  setStatus({ type: 'success', message: 'Sent!' });
};

const onError = (error) => {
  setStatus({ type: 'error', message: error.message });
};

{status && (
  <div className={`message ${status.type}`}>
    {status.message}
  </div>
)}
```

---

## 🧪 Testing After Integration

### Functionality Tests
- [ ] Form submits correctly
- [ ] Validation works (try invalid inputs)
- [ ] Success message displays
- [ ] Error message displays
- [ ] Loading state shows
- [ ] Form resets after success

### Responsive Tests
- [ ] Mobile layout looks good
- [ ] Tablet layout looks good
- [ ] Desktop layout looks good
- [ ] Touch targets are 44x44px minimum
- [ ] No horizontal scroll

### Accessibility Tests
- [ ] Can tab through fields
- [ ] Labels associated with inputs
- [ ] Error messages announced
- [ ] Focus indicators visible
- [ ] Works with keyboard only

---

## 📊 Migration Progress Template

Use this to track integration progress:

```markdown
## Integration Progress

### Checkout Page
- [ ] Replace input elements
- [ ] Implement useForm hook
- [ ] Add validation
- [ ] Test form submission
- [ ] Mobile testing
- Status: In Progress / Complete

### Contact Form  
- [ ] Use ContactForm component
- [ ] Or build with useForm hook
- [ ] Test validation
- [ ] Test submission
- Status: Not Started / In Progress / Complete

### Product Grid
- [ ] Use ProductCard component
- [ ] Implement add-to-cart
- [ ] Test responsive
- Status: Not Started / In Progress / Complete
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module 'useForm'"
**Solution**: Make sure to import from correct path:
```javascript
import { useForm, VALIDATORS } from '../hooks/useForm';
```

### Issue: Form doesn't validate on blur
**Solution**: Make sure to call `onBlur`:
```javascript
<Input
  onBlur={handleBlur}  // ← Don't forget this
  // ...
/>
```

### Issue: Button never shows as disabled
**Solution**: Pass both `loading` and `disabled`:
```javascript
<Button
  loading={isSubmitting}
  disabled={isSubmitting}  // ← Important
>
  Submit
</Button>
```

### Issue: Modal scrolls with body
**Solution**: Modal component handles this automatically, just use:
```javascript
<Modal isOpen={open} onClose={handleClose}>
  {/* Content scrolls inside modal, not body */}
</Modal>
```

---

## 📚 Related Documentation

- `UI_COMPONENT_LIBRARY.md` - Full component reference
- `DEVELOPER_GUIDE.md` - General patterns and utilities
- `PHASE_2_COMPLETION.md` - What components are available

---

## 🚀 Next Phase

After integrating components into main forms:

1. Create additional specialized forms (Newsletter, Support, etc.)
2. Build comprehensive product grid with filtering
3. Implement admin forms with validation
4. Add modal-based workflows
5. Create reusable form templates

---

**Guide Version**: 1.0  
**Last Updated**: November 1, 2026  
**Status**: Ready for Integration  

For questions, refer to the component library documentation or the example components (ContactForm, ProductCard).
