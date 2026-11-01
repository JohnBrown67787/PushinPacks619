"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../app/shared.module.css";
import { IconCart, IconChevronDown, IconCheck } from "./Icons";

const PORTAL_LIST = [
  { id: "hub", name: "All Portals Hub", path: "/" },
  { id: "peptides", name: "Peptides (/peptides)", path: "/peptides" },
  { id: "budcart", name: "Bud'Cart (/budcart)", path: "/budcart" },
  { id: "stocks", name: "Stocks (/stocks)", path: "/stocks" },
  { id: "glock", name: "Glock Precision (/glock)", path: "/glock" },
  { id: "psychedelics", name: "Psychedelics (/psychedelics)", path: "/psychedelics" },
  { id: "pharms", name: "Pharms & Lab (/pharms)", path: "/pharms" },
];

export default function PortalNavbar({ catalog, activeTab, cartCount = 0, onOpenCart }) {
  const portalPath = `/${catalog.slug}`;
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsPortalDropdownOpen(false);
      }
    }
    if (isPortalDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isPortalDropdownOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={styles.navbar} style={{ position: "relative" }}>
      <div className={styles.navLogo}>
        <Link href={portalPath} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit", minWidth: 0 }}>
          <Image
            src="/logo.jpg"
            alt="PushinPacks Logo"
            width={32}
            height={32}
            className={styles.navLogoImg}
            priority
          />
          <span className={styles.navBrand} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            PushinPacks <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>/ {catalog.name}</span>
          </span>
        </Link>
      </div>

      {/* Desktop Portal Navigation Links */}
      <nav className={styles.navLinks}>
        <Link
          href={portalPath}
          className={activeTab === "home" ? styles.navLinkActive : styles.navLink}
        >
          Landing
        </Link>
        <Link
          href={`${portalPath}/products`}
          className={activeTab === "products" ? styles.navLinkActive : styles.navLink}
        >
          Products
        </Link>
        <Link
          href={`${portalPath}/faq`}
          className={activeTab === "faq" ? styles.navLinkActive : styles.navLink}
        >
          FAQs
        </Link>
      </nav>

      {/* Right Actions: Switcher, Cart & Mobile Menu Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Custom Portals Dropdown Switcher */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsPortalDropdownOpen((prev) => !prev)}
            aria-label="Switch Catalog Portal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 10px",
              borderRadius: "8px",
              background: isPortalDropdownOpen ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
              border: isPortalDropdownOpen ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span>Portals</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                transform: isPortalDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <IconChevronDown size={12} color="#a1a1aa" />
            </span>
          </button>

          {isPortalDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "230px",
                background: "#0d0d12",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
                padding: "6px",
                zIndex: 1000,
                backdropFilter: "blur(16px)",
                animation: "fadeIn 0.15s ease-out",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-text-muted)",
                  padding: "6px 10px 4px 10px",
                  fontWeight: 700,
                }}
              >
                Autonomous Portals
              </div>
              {PORTAL_LIST.map((item) => {
                const isCurrent = item.id === catalog.slug;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setIsPortalDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "var(--text-xs)",
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? "#ffffff" : "var(--color-text-secondary)",
                      background: isCurrent ? "rgba(255, 255, 255, 0.08)" : "transparent",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{item.name}</span>
                    {isCurrent && <IconCheck size={13} color="#25D366" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Inquiry Cart Button */}
        <button
          onClick={onOpenCart}
          className={styles.navCta}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            borderRadius: "8px",
          }}
          aria-label="View Inquiry Cart"
        >
          <IconCart size={16} color="var(--color-bg-deep)" />
          <span className="cartLabel">Cart</span>
          {cartCount > 0 && (
            <span
              style={{
                background: "#050507",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "1px 6px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Desktop Express Checkout Link */}
        <Link
          href="/checkout"
          className="desktopOnly"
          style={{
            alignItems: "center",
            padding: "7px 12px",
            borderRadius: "8px",
            background: "var(--color-brand-green)",
            color: "#ffffff",
            fontSize: "12px",
            textDecoration: "none",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(var(--color-brand-green-rgb), 0.3)",
            whiteSpace: "nowrap",
          }}
        >
          Checkout
        </Link>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="mobileOnly"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 10px",
            borderRadius: "8px",
            background: isMobileMenuOpen ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            fontSize: "16px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Slide-Down Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#0a0a0f",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 999,
            boxShadow: "0 16px 32px rgba(0, 0, 0, 0.7)",
          }}
        >
          <Link
            href={portalPath}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              color: activeTab === "home" ? "#ffffff" : "var(--color-text-secondary)",
              background: activeTab === "home" ? "rgba(255, 255, 255, 0.08)" : "transparent",
              fontSize: "14px",
              fontWeight: activeTab === "home" ? 700 : 500,
              textDecoration: "none",
            }}
          >
            Landing Page
          </Link>
          <Link
            href={`${portalPath}/products`}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              color: activeTab === "products" ? "#ffffff" : "var(--color-text-secondary)",
              background: activeTab === "products" ? "rgba(255, 255, 255, 0.08)" : "transparent",
              fontSize: "14px",
              fontWeight: activeTab === "products" ? 700 : 500,
              textDecoration: "none",
            }}
          >
            Browse Products ({catalog.products?.length || 0})
          </Link>
          <Link
            href={`${portalPath}/faq`}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              color: activeTab === "faq" ? "#ffffff" : "var(--color-text-secondary)",
              background: activeTab === "faq" ? "rgba(255, 255, 255, 0.08)" : "transparent",
              fontSize: "14px",
              fontWeight: activeTab === "faq" ? 700 : 500,
              textDecoration: "none",
            }}
          >
            Frequently Asked Questions
          </Link>
          <Link
            href="/checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              color: "#ffffff",
              background: "var(--color-brand-green)",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            Express Checkout →
          </Link>
        </div>
      )}
    </header>
  );
}
