"use client";

import Image from "next/image";
import { IconTrash, IconCheck } from "./Icons";

export default function CartDrawer({ isOpen, onClose, cart = [], updateQuantity, removeFromCart, onCheckout }) {
  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + (item.qty || item.quantity || 1), 0);

  const handleCheckoutClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Serialize items to localStorage for /checkout
    if (cart && cart.length > 0) {
      const formatted = cart.map((item) => {
        const numericPrice = typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 45
          : (Number(item.price) || 45);
        return {
          id: item.id || `prod_${Date.now()}`,
          name: item.name || item.title || "Selected Item",
          price: numericPrice,
          quantity: item.qty || item.quantity || 1,
          image: item.image || item.photo || "",
          category: item.category || "",
        };
      });
      try {
        localStorage.setItem("pushinpacks_cart", JSON.stringify(formatted));
      } catch (err) {
        console.error("Failed to save cart to localStorage", err);
      }
    }

    if (onClose) onClose();

    // 2. Call onCheckout callback if provided
    if (onCheckout && typeof onCheckout === "function") {
      try {
        onCheckout();
      } catch (err) {
        console.warn("onCheckout error:", err);
      }
    }

    // 3. Guaranteed client redirection to checkout page
    if (typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  return (
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
      onClick={onClose}
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
            onClick={onClose}
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
              onClick={onClose}
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
                  {item.image && (
                    <div style={{ position: "relative", width: "42px", height: "42px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, marginRight: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                      <Image src={item.image} alt={item.name} fill sizes="42px" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, paddingRight: "8px" }}>
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
                Order details are verified and coordinated directly with our dispatch desk on WhatsApp.
              </p>
              <button
                type="button"
                id="proceed-to-checkout-btn"
                onClick={handleCheckoutClick}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "var(--color-brand-green)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 12px rgba(var(--color-brand-green-rgb), 0.35)",
                  transition: "background 0.15s ease",
                }}
              >
                <IconCheck size={18} color="#ffffff" />
                <span>Proceed to Express Checkout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
