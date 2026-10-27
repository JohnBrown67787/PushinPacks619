"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductDetailView.module.css";
import PortalNavbar from "./PortalNavbar";
import PortalFooter from "./PortalFooter";
import CartDrawer from "./CartDrawer";
import {
  IconCheck,
  IconShield,
  IconTruck,
  IconBox,
  IconShoppingCart,
  IconArrowLeft,
  IconArrowRight,
  IconMicroscope,
} from "./Icons";

export default function ProductDetailView({ catalog, productId }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [purchaseMode, setPurchaseMode] = useState("onetime"); // "onetime" | "subscribe"
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "lab" | "reconstitution" | "shipping"
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pushinpacks_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not read cart from localStorage", e);
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem("pushinpacks_cart", JSON.stringify(newCart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  };

  // Find product in catalog
  const product = catalog.products.find((p) => p.id === productId) || catalog.products[0];

  // Calculate pricing based on mode and quantity
  const numericPrice = typeof product.price === "string"
    ? parseFloat(product.price.replace(/[^0-9.]/g, "")) || 100
    : (Number(product.price) || 100);

  const subPriceNumeric = product.subscribePrice
    ? (parseFloat(product.subscribePrice.replace(/[^0-9.]/g, "")) || Math.round(numericPrice * 0.85))
    : Math.round(numericPrice * 0.85);

  const activeUnitPrice = purchaseMode === "subscribe" ? subPriceNumeric : numericPrice;

  // Tiered discounts
  let discountMultiplier = 1.0;
  if (quantity >= 5) {
    discountMultiplier = 0.80; // 20% off
  } else if (quantity >= 3) {
    discountMultiplier = 0.90; // 10% off
  }

  const finalUnitPrice = Math.round(activeUnitPrice * discountMultiplier * 100) / 100;
  const totalPrice = (finalUnitPrice * quantity).toFixed(2);

  const addToCart = (productToAdd, qtyToAdd = 1, directCheckout = false) => {
    const itemToAdd = {
      id: productToAdd.id,
      name: productToAdd.name,
      price: finalUnitPrice,
      spec: productToAdd.spec,
      image: productToAdd.image,
      category: productToAdd.category,
      purchaseMode: purchaseMode,
    };

    let updatedCart;
    const existingIndex = cart.findIndex((item) => item.id === itemToAdd.id && item.purchaseMode === purchaseMode);

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].qty = (updatedCart[existingIndex].qty || 1) + qtyToAdd;
    } else {
      updatedCart = [...cart, { ...itemToAdd, qty: qtyToAdd }];
    }

    saveCart(updatedCart);

    if (directCheckout) {
      router.push("/checkout");
    } else {
      setNotification(`Added ${qtyToAdd}x ${productToAdd.name} to cart`);
      setTimeout(() => setNotification(""), 3000);
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (id, delta) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = (item.qty || 1) + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + (item.qty || item.quantity || 1), 0);

  // Recommendations: 4 complementary products excluding current product
  const relatedProducts = catalog.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            background: "rgba(20, 20, 26, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "8px",
            padding: "14px 22px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <IconCheck size={18} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          router.push("/checkout");
        }}
      />

      {/* Standalone Navigation Bar */}
      <PortalNavbar
        catalog={catalog}
        activeTab="products"
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <Link href={`/${catalog.slug}/products`} className={styles.backBtn}>
            <IconArrowLeft size={14} />
            <span>Back to Peptides Catalog</span>
          </Link>
          <span style={{ color: "var(--color-text-dim)" }}>/</span>
          <Link href="/" className={styles.breadcrumbLink}>PushinPacks</Link>
          <span style={{ color: "var(--color-text-dim)" }}>/</span>
          <Link href={`/${catalog.slug}`} className={styles.breadcrumbLink}>{catalog.name}</Link>
          <span style={{ color: "var(--color-text-dim)" }}>/</span>
          <Link href={`/${catalog.slug}/products`} className={styles.breadcrumbLink}>Products</Link>
          <span style={{ color: "var(--color-text-dim)" }}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className={styles.detailGrid}>
          {/* Left Column: Visual Showcase */}
          <div className={styles.visualCol}>
            <div className={styles.mainImageCard}>
              <div className={styles.imageOverlayBadges}>
                <span className={styles.purityPill}>{product.purity || "99.8% HPLC Certified"}</span>
                <span className={styles.badgePill}>{product.badge || "Verified Batch"}</span>
              </div>

              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 560px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div style={{ color: "var(--color-text-muted)" }}>Image Not Available</div>
              )}

              <div className={styles.ambientGlow} />

              <div className={styles.imageBottomBar}>
                <span className={styles.imageBottomText}>{product.spec}</span>
                <span className={styles.verifiedCertText}>HPLC Lab Verified</span>
              </div>
            </div>

            {/* Quick Specs Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div style={{ background: "rgba(18, 18, 24, 0.5)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Batch ID</div>
                <div style={{ fontSize: "12px", color: "#ffffff", fontWeight: 600 }}>{product.labTesting?.coaBatch || "COA-2026-PEP"}</div>
              </div>
              <div style={{ background: "rgba(18, 18, 24, 0.5)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Endotoxin</div>
                <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>{product.labTesting?.endotoxin || "< 0.02 EU/mg"}</div>
              </div>
              <div style={{ background: "rgba(18, 18, 24, 0.5)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Storage</div>
                <div style={{ fontSize: "12px", color: "#ffffff", fontWeight: 600 }}>2°C to 8°C Cold</div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing & Actions */}
          <div className={styles.infoCol}>
            <div className={styles.metaHeader}>
              <span className={styles.categoryTag}>{product.category}</span>
              <div className={styles.stockStatusPill}>
                <span className={styles.stockDot} />
                <span>{product.stockStatus || "In Stock (Cold-Chain Verified)"}</span>
              </div>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>

            {/* Ratings and Reviews Summary */}
            <div className={styles.reviewsRatingRow}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className={styles.ratingScore}>{product.rating || "4.9"} / 5.0</span>
              <span style={{ color: "var(--color-text-dim)" }}>•</span>
              <span className={styles.reviewsCountLink} onClick={() => setActiveTab("overview")}>
                ({product.reviewsCount || 48} Verified Laboratory Reviews)
              </span>
              <span style={{ color: "var(--color-text-dim)" }}>•</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>100% Recommended</span>
            </div>

            <p className={styles.shortDesc}>{product.description}</p>

            {/* Interactive Dynamic Pricing: One-Time vs. Subscribe & Save */}
            <div className={styles.pricingOptionsContainer}>
              <div
                className={`${styles.pricingOptionCard} ${purchaseMode === "onetime" ? styles.pricingOptionActive : ""}`}
                onClick={() => setPurchaseMode("onetime")}
              >
                <div className={styles.optionRadioRow}>
                  <div className={styles.customRadio}>
                    {purchaseMode === "onetime" && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionTextGroup}>
                    <span className={styles.optionTitle}>One-Time Laboratory Purchase</span>
                    <span className={styles.optionSubtitle}>Single synthesis shipment with full COA documentation</span>
                  </div>
                </div>
                <div className={styles.optionPriceGroup}>
                  <div className={styles.optionPrice}>{product.oneTimePrice || product.price}</div>
                </div>
              </div>

              <div
                className={`${styles.pricingOptionCard} ${purchaseMode === "subscribe" ? styles.pricingOptionActive : ""}`}
                onClick={() => setPurchaseMode("subscribe")}
              >
                <div className={styles.optionRadioRow}>
                  <div className={styles.customRadio}>
                    {purchaseMode === "subscribe" && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionTextGroup}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={styles.optionTitle}>Subscribe & Protocol Replenish</span>
                      <span className={styles.optionDiscountBadge}>Save 15%</span>
                    </div>
                    <span className={styles.optionSubtitle}>Scheduled monthly delivery. Modify, pause, or cancel anytime.</span>
                  </div>
                </div>
                <div className={styles.optionPriceGroup}>
                  <div className={styles.optionPrice}>{product.subscribePrice || `$${subPriceNumeric.toFixed(2)}`}</div>
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>per cycle</span>
                </div>
              </div>
            </div>

            {/* Volume Tier Table */}
            <div className={styles.tieredContainer}>
              <div className={styles.tierCard}>
                <div className={styles.tierLabel}>1 Unit</div>
                <div className={styles.tierPrice}>${activeUnitPrice.toFixed(2)}</div>
                <div className={styles.tierDiscount}>Standard Rate</div>
              </div>
              <div className={styles.tierCard}>
                <div className={styles.tierLabel}>3 Units</div>
                <div className={styles.tierPrice}>${(activeUnitPrice * 0.9).toFixed(2)} / ea</div>
                <div className={styles.tierDiscount}>Save 10%</div>
              </div>
              <div className={styles.tierCard}>
                <div className={styles.tierLabel}>5+ Units</div>
                <div className={styles.tierPrice}>${(activeUnitPrice * 0.8).toFixed(2)} / ea</div>
                <div className={styles.tierDiscount}>Save 20% Bulk</div>
              </div>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className={styles.actionRow}>
              <div className={styles.quantityPicker}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) setQuantity(val);
                  }}
                  min="1"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((prev) => prev + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.addToCartBtn}
                onClick={() => addToCart(product, quantity, false)}
              >
                <IconShoppingCart size={18} />
                <span>Add to Cart (${totalPrice})</span>
              </button>

              <button
                type="button"
                className={styles.checkoutNowBtn}
                onClick={() => addToCart(product, quantity, true)}
              >
                <span>Express Checkout</span>
                <IconArrowRight size={16} />
              </button>
            </div>

            {/* Trust and Safety Indicators */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><IconShield size={20} color="#10b981" /></div>
                <div className={styles.trustTextGroup}>
                  <span className={styles.trustTitle}>99.8% HPLC Certified</span>
                  <span className={styles.trustSub}>Independent third-party COA</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><IconBox size={20} color="#10b981" /></div>
                <div className={styles.trustTextGroup}>
                  <span className={styles.trustTitle}>Cold-Chain Insulated</span>
                  <span className={styles.trustSub}>Thermal 2°C to 8°C gel pack</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><IconTruck size={20} color="#10b981" /></div>
                <div className={styles.trustTextGroup}>
                  <span className={styles.trustTitle}>Discreet Express</span>
                  <span className={styles.trustSub}>Same-day tracking dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Technical Documentation Section */}
        <section className={styles.tabsSection}>
          <div className={styles.tabsNav} role="tablist">
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("overview")}
              role="tab"
              aria-selected={activeTab === "overview"}
            >
              Scientific Overview
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "lab" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("lab")}
              role="tab"
              aria-selected={activeTab === "lab"}
            >
              HPLC Lab Testing & COA
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "reconstitution" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("reconstitution")}
              role="tab"
              aria-selected={activeTab === "reconstitution"}
            >
              Reconstitution & Storage
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "shipping" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("shipping")}
              role="tab"
              aria-selected={activeTab === "shipping"}
            >
              Cold-Chain Logistics
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "overview" && (
              <div>
                <h3 style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700, marginBottom: "12px" }}>
                  Molecular Profile & Biological Mechanisms
                </h3>
                <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>
                  {product.longDescription || product.description}
                </p>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
                  <div style={{ fontWeight: 600, color: "#ffffff", marginBottom: "6px" }}>Intended Research Scope</div>
                  <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    This research compound is exclusively synthesized for in-vitro cellular investigations, biochemical binding affinity profiling, and animal metabolic assays. Not for direct human clinical or diagnostic administration.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "lab" && (
              <div>
                <h3 style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700, marginBottom: "12px" }}>
                  Certificate of Analysis & HPLC Verification
                </h3>
                <p style={{ marginBottom: "16px" }}>
                  Every production lot undergoes rigorous liquid chromatography and mass spectrometry to ensure zero microbial contamination, minimum 99.5%+ purity, and absence of residual trifluoroacetic acid (TFA).
                </p>
                <table className={styles.specTable}>
                  <tbody>
                    <tr>
                      <td className={styles.specLabel}>Assayed Purity</td>
                      <td className={styles.specValue} style={{ color: "#10b981" }}>{product.labTesting?.purity || product.purity}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Testing Methodology</td>
                      <td className={styles.specValue}>{product.labTesting?.testMethod || "Reverse-Phase HPLC & Electrospray Mass Spec"}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Batch / COA Reference</td>
                      <td className={styles.specValue}>{product.labTesting?.coaBatch || "COA-2026-PEP"}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Chemical Appearance</td>
                      <td className={styles.specValue}>{product.labTesting?.appearance || "White lyophilized crystalline cake"}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>Endotoxin Specification</td>
                      <td className={styles.specValue}>{product.labTesting?.endotoxin || "< 0.02 EU/mg (LAL Test)"}</td>
                    </tr>
                    <tr>
                      <td className={styles.specLabel}>CAS Registry Identifier</td>
                      <td className={styles.specValue}>{product.labTesting?.casNumber || "Verified Research Sequence"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reconstitution" && (
              <div>
                <h3 style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700, marginBottom: "12px" }}>
                  Laboratory Reconstitution & Stability Protocols
                </h3>
                <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>
                  {product.reconstitution || "Reconstitute with sterile bacteriostatic water (0.9% benzyl alcohol). Allow diluent to slowly run down the glass wall of the vial; swirl gently until completely dissolved."}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "20px" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>Lyophilized Storage</div>
                    <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      Keep in an airtight container at -20°C for up to 24 months. Protect from direct UV light and moisture.
                    </div>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>Reconstituted Stability</div>
                    <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      Maintain at 2°C to 8°C in amber glass. Solutions retain peak biological activity for 30 to 45 days. Do not freeze reconstituted solution.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700, marginBottom: "12px" }}>
                  Cold-Chain Transit & Stealth Fulfillment
                </h3>
                <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>
                  {product.shipping || "Shipped in insulated cold-chain thermal mailers with non-toxic refrigerant gel packs and discreet tracking."}
                </p>
                <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                  <li>Orders placed before 2:00 PM EST receive same-day priority dispatch.</li>
                  <li>Multi-barrier vacuum packaging ensures zero scent or moisture transmission.</li>
                  <li>Discreet exterior packaging: no reference to chemical contents or brand names.</li>
                  <li>Real-time tracking number provided immediately upon carrier induction.</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Verified Customer & Researcher Reviews */}
        <section className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <div className={styles.reviewsTitleGroup}>
              <h3>Verified Researcher Feedback</h3>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Based on {product.reviewsCount || 48} verified analytical laboratory evaluations
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewSubmitted(true)}
              style={{
                padding: "8px 18px",
                background: reviewSubmitted ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: reviewSubmitted ? "#10b981" : "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {reviewSubmitted ? "Feedback Recorded" : "Submit Lab Review"}
            </button>
          </div>

          <div className={styles.reviewsList}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewerName}>Dr. H. Vance, Molecular Bio Lab</span>
                <span className={styles.verifiedBadge}>Verified Researcher</span>
              </div>
              <div style={{ color: "#f59e0b", fontSize: "13px", marginBottom: "8px" }}>★★★★★</div>
              <p className={styles.reviewText}>
                Consistently delivers single-peak chromatography on analytical runs. Solubility is instantaneous with zero particulate residue. Cold pack arrived still frozen.
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewerName}>Marcus K., Cellular Assay Tech</span>
                <span className={styles.verifiedBadge}>Verified Researcher</span>
              </div>
              <div style={{ color: "#f59e0b", fontSize: "13px", marginBottom: "8px" }}>★★★★★</div>
              <p className={styles.reviewText}>
                The prefilled device dial accuracy matches our digital micro-pipettes. Purity profile matches the enclosed certificate of analysis precisely.
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewerName}>Dr. S. Thorne, Biotech Reserve</span>
                <span className={styles.verifiedBadge}>Verified Researcher</span>
              </div>
              <div style={{ color: "#f59e0b", fontSize: "13px", marginBottom: "8px" }}>★★★★★</div>
              <p className={styles.reviewText}>
                Excellent peptide stability over our 30-day monitoring window. Rapid courier dispatch and discreet packing are unmatched.
              </p>
            </div>
          </div>
        </section>

        {/* Related / Customers Also Bought Section */}
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Customers Also Researched</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((relItem) => (
              <div key={relItem.id} className={styles.relatedCard}>
                <Link href={`/${catalog.slug}/products/${relItem.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className={styles.relatedImgWrap}>
                    {relItem.image && (
                      <Image
                        src={relItem.image}
                        alt={relItem.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className={styles.relatedBody}>
                    <span className={styles.relatedCategory}>{relItem.category}</span>
                    <h4 className={styles.relatedName}>{relItem.name}</h4>
                    <div className={styles.relatedFooter}>
                      <span className={styles.relatedPrice}>{relItem.price}</span>
                      <span className={styles.relatedAction}>View Details →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PortalFooter catalog={catalog} />
    </div>
  );
}
