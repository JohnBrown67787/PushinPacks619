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

  return (
    <header className={styles.navbar}>
      <div className={styles.navLogo}>
        <Link href={portalPath} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
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

      {/* Portal Navigation Links */}
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

      {/* Hub Dropdown & Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm-md)" }}>
        {/* Custom Portals Dropdown Switcher */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsPortalDropdownOpen((prev) => !prev)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              background: isPortalDropdownOpen ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
              border: isPortalDropdownOpen ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span>Switch Portal</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                transform: isPortalDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <IconChevronDown size={13} color="currentColor" />
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
                    onMouseEnter={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                      }
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

        <button
          onClick={onOpenCart}
          className={styles.navCta}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <IconCart size={16} color="var(--color-bg-deep)" />
          <span>Inquiry Cart</span>
          {cartCount > 0 && (
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
              {cartCount}
            </span>
          )}
        </button>

        <Link
          href="/checkout"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 14px",
            borderRadius: "8px",
            background: "var(--color-brand-green)",
            color: "#ffffff",
            fontSize: "var(--text-xs)",
            textDecoration: "none",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(var(--color-brand-green-rgb), 0.3)",
            transition: "all 0.2s ease",
          }}
        >
          Express Checkout
        </Link>
      </div>
    </header>
  );
}
