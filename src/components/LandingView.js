"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../app/shared.module.css";
import PortalNavbar from "./PortalNavbar";
import PortalFooter from "./PortalFooter";
import CartDrawer from "./CartDrawer";
import HeroShowcase from "./HeroShowcase";
import {
  IconCheck,
  IconShield,
  IconGear,
  IconBox,
  IconBolt,
  IconArrowRight,
  IconHelpCircle,
  IconGrid,
} from "./Icons";

export default function LandingView({ catalog }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const portalPath = `/${catalog.slug}`;

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    setNotification(`Added ${product.name} to inquiry list`);
    setTimeout(() => setNotification(""), 2800);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // Floating glass preview card overlaying the hero image
  const previewCard = (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px",
        background: "rgba(18, 18, 24, 0.8)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "8px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-sm-md)",
        zIndex: 3,
      }}
    >
      <div>
        <div style={{ fontSize: "var(--text-2xs)", textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "1px" }}>
          {catalog.featuredBadge}
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 700, color: "#ffffff" }}>
          {catalog.products[0]?.name}
        </div>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
          {catalog.products[0]?.price}
        </div>
      </div>
      <button
        onClick={() => addToCart(catalog.products[0])}
        style={{
          background: "#ffffff",
          color: "#050507",
          border: "none",
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        + Add to Cart
      </button>
    </div>
  );

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
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            padding: "var(--space-sm-md) var(--space-md-lg)",
            color: "#ffffff",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <IconCheck size={16} color="#10b981" />
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
        }}
      />

      {/* Standalone Navigation Bar */}
      <PortalNavbar
        catalog={catalog}
        activeTab="home"
        cartCount={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Section with Dedicated Background Image */}
      <section
        id="hero"
        className={styles.heroSection}
        style={{
          backgroundImage: `url(${catalog.backgroundImage})`,
        }}
      >
        <div className={styles.heroSectionOverlay}></div>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{catalog.tagline}</h1>
            <p className={styles.heroDesc}>{catalog.subtitle}</p>
          <div className={styles.heroActions}>
            <Link
              href={`${portalPath}/products`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "var(--space-sm-md) 24px",
                background: "#ffffff",
                color: "#050507",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "var(--text-md)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>Explore Products</span>
              <IconArrowRight size={16} color="#050507" />
            </Link>
            <Link
              href={`${portalPath}/faq`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "var(--space-sm-md) 24px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--color-text-primary)",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "var(--text-md)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>Frequently Asked Questions</span>
              <IconHelpCircle size={16} color="var(--color-text-secondary)" />
            </Link>
          </div>
        </div>

        {/* Hero Visual matching reference image */}
        <div className={styles.heroVisual}>
          <div className={styles.heroGlow}></div>
          {catalog.heroCallouts ? (
            <HeroShowcase catalog={catalog} footer={previewCard} />
          ) : (
            <div className={styles.heroImageWrap}>
              <Image
                src={catalog.heroImage}
                alt={`${catalog.name} Hero`}
                width={480}
                height={480}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
                priority
              />
              {previewCard}
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section id="bestsellers" className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>Best Sellers</div>
            <h2 className={styles.sectionTitle}>Discover Our Most-Loved Products</h2>
          </div>
          <p className={styles.sectionDesc}>
            {catalog.bestsellersDesc || "Industry leading catalog items certified for laboratory purity, precision manufacturing tolerances, and consistent reliability."}
          </p>
        </div>

        <div className={styles.featuredGrid}>
          {catalog.featuredItems.map((item, idx) => (
            <div key={item.id} className={styles.featuredCard}>
              <div className={styles.featuredCardBg}>
                <Image
                  src={item.image || catalog.heroImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{ objectFit: "cover", opacity: 0.4 }}
                />
              </div>
              <div className={styles.featuredContent}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "20px",
                    fontSize: "var(--text-2xs)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#ffffff",
                    marginBottom: "var(--space-sm-md)",
                  }}
                >
                  {item.badge}
                </span>
                <h3 className={styles.featuredTitle}>{item.title}</h3>
                <p className={styles.featuredDesc}>{item.subtitle}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                  <span style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#ffffff" }}>
                    {item.price}
                  </span>
                  <button
                    onClick={() => {
                      const match = catalog.products[idx] || catalog.products[0];
                      addToCart(match);
                    }}
                    style={{
                      background: "#ffffff",
                      color: "#050507",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "var(--text-sm)",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {item.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Quick Preview */}
      <section className={styles.catalogSection} style={{ paddingTop: 0 }}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>{catalog.accentLabel}</div>
            <h2 className={styles.sectionTitle}>Featured Inventory Preview</h2>
          </div>
          <Link
            href={`${portalPath}/products`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <IconGrid size={16} color="#ffffff" />
            <span>View All {catalog.products.length} Products</span>
            <IconArrowRight size={14} color="#a1a1aa" />
          </Link>
        </div>

        {/* 4 Preview Cards */}
        <div className={styles.productGrid}>
          {catalog.products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => router.push(`${portalPath}/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
                <div className={styles.productCategory} style={{ marginBottom: 0 }}>{product.category}</div>
                {product.badge && (
                  <span
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "var(--color-text-secondary)",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {product.image && (
                <div className={styles.productImageWrap}>
                  <div className={styles.productAmbient}></div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <h4 className={styles.productName}>{product.name}</h4>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-sm-md)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                <span>{product.spec}</span>
                <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>{product.purity}</span>
              </div>

              <div className={styles.productFooter} style={{ marginTop: "auto" }}>
                <div>
                  <div className={styles.productPrice}>{product.price}</div>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>View Specs →</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className={styles.productAction}
                  aria-label={`Add ${product.name} to cart`}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standards & Trust Indicators (Using Clean SVG Icons) */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "var(--space-md-lg) 32px 60px",
        }}
      >
        <div
          style={{
            background: "rgba(18, 18, 24, 0.65)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          <div>
            <div style={{ marginBottom: "10px", color: "#ffffff" }}>
              <IconShield size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px", color: "#ffffff" }}>
              HPLC Lab Certified
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Every lot is third-party tested with high performance liquid chromatography.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "10px", color: "#ffffff" }}>
              <IconGear size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px", color: "#ffffff" }}>
              Cleanroom Specification
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Sterile environment handling following rigorous laboratory protocols.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "10px", color: "#ffffff" }}>
              <IconBox size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px", color: "#ffffff" }}>
              Insulated Packaging
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Temperature-controlled thermal packaging to preserve compound stability.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "10px", color: "#ffffff" }}>
              <IconBolt size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px", color: "#ffffff" }}>
              Priority Dispatch
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Rapid same-day dispatch with end-to-end discrete tracking.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Banner Section */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px 64px",
        }}
      >
        <div
          style={{
            background: "rgba(18, 18, 24, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <IconHelpCircle size={18} color="#e4e4e7" />
              <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", fontWeight: 600 }}>
                Frequently Asked Questions
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {catalog.faqBannerTitle || "Have questions regarding purity, storage, or dispatch?"}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", maxWidth: "560px" }}>
              {catalog.faqBannerDesc || `Browse our comprehensive technical documentation and frequently asked questions for ${catalog.name}.`}
            </p>
          </div>
          <Link
            href={`${portalPath}/faq`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "var(--space-sm-md) 22px",
              background: "#ffffff",
              color: "#050507",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              textDecoration: "none",
            }}
          >
            <span>Read Knowledge Base &amp; FAQs</span>
            <IconArrowRight size={14} color="#050507" />
          </Link>
        </div>
      </section>

      {/* Portal Footer */}
      <PortalFooter catalog={catalog} />
    </div>
  );
}
