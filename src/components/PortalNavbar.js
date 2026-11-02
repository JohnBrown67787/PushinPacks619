"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PortalNavbar.module.css";
import { IconCart, IconChevronDown, IconCheck, IconTelegram, IconWhatsApp } from "./Icons";

const PORTAL_LIST = [
  { id: "hub", name: "All Portals Hub", path: "/" },
  { id: "peptides", name: "Peptides", path: "/peptides" },
  { id: "budcart", name: "Bud'Cart", path: "/budcart" },
  { id: "stocks", name: "Stocks", path: "/stocks" },
  { id: "glock", name: "Glock Precision", path: "/glock" },
  { id: "psychedelics", name: "Psychedelics", path: "/psychedelics" },
  { id: "pharms", name: "Pharms & Lab", path: "/pharms" },
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* Logo Section */}
          <div className={styles.navLogo}>
            <Link href={portalPath} className={styles.navLogoLink}>
              <Image
                src="/logo.jpg"
                alt="PushinPacks Logo"
                width={30}
                height={30}
                className={styles.navLogoImg}
                priority
              />
              <span className={styles.navBrand}>
                PushinPacks <span className={styles.navBrandSub}>/ {catalog.name}</span>
              </span>
            </Link>
          </div>

          <div className={styles.navSpacer} />

          {/* Desktop/Tablet Nav Links (Visible on >= 960px) */}
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

          {/* Right Actions */}
          <div className={styles.navActions}>
            {/* Desktop Portal Switcher */}
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
                  <IconChevronDown size={12} color="currentColor" />
                </span>
              </button>

              {isPortalDropdownOpen && (
                <div className={styles.portalMenu}>
                  <div className={styles.portalMenuLabel}>Autonomous Divisions</div>
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
                        {isCurrent && <IconCheck size={14} color="#10b981" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Button */}
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

            {/* Desktop Checkout Link (>= 960px) */}
            <Link
              href="/checkout"
              className={styles.checkoutButton}
            >
              Checkout
            </Link>

            {/* Mobile Menu Toggle (< 960px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={styles.mobileMenuToggle}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              data-active={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile App Navigation Drawer (< 960px) */}
      {isMobileMenuOpen && (
        <div
          className={styles.mobileDrawerBackdrop}
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.mobileDrawerContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerBrand}>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={28}
                  height={28}
                  style={{ borderRadius: "6px" }}
                />
                <div>
                  <div className={styles.drawerBrandTitle}>PushinPacks</div>
                  <div className={styles.drawerBrandSub}>{catalog.name} Division</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className={styles.drawerCloseBtn}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionLabel}>Navigation</div>
              <div className={styles.drawerNavList}>
                <Link
                  href={portalPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${styles.drawerNavItem} ${activeTab === "home" ? styles.drawerNavItemActive : ""}`}
                >
                  <span className={styles.drawerNavText}>Landing Overview</span>
                </Link>
                <Link
                  href={`${portalPath}/products`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${styles.drawerNavItem} ${activeTab === "products" ? styles.drawerNavItemActive : ""}`}
                >
                  <span className={styles.drawerNavText}>Browse All Products</span>
                  <span className={styles.drawerNavCount}>{catalog.products?.length || 0}</span>
                </Link>
                <Link
                  href={`${portalPath}/faq`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${styles.drawerNavItem} ${activeTab === "faq" ? styles.drawerNavItemActive : ""}`}
                >
                  <span className={styles.drawerNavText}>FAQs & Protocol Guide</span>
                </Link>
              </div>
            </div>

            {/* Portals Switcher Grid */}
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionLabel}>Switch Division Portal</div>
              <div className={styles.portalGrid}>
                {PORTAL_LIST.map((item) => {
                  const isCurrent = item.id === catalog.slug;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`${styles.portalCard} ${isCurrent ? styles.portalCardActive : ""}`}
                    >
                      <span className={styles.portalCardName}>{item.name}</span>
                      {isCurrent && <span className={styles.portalCardActiveDot} />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Checkout */}
            <div className={styles.drawerFooter}>
              <Link
                href="/checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className={styles.drawerCheckoutBtn}
              >
                <span>Express Checkout</span>
                {cartCount > 0 && <span className={styles.drawerCartPill}>{cartCount} items</span>}
                <span>→</span>
              </Link>

              <div className={styles.drawerContactRow}>
                <a
                  href="https://t.me/+HImHG4wbxOQ5ZGU0?utm_source=chatgpt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.drawerContactBtn}
                >
                  <IconTelegram size={16} />
                  <span>Join Telegram</span>
                </a>
                <a
                  href="https://t.me/packmans619_1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.drawerContactBtn}
                >
                  <span>@packmans619_1</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
