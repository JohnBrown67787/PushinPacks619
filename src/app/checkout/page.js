'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  IconWhatsApp,
  IconPayPal,
  IconVenmo,
  IconZelle,
  IconBitcoin,
  IconCashApp,
  IconCash,
  IconTruck,
  IconStore,
  IconAlertCircle,
  IconCopy,
  IconExternalLink,
  IconSpinner,
  IconCheck,
  IconTrash,
  IconArrowLeft,
  IconLock,
  IconShoppingCart
} from '@/components/Icons';
import styles from './checkout.module.css';

// Default initial sample cart if localStorage is empty, so users can test immediately
const DEFAULT_SAMPLE_ITEMS = [
  {
    id: 'pep-tirzepatide',
    name: 'Tirzepatide 10mg Lyophilized',
    price: 95.00,
    quantity: 1,
    image: '/images/products/peptides/pep-1.jpg',
    category: 'peptides'
  },
  {
    id: 'bud-live-resin-1g',
    name: 'Pushin Distillate Live Resin 1g',
    price: 45.00,
    quantity: 2,
    image: '/images/products/budcart/bud-1.jpg',
    category: 'budcart'
  }
];

export default function CheckoutPage() {
  // Store configuration loaded from backend API
  const [storeConfig, setStoreConfig] = useState(null);
  const currency = 'USD'; // Strictly USD

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Form states
  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryMethod: 'delivery', // 'delivery' or 'pickup'
    address: '',
    city: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('bitcoin');
  const [notes, setNotes] = useState('');

  // Validation & Submission states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Order confirmation modal state
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // 1. Fetch store configuration on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.success && data.config) {
          setStoreConfig(data.config);
          if (data.config.paymentMethods && data.config.paymentMethods.length > 0) {
            setPaymentMethod(data.config.paymentMethods[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load store config:', err);
      }
    }
    loadConfig();
  }, []);

  // 2. Load Cart from localStorage (syncs with portals)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pushinpacks_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
          setIsCartLoaded(true);
          return;
        }
      }
      // If no stored cart, initialize with standard preview sample
      setCartItems(DEFAULT_SAMPLE_ITEMS);
      setIsCartLoaded(true);
    } catch {
      setCartItems(DEFAULT_SAMPLE_ITEMS);
      setIsCartLoaded(true);
    }
  }, []);

  // Save cart changes back to localStorage
  const updateCart = (newItems) => {
    setCartItems(newItems);
    try {
      localStorage.setItem('pushinpacks_cart', JSON.stringify(newItems));
    } catch (err) {
      console.warn('Could not save cart to localStorage', err);
    }
  };

  // Cart quantity controls
  const handleQuantityChange = (productId, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === productId) {
        const nextQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    });
    updateCart(updated);
  };

  const handleRemoveItem = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    updateCart(updated);
  };

  const handleResetSampleCart = () => {
    updateCart(DEFAULT_SAMPLE_ITEMS);
  };

  // Currency Formatter (strictly USD)
  const formatMoney = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  // Live Calculations
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + (price * qty);
    }, 0);

    const deliveryFee = customer.deliveryMethod === 'delivery'
      ? (storeConfig?.deliveryFeeUsd !== undefined ? storeConfig.deliveryFeeUsd : 15.00)
      : 0;

    const discount = 0.00;
    const total = Math.max(0, subtotal + deliveryFee - discount);

    return {
      subtotal,
      deliveryFee,
      discount,
      total,
      itemCount: cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    };
  }, [cartItems, customer.deliveryMethod, storeConfig]);

  // Form input handler
  const handleInputChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!customer.fullName || customer.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required';
    }

    if (!customer.phone || customer.phone.trim().length < 6) {
      newErrors.phone = 'Valid phone number with country code is required';
    }

    if (customer.deliveryMethod === 'delivery') {
      if (!customer.address || customer.address.trim().length < 4) {
        newErrors.address = 'Street or delivery address is required for Home Delivery';
      }
      if (!customer.city || customer.city.trim().length < 2) {
        newErrors.city = 'City or town is required';
      }
    }

    if (cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty. Please add at least one product.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit order & open WhatsApp
  const handleCheckoutSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate clicks

    setSubmitError('');

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send order to backend API to validate prices and persist to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity || 1
          })),
          paymentMethod,
          notes,
          currency
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process checkout request');
      }

      // Order successfully created and saved in backend database
      setCompletedOrder({
        order: data.order,
        whatsAppUrl: data.whatsAppUrl
      });

      // Clear the local cart now that the order reference is recorded
      updateCart([]);

      // 2. Open WhatsApp official link in a new tab
      if (data.whatsAppUrl) {
        window.open(data.whatsAppUrl, '_blank', 'noopener,noreferrer');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setSubmitError(err.message || 'An unexpected error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy order reference to clipboard
  const handleCopyReference = (refCode) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(refCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // Configured payment method instructions
  const selectedPaymentInfo = useMemo(() => {
    if (!storeConfig?.paymentMethods) return null;
    return storeConfig.paymentMethods.find(m => m.id === paymentMethod) || null;
  }, [storeConfig, paymentMethod]);

  return (
    <div className={styles.checkoutPage}>
      {/* Top Navigation Bar */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.brandLink}>
            <span className={styles.brandBadge}>PUSHIN PACKS</span>
            <span className={styles.brandName}>Direct Desk</span>
          </Link>

          <div className={styles.headerMeta}>
            <div className={styles.secureNotice}>
              <IconLock width={15} height={15} />
              <span>SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb banner */}
      <div className={styles.topBanner}>
        <div>
          <h1 className={styles.pageTitle}>Express WhatsApp Checkout</h1>
        </div>
        <Link href="/" className={styles.backLink}>
          <IconArrowLeft width={16} height={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <main className={styles.container}>
        {/* Left Column: Sections 1 to 4 */}
        <div className={styles.formColumn}>
          {submitError && (
            <div className={styles.errorBanner} role="alert">
              <IconAlertCircle width={18} height={18} />
              <span>{submitError}</span>
            </div>
          )}

          {/* SECTION 1: Customer Information Form */}
          <section className={styles.sectionCard} aria-labelledby="sec-customer-info">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionStepNumber}>1</div>
              <div>
                <h2 id="sec-customer-info" className={styles.sectionTitle}>Customer Information</h2>
                <p className={styles.sectionSubtitle}>Enter your contact details so we can coordinate your order.</p>
              </div>
            </div>

            <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
              {/* Full Name */}
              <div className={styles.fieldGroup}>
                <label htmlFor="fullName" className={styles.fieldLabel}>
                  <span>Full Name <span className={styles.requiredMark}>*</span></span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`${styles.inputField} ${errors.fullName ? styles.inputFieldError : ''}`}
                  placeholder="e.g. Alexander Vance"
                  value={customer.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  autoComplete="name"
                  required
                />
                {errors.fullName && (
                  <span className={styles.fieldErrorText}>
                    <IconAlertCircle width={13} height={13} /> {errors.fullName}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className={styles.fieldGroup}>
                <label htmlFor="phone" className={styles.fieldLabel}>
                  <span>WhatsApp Phone <span className={styles.requiredMark}>*</span></span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`${styles.inputField} ${errors.phone ? styles.inputFieldError : ''}`}
                  placeholder="+1 (555) 019-2834"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  autoComplete="tel"
                  required
                />
                {errors.phone ? (
                  <span className={styles.fieldErrorText}>
                    <IconAlertCircle width={13} height={13} /> {errors.phone}
                  </span>
                ) : (
                  <span className={styles.fieldHelper}>Include country code for instant WhatsApp routing</span>
                )}
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div className={styles.fieldGroup} style={{ marginTop: '16px' }}>
              <label htmlFor="email" className={styles.fieldLabel}>
                <span>Email Address</span>
                <span className={styles.optionalTag}>Optional</span>
              </label>
              <input
                id="email"
                type="email"
                className={styles.inputField}
                placeholder="alexander@example.com"
                value={customer.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                autoComplete="email"
              />
              <span className={styles.fieldHelper}>For order confirmation dispatch and receipt backup</span>
            </div>
          </section>

          {/* SECTION 2: Delivery or Pickup Selection */}
          <section className={styles.sectionCard} aria-labelledby="sec-delivery-method">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionStepNumber}>2</div>
              <div>
                <h2 id="sec-delivery-method" className={styles.sectionTitle}>Delivery or Pickup</h2>
                <p className={styles.sectionSubtitle}>Select how you would like to receive your package.</p>
              </div>
            </div>

            <div className={styles.deliveryOptions} role="radiogroup" aria-label="Delivery Method">
              {/* Home Delivery Option */}
              <div
                className={`${styles.deliveryCard} ${customer.deliveryMethod === 'delivery' ? styles.deliveryCardSelected : ''}`}
                onClick={() => handleInputChange('deliveryMethod', 'delivery')}
                role="radio"
                aria-checked={customer.deliveryMethod === 'delivery'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleInputChange('deliveryMethod', 'delivery')}
              >
                <div className={`${styles.radioCircle} ${customer.deliveryMethod === 'delivery' ? styles.radioCircleSelected : ''}`}>
                  {customer.deliveryMethod === 'delivery' && <div className={styles.radioDot} />}
                </div>
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryTitleRow}>
                    <span className={styles.deliveryTitle}>Home Delivery</span>
                    <span className={styles.deliveryFeeBadge}>{formatMoney(storeConfig?.deliveryFeeUsd ?? 15.00)}</span>
                  </div>
                  <span className={styles.deliveryDesc}>Discreet, tracked dispatch straight to your address</span>
                </div>
              </div>

              {/* Store Pickup Option */}
              <div
                className={`${styles.deliveryCard} ${customer.deliveryMethod === 'pickup' ? styles.deliveryCardSelected : ''}`}
                onClick={() => handleInputChange('deliveryMethod', 'pickup')}
                role="radio"
                aria-checked={customer.deliveryMethod === 'pickup'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleInputChange('deliveryMethod', 'pickup')}
              >
                <div className={`${styles.radioCircle} ${customer.deliveryMethod === 'pickup' ? styles.radioCircleSelected : ''}`}>
                  {customer.deliveryMethod === 'pickup' && <div className={styles.radioDot} />}
                </div>
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryTitleRow}>
                    <span className={styles.deliveryTitle}>Store Pickup</span>
                    <span className={styles.deliveryFeeBadge}>Free</span>
                  </div>
                  <span className={styles.deliveryDesc}>In-person pickup at our coordinated logistics hub</span>
                </div>
              </div>
            </div>

            {/* Address fields: strictly required when Home Delivery is selected, hidden when Pickup is selected */}
            {customer.deliveryMethod === 'delivery' ? (
              <div className={`${styles.formGrid} ${styles.formGridTwo}`} style={{ marginTop: '16px' }}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="address" className={styles.fieldLabel}>
                    <span>Street or Delivery Address <span className={styles.requiredMark}>*</span></span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`${styles.inputField} ${errors.address ? styles.inputFieldError : ''}`}
                    placeholder="124 Concord Ave, Suite 4B"
                    value={customer.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    autoComplete="street-address"
                    required
                  />
                  {errors.address && (
                    <span className={styles.fieldErrorText}>
                      <IconAlertCircle width={13} height={13} /> {errors.address}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="city" className={styles.fieldLabel}>
                    <span>City or Town <span className={styles.requiredMark}>*</span></span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`${styles.inputField} ${errors.city ? styles.inputFieldError : ''}`}
                    placeholder="Dallas, TX"
                    value={customer.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    autoComplete="address-level2"
                    required
                  />
                  {errors.city && (
                    <span className={styles.fieldErrorText}>
                      <IconAlertCircle width={13} height={13} /> {errors.city}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.instructionsNotice} style={{ marginTop: '12px' }}>
                <IconStore width={16} height={16} color="#15803d" />
                <span>Pickup address instructions will be coordinated with the seller directly on WhatsApp upon order submission.</span>
              </div>
            )}
          </section>

          {/* SECTION 3: Payment Method Selection */}
          <section className={styles.sectionCard} aria-labelledby="sec-payment-method">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionStepNumber}>3</div>
              <div>
                <h2 id="sec-payment-method" className={styles.sectionTitle}>Payment Method Selection</h2>
                <p className={styles.sectionSubtitle}>Select your preferred payment channel for order settlement.</p>
              </div>
            </div>

            {/* Selectable Payment Cards for PayPal, Venmo, Zelle, Bitcoin (BTC), Cash App */}
            <div className={styles.paymentGrid} role="radiogroup" aria-label="Payment Method">
              {/* Bitcoin (BTC) */}
              <div
                className={`${styles.paymentCard} ${paymentMethod === 'bitcoin' ? styles.paymentCardSelected : ''}`}
                onClick={() => setPaymentMethod('bitcoin')}
                role="radio"
                aria-checked={paymentMethod === 'bitcoin'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('bitcoin')}
              >
                {paymentMethod === 'bitcoin' && (
                  <div className={styles.paymentCheckIndicator}>
                    <IconCheck width={12} height={12} />
                  </div>
                )}
                <div className={styles.paymentCardIcon}>
                  <IconBitcoin width={30} height={30} color="#F7931A" />
                </div>
                <span className={styles.paymentCardName}>Bitcoin (BTC)</span>
              </div>

              {/* Cash App */}
              <div
                className={`${styles.paymentCard} ${paymentMethod === 'cashapp' ? styles.paymentCardSelected : ''}`}
                onClick={() => setPaymentMethod('cashapp')}
                role="radio"
                aria-checked={paymentMethod === 'cashapp'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('cashapp')}
              >
                {paymentMethod === 'cashapp' && (
                  <div className={styles.paymentCheckIndicator}>
                    <IconCheck width={12} height={12} />
                  </div>
                )}
                <div className={styles.paymentCardIcon}>
                  <IconCashApp width={30} height={30} color="#00D632" />
                </div>
                <span className={styles.paymentCardName}>Cash App</span>
              </div>

              {/* Zelle */}
              <div
                className={`${styles.paymentCard} ${paymentMethod === 'zelle' ? styles.paymentCardSelected : ''}`}
                onClick={() => setPaymentMethod('zelle')}
                role="radio"
                aria-checked={paymentMethod === 'zelle'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('zelle')}
              >
                {paymentMethod === 'zelle' && (
                  <div className={styles.paymentCheckIndicator}>
                    <IconCheck width={12} height={12} />
                  </div>
                )}
                <div className={styles.paymentCardIcon}>
                  <IconZelle width={30} height={30} color="#7414CA" />
                </div>
                <span className={styles.paymentCardName}>Zelle</span>
              </div>

              {/* PayPal */}
              <div
                className={`${styles.paymentCard} ${paymentMethod === 'paypal' ? styles.paymentCardSelected : ''}`}
                onClick={() => setPaymentMethod('paypal')}
                role="radio"
                aria-checked={paymentMethod === 'paypal'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('paypal')}
              >
                {paymentMethod === 'paypal' && (
                  <div className={styles.paymentCheckIndicator}>
                    <IconCheck width={12} height={12} />
                  </div>
                )}
                <div className={styles.paymentCardIcon}>
                  <IconPayPal width={30} height={30} color="#003087" />
                </div>
                <span className={styles.paymentCardName}>PayPal</span>
              </div>

              {/* Venmo */}
              <div
                className={`${styles.paymentCard} ${paymentMethod === 'venmo' ? styles.paymentCardSelected : ''}`}
                onClick={() => setPaymentMethod('venmo')}
                role="radio"
                aria-checked={paymentMethod === 'venmo'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('venmo')}
              >
                {paymentMethod === 'venmo' && (
                  <div className={styles.paymentCheckIndicator}>
                    <IconCheck width={12} height={12} />
                  </div>
                )}
                <div className={styles.paymentCardIcon}>
                  <IconVenmo width={30} height={30} color="#008CFF" />
                </div>
                <span className={styles.paymentCardName}>Venmo</span>
              </div>
            </div>

            {/* Relevant Payment Instructions displayed below */}
            {selectedPaymentInfo && (
              <div className={styles.paymentInstructionsBox}>
                <div className={styles.instructionsHeader}>
                  <span className={styles.instructionsTitle}>Payment Instructions</span>
                  <span className={styles.instructionsBadge}>{selectedPaymentInfo.name}</span>
                </div>
                <p className={styles.instructionsContent}>{selectedPaymentInfo.instructions}</p>
                <div className={styles.instructionsNotice}>
                  <IconLock width={13} height={13} />
                  <span>Exact transfer handles and confirmations are verified directly with the seller in your WhatsApp chat.</span>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 4: Order Notes */}
          <section className={styles.sectionCard} aria-labelledby="sec-order-notes">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionStepNumber}>4</div>
              <div>
                <h2 id="sec-order-notes" className={styles.sectionTitle}>Additional Order Notes</h2>
                <p className={styles.sectionSubtitle}>Specific packaging, delivery timeframes, or handling instructions.</p>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <textarea
                id="notes"
                className={styles.notesTextarea}
                placeholder="Leave package at the side gate, discreet exterior carton, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Sections 5 to 7 */}
        <div className={styles.summaryColumn}>
          <div className={styles.stickySummary}>
            <div className={styles.summaryCard}>
              {/* SECTION 5: Order Summary with Product Quantity Controls */}
              <div className={styles.summaryHeader}>
                <h2 className={styles.summaryTitle}>5. Order Summary</h2>
                <span className={styles.itemCountBadge}>
                  {calculations.itemCount} {calculations.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {errors.cart && (
                <div className={styles.errorBanner} style={{ marginTop: '10px' }}>
                  <IconAlertCircle width={16} height={16} />
                  <span>{errors.cart}</span>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className={styles.emptyCartBox}>
                  <IconShoppingCart width={36} height={36} color="#94a3b8" />
                  <p className={styles.emptyCartTitle}>Your cart is currently empty</p>
                  <p className={styles.emptyCartSubtitle}>Load sample products to test the checkout flow, or browse our shop.</p>
                  <button
                    type="button"
                    onClick={handleResetSampleCart}
                    className={styles.sampleAddBtn}
                  >
                    Load Test Products
                  </button>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {cartItems.map((item) => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.quantity) || 1;
                    const lineTotal = itemPrice * itemQty;

                    return (
                      <div key={item.id} className={styles.itemRow}>
                        <img
                          src={item.image || '/images/portals/peptides.jpg'}
                          alt={item.name}
                          className={styles.itemThumbnail}
                        />

                        <div className={styles.itemDetails}>
                          <h4 className={styles.itemName} title={item.name}>{item.name}</h4>
                          <span className={styles.itemUnitPrice}>{formatMoney(itemPrice)} each</span>

                          {/* Quantity Controls */}
                          <div className={styles.itemActions} style={{ marginTop: '6px' }}>
                            <div className={styles.quantityGroup}>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={itemQty <= 1}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className={styles.qtyDisplay}>{itemQty}</span>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => handleQuantityChange(item.id, 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label="Remove item"
                              title="Remove item"
                            >
                              <IconTrash width={16} height={16} />
                            </button>
                          </div>
                        </div>

                        <div className={styles.itemSubtotalCol}>
                          <span className={styles.itemSubtotal}>{formatMoney(lineTotal)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION 6: Subtotal, Delivery Fee, and Final Total */}
              <div className={styles.totalsList}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalRowValue}>{formatMoney(calculations.subtotal)}</span>
                </div>

                <div className={styles.totalRow}>
                  <span>
                    Delivery ({customer.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Pickup'})
                  </span>
                  <span className={styles.totalRowValue}>
                    {customer.deliveryMethod === 'delivery' ? (
                      formatMoney(calculations.deliveryFee)
                    ) : (
                      <span className={styles.freeBadge}>FREE</span>
                    )}
                  </span>
                </div>

                {calculations.discount > 0 && (
                  <div className={styles.totalRow}>
                    <span>Discount</span>
                    <span className={styles.totalRowValue}>-{formatMoney(calculations.discount)}</span>
                  </div>
                )}

                <div className={styles.finalTotalRow}>
                  <span className={styles.finalTotalLabel}>Final Total</span>
                  <span className={styles.finalTotalValue}>{formatMoney(calculations.total)}</span>
                </div>
              </div>

              {/* SECTION 7: Prominent Green Pay on WhatsApp Button */}
              <button
                type="button"
                className={styles.whatsAppBtn}
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting || cartItems.length === 0}
                id="btn-whatsapp-checkout"
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner width={20} height={20} />
                    <span>Saving Order...</span>
                  </>
                ) : (
                  <>
                    <IconWhatsApp width={22} height={22} color="#ffffff" />
                    <span>Pay on WhatsApp</span>
                  </>
                )}
              </button>

              <p className={styles.checkoutNotice}>
                Your order will be securely registered in our system, generating your verified reference code before opening WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* SECTION: Post-Checkout Confirmation Modal */}
      {completedOrder && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalIconCircle}>
              <IconCheck width={36} height={36} />
            </div>

            <h2 className={styles.modalTitle}>Order Registered Successfully</h2>
            <p className={styles.modalSubtitle}>
              Your order has been recorded in our database. Complete the checkout by sending the prefilled message to our team on WhatsApp.
            </p>

            {/* Order Reference */}
            <div className={styles.orderRefBox}>
              <div>
                <div className={styles.refLabel}>Order Reference</div>
                <div className={styles.refCode}>{completedOrder.order?.orderReference}</div>
              </div>
              <button
                type="button"
                className={styles.copyRefBtn}
                onClick={() => handleCopyReference(completedOrder.order?.orderReference)}
              >
                {copiedRef ? (
                  <>
                    <IconCheck width={14} height={14} color="#15803d" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <IconCopy width={14} height={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Seller Confirmation Notice */}
            <div className={styles.modalInstructions}>
              <strong>Important Next Step:</strong>
              Please ensure you send the prefilled WhatsApp message. Your order is pending verification and is only marked as paid once payment is confirmed directly by the seller.
            </div>

            {/* Action buttons */}
            <div className={styles.modalActions}>
              <a
                href={completedOrder.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalOpenWhatsAppBtn}
              >
                <IconWhatsApp width={20} height={20} color="#ffffff" />
                <span>Open WhatsApp Chat Now</span>
              </a>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => {
                  setCompletedOrder(null);
                  handleResetSampleCart();
                }}
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
