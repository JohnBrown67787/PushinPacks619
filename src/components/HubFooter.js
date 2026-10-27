import Image from "next/image";
import Link from "next/link";
import { IconWhatsApp, IconCashApp, IconVenmo, IconShield } from "./Icons";
import styles from "./HubFooter.module.css";

export default function HubFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerWrapper} aria-label="PushinPacks Hub Footer">
      <div className={styles.footerInner}>
        <div className={styles.mainGrid}>
          {/* Column 1: Brand & Overview */}
          <div className={styles.brandCol}>
            <div className={styles.brandHeader}>
              <Image
                src="/logo.jpg"
                alt="PushinPacks Logo"
                width={36}
                height={36}
                className={styles.brandLogo}
              />
              <span className={styles.brandName}>PUSHINPACKS619</span>
            </div>
            <p className={styles.brandDesc}>
              Autonomous decentralized catalog network engineered for certified product verification, precision hardware specifications, and secure dispatch logistics across independent portals.
            </p>
            <div className={styles.trustBadges}>
              <span className={styles.trustPill}>
                <span className={styles.pillDot} aria-hidden="true" />
                <span>Cold-Chain Packaging</span>
              </span>
              <span className={styles.trustPill}>
                <span className={styles.pillDot} aria-hidden="true" />
                <span>Encrypted Dispatch</span>
              </span>
              <span className={styles.trustPill}>
                <span className={styles.pillDot} aria-hidden="true" />
                <span>Verified COA Lab Data</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className={styles.colTitle}>Quick Links</div>
            <nav className={styles.linkList} aria-label="Quick Links">
              <Link href="/" className={styles.footerLink}>
                Home
              </Link>
              <Link href="/#catalogs" className={styles.footerLink}>
                All Portals Hub
              </Link>
              <Link href="/peptides/products" className={styles.footerLink}>
                Products Catalog
              </Link>
              <Link href="/peptides/faq" className={styles.footerLink}>
                About Us &amp; FAQ
              </Link>
              <Link href="/checkout" className={styles.footerLink}>
                Express Checkout
              </Link>
            </nav>
          </div>

          {/* Column 3: Legal Policies */}
          <div>
            <div className={styles.colTitle}>Legal Policies</div>
            <nav className={styles.linkList} aria-label="Legal Policies">
              <Link href="#disclaimer" className={styles.footerLink}>
                Terms and Conditions
              </Link>
              <Link href="#disclaimer" className={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="#disclaimer" className={styles.footerLink}>
                Product Disclaimer
              </Link>
              <Link href="#disclaimer" className={styles.footerLink}>
                Refund &amp; Return Policy
              </Link>
            </nav>
          </div>

          {/* Column 4: Contact Information & Verified Channels */}
          <div>
            <div className={styles.colTitle}>Contact Information</div>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <div>
                  <div className={styles.contactLabel}>Official Operations Email</div>
                  <a href="mailto:ops@pushinpacks619.internal" className={styles.contactValue}>
                    ops@pushinpacks619.internal
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div>
                  <div className={styles.contactLabel}>Verified Dispatch Phone / WhatsApp</div>
                  <a href="https://wa.me/16195550199" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                    +1 (619) 555-0199
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div>
                  <div className={styles.contactLabel}>Logistics &amp; Hub Location</div>
                  <span className={styles.contactValue} style={{ cursor: "default" }}>
                    Pacific Coast Logistics Hub, San Diego, CA
                  </span>
                </div>
              </div>

              <div>
                <div className={styles.contactLabel} style={{ marginBottom: "6px" }}>Verified Accounts &amp; Desk</div>
                <div className={styles.verifiedAccounts}>
                  <a
                    href="https://wa.me/16195550199"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.accountPill}
                    aria-label="Verified WhatsApp Desk"
                  >
                    <IconWhatsApp size={14} color="#22c55e" />
                    <span>WhatsApp Desk</span>
                  </a>
                  <span className={styles.accountPill} title="Verified Cash App">
                    <IconCashApp size={14} color="#22c55e" />
                    <span>$PushinPacks619</span>
                  </span>
                  <span className={styles.accountPill} title="Verified Venmo Desk">
                    <IconVenmo size={14} color="#22c55e" />
                    <span>@PushinPacks-Desk</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Divider */}
        <div className={styles.bottomDivider}>
          <div>
            (C) {currentYear} PushinPacks619 Network. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
