"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PortalNavbar.module.css";
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

  // Close mobile menu when menu items are clicked or on large screens
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={styles.navbar}>
      {/* Navbar Container: Uses fluid layout with auto-wrapping */}
      <div className={styles.navbarInner}>
        {/* Logo Section: Shrinks smoothly as space decreases */}
        <div className={styles.navLogo}>
          <Link href={portalPath} className={styles.navLogoLink}>
            <Image
              src="/logo.jpg"
              alt="PushinPacks Logo"
              width={32}
              height={32}
              className={styles.navLogoImg}
              priority
            />
            <span className={styles.navBrand}>
              PushinPacks <span className={styles.navBrandSub}>/ {catalog.name}</span>
            </span>
          </Link>
        </div>

        {/* Spacer: Grows to push right items to the edge */}
        <div className={styles.navSpacer} />

        {/* Main Navigation Links: Hidden on small screens, shown on larger ones */}
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

        {/* Right Actions: Portals, Cart, Checkout, Mobile Toggle */}
        <div className={styles.navActions}>
          {/* Portal Switcher: Scales down label on mobile */}
          <div ref={dropdownRef} className={styles.portalDropdown}>
            <button
              type="button"
              onClick={() => setIsPortalDropdownOpen((prev) => !prev)}
              aria-label="Switch Catalog Portal"
              className={styles.portalButton}
              data-active={isPortalDropdownOpen}
            >
              <span className={styles.portalLabel}>Portals</span>
              <span className={styles.portalChevron} data-active={isPortalDropdownOpen}>
                <IconChevronDown size={12} color="#a1a1aa" />
              </span>
            </button>

            {isPortalDropdownOpen && (
              <div className={styles.portalMenu}>
                <div className={styles.portalMenuLabel}>Autonomous Portals</div>
                {PORTAL_LIST.map((item) => {
                  const isCurrent = item.id === catalog.slug;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setIsPortalDropdownOpen(false)}
                      className={styles.portalMenuItem}
                      data-active={isCurrent}
                    >
                      <span>{item.name}</span>
                      {isCurrent && <IconCheck size={13} color="#25D366" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Button: Icon + label shrinks to icon on small screens */}
          <button
            onClick={onOpenCart}
            className={styles.cartButton}
            aria-label="View Inquiry Cart"
          >
            <IconCart size={16} color="var(--color-bg-deep)" />
            <span className={styles.cartLabel}>Cart</span>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Checkout Link: Hidden on small screens */}
          <Link
            href="/checkout"
            className={styles.checkoutButton}
          >
            Checkout
          </Link>

          {/* Mobile Menu Toggle: Only visible on small screens */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={styles.mobileMenuToggle}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            data-active={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu: Slides down when toggled */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            href={portalPath}
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileMenuItem}
            data-active={activeTab === "home"}
          >
            Landing Page
          </Link>
          <Link
            href={`${portalPath}/products`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileMenuItem}
            data-active={activeTab === "products"}
          >
            Browse Products ({catalog.products?.length || 0})
          </Link>
          <Link
            href={`${portalPath}/faq`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileMenuItem}
            data-active={activeTab === "faq"}
          >
            Frequently Asked Questions
          </Link>
          <Link
            href="/checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileCheckout}
          >
            Express Checkout →
          </Link>
        </div>
      )}
    </header>
  );
}
