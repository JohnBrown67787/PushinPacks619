"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../app/shared.module.css";
import PortalNavbar from "./PortalNavbar";
import PortalFooter from "./PortalFooter";
import CartDrawer from "./CartDrawer";
import {
  IconCheck,
  IconChevronDown,
  IconArrowRight,
  IconGrid,
  IconShield,
} from "./Icons";

export default function FaqView({ catalog }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const portalPath = `/${catalog.slug}`;

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
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
        activeTab="faq"
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: "880px", margin: "0 auto", padding: "64px 32px 56px", width: "100%", textAlign: "center" }}>
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-text-muted)", fontWeight: 600 }}>
              Knowledge Base &amp; Protocol Support
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 auto" }}>
            {catalog.faqHeaderDesc || `Clear technical documentation and verified standards covering formulation purity, storage recommendations, precision tolerances, and dispatch protocols for ${catalog.name}.`}
          </p>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section style={{ maxWidth: "880px", margin: "0 auto", padding: "16px 32px 64px", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm-md)" }}>
          {catalog.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? "rgba(24, 24, 32, 0.85)" : "rgba(18, 18, 24, 0.55)",
                  backdropFilter: "blur(12px)",
                  border: isOpen ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "var(--space-md-lg) 24px",
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "var(--text-base)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ flex: 1 }}>{faq.q}</span>
                  <span
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      color: isOpen ? "#ffffff" : "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconChevronDown size={18} color="currentColor" />
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px var(--space-md-lg)",
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-md)",
                      lineHeight: 1.7,
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-Link Card Banner */}
      <section style={{ maxWidth: "880px", margin: "0 auto", padding: "0 32px 80px", width: "100%" }}>
        <div
          style={{
            background: "rgba(18, 18, 24, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <IconGrid size={18} color="#e4e4e7" />
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", color: "#ffffff", margin: 0 }}>
                {catalog.faqCatalogBannerTitle || "Ready to review verified stock?"}
              </h4>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "16px", lineHeight: 1.6 }}>
              {catalog.faqCatalogBannerDesc || `Browse the complete ${catalog.name} inventory with detailed descriptions, concentrations, and pricing.`}
            </p>
            <Link
              href={`${portalPath}/products`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#ffffff",
                color: "#050507",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "var(--text-sm)",
                textDecoration: "none",
              }}
            >
              <span>Explore Products</span>
              <IconArrowRight size={14} color="#050507" />
            </Link>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <IconShield size={18} color="#e4e4e7" />
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", color: "#ffffff", margin: 0 }}>
                {catalog.faqOrderBannerTitle || "Direct Custom Order Desk"}
              </h4>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "16px", lineHeight: 1.6 }}>
              {catalog.faqOrderBannerDesc || "For institutional volume orders, custom formulation batching, or specialized packaging inquiries."}
            </p>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                cursor: "pointer",
              }}
            >
              <span>Open Inquiry Cart</span>
            </button>
          </div>
        </div>
      </section>

      {/* Portal Footer */}
      <PortalFooter catalog={catalog} />
    </div>
  );
}
