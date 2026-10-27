"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../app/shared.module.css";
import {
  IconCheck,
  IconTrash,
  IconShield,
  IconGear,
  IconBox,
  IconBolt,
  IconCart,
  IconArrowLeft,
  IconSearch,
} from "./Icons";

const ALL_PORTALS = [
  { id: "peptides", name: "Peptides", path: "/peptides" },
  { id: "stocks", name: "Stocks", path: "/stocks" },
  { id: "glock", name: "Glock", path: "/glock" },
  { id: "psychedelics", name: "Psychedelics", path: "/psychedelics" },
  { id: "pharms", name: "Pharms", path: "/pharms" },
  { id: "budcart", name: "Bud'Cart", path: "/budcart" },
];

export default function CatalogView({ catalog }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const categories = ["All", ...new Set(catalog.products.map((p) => p.category))];

  const filteredProducts = catalog.products.filter((product) => {
    const matchesCat = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <IconCheck size={16} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cart Inquiry Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#0d0d12",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", margin: 0 }}>
                Inquiry Cart ({totalItems})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-xl)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
                <p>Your inquiry list is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    marginTop: "16px",
                    padding: "8px 16px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-sm-md)", overflowY: "auto" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        padding: "var(--space-sm-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "var(--text-md)", marginBottom: "2px" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                          {item.spec} · {item.price}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            marginLeft: "6px",
                            background: "transparent",
                            border: "none",
                            color: "var(--color-text-dim)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                          }}
                          title="Remove item"
                        >
                          <IconTrash size={16} color="var(--color-text-dim)" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    paddingTop: "var(--space-md-lg)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    marginTop: "var(--space-md-lg)",
                  }}
                >
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                    Batch inquiries are reviewed directly by the fulfillment desk for custom pricing and dispatch options.
                  </p>
                  <button
                    onClick={() => {
                      alert("Inquiry confirmed! Representative will review your requested items.");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "var(--space-sm-md)",
                      background: "#ffffff",
                      color: "#050507",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "var(--text-md)",
                      cursor: "pointer",
                    }}
                  >
                    Submit Batch Inquiry
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Standalone Navigation Bar */}
      <header className={styles.navbar}>
        <div className={styles.navLogo}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
            <Image
              src="/logo.jpg"
              alt="PushinPacks Logo"
              width={34}
              height={34}
              className={styles.navLogoImg}
              priority
            />
            <span className={styles.navBrand}>
              PushinPacks <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>/ {catalog.name}</span>
            </span>
          </Link>
        </div>

        {/* Catalog Links */}
        <nav className={styles.navLinks}>
          <a href="#hero" className={styles.navLinkActive}>
            Home
          </a>
          <a href="#bestsellers" className={styles.navLink}>
            Best Sellers
          </a>
          <a href="#catalog" className={styles.navLink}>
            Full Catalog
          </a>
          <a href="#standards" className={styles.navLink}>
            Standards
          </a>
        </nav>

        {/* Portal Switcher & Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm-md)" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px var(--space-sm-md)",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-xs)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <IconArrowLeft size={14} color="var(--color-text-muted)" />
            <span>Portals Hub</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className={styles.navCta}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <IconCart size={16} color="var(--color-bg-deep)" />
            <span>Inquiry Cart</span>
            {totalItems > 0 && (
              <span
                style={{
                  background: "#050507",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "1px 7px",
                  fontSize: "var(--text-2xs)",
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{catalog.tagline}</h1>
          <p className={styles.heroDesc}>{catalog.subtitle}</p>
          <div className={styles.heroActions}>
            <a
              href="#catalog"
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
              Explore Catalog
            </a>
            <a
              href="#standards"
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
              Verification Specs
            </a>
          </div>
        </div>

        {/* Hero Visual matching reference image */}
        <div className={styles.heroVisual}>
          <div className={styles.heroGlow}></div>
          <div className={styles.heroImageWrap}>
            <Image
              src={catalog.heroImage}
              alt={`${catalog.name} Hero`}
              width={480}
              height={480}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              priority
            />

            {/* Floating Glass Preview Card overlaying hero */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                right: "20px",
                background: "rgba(18, 18, 24, 0.75)",
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
            Industry leading catalog items certified for laboratory purity, precision manufacturing tolerances, and consistent reliability.
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
                  sizes="(max-width: 768px) 100vw, 400px"
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

      {/* Main Catalog / Just Added Grid */}
      <section id="catalog" className={styles.catalogSection} style={{ paddingTop: 0 }}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>{catalog.accentLabel}</div>
            <h2 className={styles.sectionTitle}>Full Catalog Inventory</h2>
          </div>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
              <IconSearch size={14} color="var(--color-text-muted)" />
            </span>
            <input
              type="text"
              placeholder="Search compounds or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "10px 16px 10px 36px",
                color: "#ffffff",
                fontSize: "var(--text-sm)",
                outline: "none",
                minWidth: "240px",
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                cursor: "pointer",
                border: selectedCategory === cat ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                background: selectedCategory === cat ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.02)",
                color: selectedCategory === cat ? "#ffffff" : "var(--color-text-muted)",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
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
                <div className={styles.productPrice}>{product.price}</div>
                <button
                  onClick={() => addToCart(product)}
                  className={styles.productAction}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standards & Trust Indicators (Using SVG Icons) */}
      <section
        id="standards"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 32px 80px",
        }}
      >
        <div
          style={{
            background: "rgba(18, 18, 24, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ marginBottom: "8px", color: "#ffffff" }}>
              <IconShield size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px" }}>
              HPLC Lab Certified
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Every lot is third-party tested with high performance liquid chromatography.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "8px", color: "#ffffff" }}>
              <IconGear size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px" }}>
              Cleanroom Specification
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Sterile environment handling following rigorous laboratory protocols.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "8px", color: "#ffffff" }}>
              <IconBox size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px" }}>
              Insulated Packaging
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Temperature-controlled thermal packaging to preserve compound stability.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "8px", color: "#ffffff" }}>
              <IconBolt size={24} color="#e4e4e7" />
            </div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "4px" }}>
              Priority Dispatch
            </h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Rapid same-day dispatch with end-to-end discrete tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation to Other Standalone Portals */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
          Explore Other Portals in the PushinPacks Network
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm-md)", flexWrap: "wrap" }}>
          {ALL_PORTALS.map((portal) => (
            <Link
              key={portal.id}
              href={portal.path}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: portal.id === catalog.id ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border: portal.id === catalog.id ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                color: portal.id === catalog.id ? "#ffffff" : "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              {portal.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Catalog Footer */}
      <footer className={styles.footer}>
        <p>
          PushinPacks {catalog.name} Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
