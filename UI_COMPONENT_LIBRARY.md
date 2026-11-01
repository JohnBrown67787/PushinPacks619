# UI Component Library - Complete Reference

**Version**: 1.0  
**Location**: `src/components/ui/`  
**Export**: All components available from `src/components/ui`  

---

## 📚 Components Overview

| Component | Purpose | Use Cases |
|-----------|---------|-----------|
| Button | Interactive action button | Forms, navigation, CTAs |
| Input | Text/form input field | Login, search, forms |
| Card | Container for content | Product cards, layouts |
| Badge | Small label/status indicator | Tags, counts, status |
| Modal | Dialog/overlay window | Confirmations, forms |
| Tooltip | Information popup | Help text, hints |

---

## 🔘 Button Component

### Basic Usage
```javascript
import { Button } from '../components/ui';

<Button>Click Me</Button>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Button text/content |
| `variant` | string | 'primary' | 'primary' \| 'secondary' \| 'danger' \| 'ghost' |
| `size` | string | 'md' | 'sm' \| 'md' \| 'lg' |
| `loading` | boolean | false | Show loading state |
| `disabled` | boolean | false | Disable button |
| `onClick` | function | - | Click handler |
| `type` | string | 'button' | HTML button type |

### Examples
```javascript
// Primary action
<Button variant="primary" onClick={() => handleSubmit()}>
  Submit
</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Danger action
<Button variant="danger" size="sm">Delete</Button>

// Loading state
<Button loading>Processing...</Button>

// Ghost style
<Button variant="ghost">Learn More</Button>
```

### Styling
- **Primary**: Green background, hover effect
- **Secondary**: Transparent with border
- **Danger**: Red background
- **Ghost**: Minimal styling

---

## 📝 Input Component

### Basic Usage
```javascript
import { Input } from '../components/ui';

<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'text' | HTML input type |
| `placeholder` | string | - | Placeholder text |
| `value` | string | - | Input value |
| `onChange` | function | - | Change handler |
| `onBlur` | function | - | Blur handler |
| `size` | string | 'md' | 'sm' \| 'md' \| 'lg' |
| `label` | string | - | Label text |
| `error` | string | - | Error message |
| `hint` | string | - | Helper text |
| `disabled` | boolean | false | Disable input |
| `required` | boolean | false | Mark as required |

### Examples
```javascript
// Basic input
<Input
  type="text"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// With label and validation
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  value={email}
  onChange={handleEmailChange}
  onBlur={handleEmailBlur}
/>

// With hint
<Input
  label="Password"
  type="password"
  hint="At least 8 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Different sizes
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

---

## 🎴 Card Component

### Basic Usage
```javascript
import { Card } from '../components/ui';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Card content |
| `variant` | string | 'default' | 'default' \| 'elevated' \| 'outlined' |
| `hoverable` | boolean | false | Add hover effect |
| `clickable` | boolean | false | Show pointer on hover |
| `onClick` | function | - | Click handler |

### Examples
```javascript
// Basic card
<Card>Content here</Card>

// Elevated card
<Card variant="elevated">
  Elevated content
</Card>

// Clickable card
<Card hoverable clickable onClick={() => navigate('/product')}>
  <img src="product.jpg" />
  <h3>Product Name</h3>
</Card>

// Outlined card
<Card variant="outlined">
  Minimal styling
</Card>
```

---

## 🏷️ Badge Component

### Basic Usage
```javascript
import { Badge } from '../components/ui';

<Badge>New</Badge>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Badge text |
| `variant` | string | 'primary' | 'primary' \| 'success' \| 'warning' \| 'error' \| 'info' |
| `size` | string | 'md' | 'sm' \| 'md' \| 'lg' |

### Examples
```javascript
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// In product card
<Card>
  <Badge variant="success">In Stock</Badge>
  <h3>Product</h3>
</Card>
```

---

## 🪟 Modal Component

### Basic Usage
```javascript
import { Modal } from '../components/ui';
import { Button } from '../components/ui';

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="md"
      >
        <p>Are you sure?</p>
      </Modal>
    </>
  );
}
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Control visibility |
| `onClose` | function | required | Close handler |
| `title` | string | - | Modal title |
| `children` | ReactNode | required | Modal content |
| `size` | string | 'md' | 'sm' \| 'md' \| 'lg' |
| `footer` | ReactNode | - | Footer buttons |
| `closeOnEscape` | boolean | true | Close on Escape key |
| `closeOnBackdrop` | boolean | true | Close on backdrop click |

### Examples
```javascript
// Confirmation modal
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Delete Item"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>This action cannot be undone. Are you sure?</p>
</Modal>

// Form modal
<Modal
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  title="Add New Product"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <Input label="Name" />
    <Input label="Price" type="number" />
  </form>
</Modal>
```

---

## 💬 Tooltip Component

