"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../app/shared.module.css";
import { usePersistedCart } from "../hooks/usePersistedCart";
import PortalNavbar from "./PortalNavbar";
import PortalFooter from "./PortalFooter";
import CartDrawer from "./CartDrawer";
import {
  IconCheck,
  IconSearch,
  IconArrowRight,
  IconHelpCircle,
} from "./Icons";

export default function ProductsView({ catalog }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const {
    cart,
    addToCart: hookAddToCart,
    removeFromCart,
    updateQuantity,
  } = usePersistedCart();

  const portalPath = `/${catalog.slug}`;
  const categories = ["All", ...new Set(catalog.products.map((p) => p.category))];

  const handleCardClick = (productId) => {
    router.push(`${portalPath}/products/${productId}`);
  };

  const filteredProducts = catalog.products.filter((product) => {
    const matchesCat = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const addToCart = (product) => {
    hookAddToCart(product);
    setNotification(`Added ${product.name} to inquiry list`);
    setTimeout(() => setNotification(""), 2800);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
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
        activeTab="products"
        cartCount={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Header Section with Dedicated Background Image */}
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: `url(${catalog.backgroundImage})`,
        }}
      >
        <div className={styles.heroSectionOverlay}></div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "clamp(36px, 6vw, 64px) clamp(14px, 4vw, 32px) clamp(24px, 4vw, 48px)", width: "100%" }}>
        <div style={{ marginBottom: "var(--space-sm-md)" }}>
          <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-text-muted)", fontWeight: 600 }}>
            {catalog.name} Catalog Inventory
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "var(--space-sm-md)", lineHeight: 1.15 }}>
          All {catalog.name} Products
        </h1>
        <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: "var(--color-text-secondary)", maxWidth: "640px", lineHeight: 1.6 }}>
          {catalog.productsHeaderDesc || `Explore our certified stock of ${catalog.products.length} catalog items. Filter by specialized category or search by active specification to assemble your inquiry batch.`}
        </p>

        {/* Search & Filter Bar */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Category Filter Pills (swipeable horizontal list on mobile) */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", maxWidth: "100%", paddingBottom: "4px", WebkitOverflowScrolling: "touch" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "var(--text-sm)",
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  border: selectedCategory === cat ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.08)",
                  background: selectedCategory === cat ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  color: selectedCategory === cat ? "#ffffff" : "var(--color-text-secondary)",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: "200px", maxWidth: "100%" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
              <IconSearch size={16} color="var(--color-text-muted)" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "9px 16px 9px 38px",
                color: "#ffffff",
                fontSize: "var(--text-sm)",
                outline: "none",
              }}
            />
          </div>
        </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px clamp(12px, 3.5vw, 32px) 80px", width: "100%" }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px var(--space-md-lg)", background: "rgba(18, 18, 24, 0.4)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <h3 style={{ fontSize: "var(--text-lg)", color: "#ffffff", marginBottom: "8px" }}>No matching products found</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "16px" }}>
              Try adjusting your search criteria or select &quot;All&quot; categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleCardClick(product.id)}
                style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
              >
                {product.image && (
                  <div className={styles.productImageWrap}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      loading={idx < 4 ? "eager" : "lazy"}
                      quality={70}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      style={{ objectFit: "contain", background: "#ffffff" }}
                    />
                  </div>
                )}

                <h3
                  className={styles.productName}
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    marginBottom: "6px",
                    lineHeight: 1.35,
                    color: "#ffffff"
                  }}
                >
                  {product.name}
                </h3>

                {product.description && (
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.4,
                      marginBottom: "14px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={product.description}
                  >
                    {product.description}
                  </p>
                )}

                <div className={styles.productFooter} style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className={styles.productPrice} style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "#ffffff" }}>
                    {product.price}
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
        )}
      </section>

      {/* FAQ Banner Link */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px 64px", width: "100%" }}>
        <div
          style={{
            background: "rgba(18, 18, 24, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-md-lg)",
          }}
        >
          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", color: "#ffffff", marginBottom: "4px" }}>
              {catalog.productsFaqBannerTitle || "Questions about testing, handling, or fulfillment?"}
            </h4>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              {catalog.productsFaqBannerDesc || `Read our technical documentation and frequently asked questions for ${catalog.name}.`}
            </p>
          </div>
          <Link
            href={`${portalPath}/faq`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "#ffffff",
              color: "#050507",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              textDecoration: "none",
            }}
          >
            <IconHelpCircle size={16} color="#050507" />
            <span>View {catalog.name} FAQs</span>
            <IconArrowRight size={14} color="#050507" />
          </Link>
        </div>
      </section>

      {/* Portal Footer */}
      <PortalFooter catalog={catalog} />
    </div>
  );
}