### Basic Usage
```javascript
import { Tooltip } from '../components/ui';

<Tooltip content="Help text">
  <button>?</button>
</Tooltip>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | string | required | Tooltip text |
| `children` | ReactNode | required | Trigger element |
| `position` | string | 'top' | 'top' \| 'bottom' \| 'left' \| 'right' |
| `delay` | number | 200 | Delay in ms before showing |

### Examples
```javascript
// Basic tooltip
<Tooltip content="Save changes">
  <Button>Save</Button>
</Tooltip>

// Different positions
<Tooltip content="Help" position="top">
  <IconInfo />
</Tooltip>

<Tooltip content="More options" position="right">
  <IconMenu />
</Tooltip>

// Custom delay
<Tooltip content="Click to delete" delay={100}>
  <Button variant="danger">Delete</Button>
</Tooltip>
```

---

## 🎨 Form Validation Hook

### useForm Hook

**Location**: `src/hooks/useForm.js`

```javascript
import { useForm, VALIDATORS, combineValidators } from '../hooks/useForm';

export default function LoginForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    async (formData) => {
      // Submit logic here
      console.log('Submitting:', formData);
    },
    {
      email: VALIDATORS.email,
      password: combineValidators(
        VALIDATORS.required,
        VALIDATORS.minLength(8)
      ),
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ''}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : ''}
      />

      <Button type="submit">Login</Button>
    </form>
  );
}
```

### Available Validators
```javascript
import { VALIDATORS, combineValidators } from '../hooks/useForm';

// Single validators
VALIDATORS.required(value)
VALIDATORS.email(value)
VALIDATORS.phone(value)
VALIDATORS.postalCode(value)

// Parametrized validators
VALIDATORS.minLength(8)(value)
VALIDATORS.maxLength(100)(value)
VALIDATORS.match(otherValue, 'Password')(value)

// Custom validator
VALIDATORS.custom((value) => {
  if (!value.includes('@')) return 'Must include @';
  return '';
})

// Combine validators
combineValidators(
  VALIDATORS.required,
  VALIDATORS.email,
  VALIDATORS.custom(customCheck)
)
```

---

## 📦 Importing Components

### Single Import
```javascript
import { Button } from '../components/ui';
```

### Multiple Imports
```javascript
import { Button, Input, Card, Badge, Modal } from '../components/ui';
```

### Full Library Import
```javascript
import * as UI from '../components/ui';

<UI.Button>Click Me</UI.Button>
<UI.Input />
<UI.Card>Content</UI.Card>
```

---

## 🎨 Theming & Customization

All components use CSS variables from `globals.css`:

```css
--color-brand-green
--color-bg-primary
--color-border-default
--color-text-primary
--text-base
--space-md
--radius-button
/* ... and more */
```

To customize globally, modify `src/app/globals.css`.

To customize per component, pass `className`:
```javascript
<Button className="custom-class">Click</Button>
```

---

## ♿ Accessibility Features

- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast compliance (WCAG AA)
- ✅ Screen reader friendly
- ✅ Error announcements
- ✅ Semantic HTML

---

## 📱 Responsive Design

All components are mobile-responsive:

- **Desktop**: Full features and sizes
- **Tablet** (< 768px): Adjusted sizing and spacing
- **Mobile** (< 640px): Optimized for touch, larger targets (44x44px minimum)

---

## 🚀 Best Practices

1. **Always provide labels** for inputs
2. **Use semantic HTML** (button vs link)
3. **Keyboard navigation** - all components support it
4. **Error messages** - be specific and helpful
5. **Loading states** - always show feedback
6. **Accessibility** - test with screen readers

---

## 🐛 Common Issues & Solutions

### Issue: Input not showing error
**Solution**: Pass error to the error prop and show it when `touched[fieldName]` is true

### Issue: Modal not closing
**Solution**: Ensure `closeOnEscape` and `closeOnBackdrop` are not both false

### Issue: Button text getting cut off
**Solution**: Increase size prop or use `whitespace: nowrap`

### Issue: Tooltip position off
**Solution**: Ensure tooltip is not inside a `position: relative` container that would affect positioning

---

## 📚 Examples

Check example usage in existing components:
- ProductCard - Uses Card, Badge
- LoginForm - Uses Input, Button, useForm
- ConfirmDialog - Uses Modal, Button
- ProductGrid - Uses Card, Tooltip

---

## 🔄 Updates & Maintenance

### Adding New Component
1. Create component in `src/components/ui/`
2. Create `.module.css` for styling
3. Add to `src/components/ui/index.js`
4. Update this documentation

### Modifying Components
- Keep API stable
- Add deprecation notices for breaking changes
- Update documentation

---

**Last Updated**: November 1, 2026  
**Version**: 1.0  
**Stability**: Stable

---

See `DEVELOPER_GUIDE.md` for more examples and patterns.
