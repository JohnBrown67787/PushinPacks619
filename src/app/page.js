import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import {
  IconMicroscope,
  IconChart,
  IconGear,
  IconSparkles,
  IconPill,
  IconVape,
  IconArrowRight,
} from "../components/Icons";
import HeroSlideshow from "../components/HeroSlideshow";
import ProductDisclaimer from "../components/ProductDisclaimer";
import HubFooter from "../components/HubFooter";

const PORTALS = [
  {
    id: "peptides",
    name: "Peptides",
    path: "/peptides",
    badge: "99.8% HPLC Pure",
    desc: "99.8% HPLC-certified research peptides, Alluvi subcutaneous injection devices, and Tirzepatide/Retatrutide reserves.",
    IconComponent: IconMicroscope,
  },
  {
    id: "stocks",
    name: "Stocks",
    path: "/stocks",
    badge: "97%+ Fishscale",
    desc: "Direct-import Colombian, Peruvian, and Bolivian uncut raw fishscale flake, 1000g master kilo bricks, and crystal lavada.",
    IconComponent: IconChart,
  },
  {
    id: "glock",
    name: "Glock Precision",
    path: "/glock",
    badge: "CNC Match Grade",
    desc: "Match-grade Glock 17/19/34 MOS builds, CNC skeletonized 17-4 slides, Trijicon RMR optics, and 33rd stick magazines.",
    IconComponent: IconGear,
  },
  {
    id: "psychedelics",
    name: "Psychedelics",
    path: "/psychedelics",
    badge: "Organic Harvest",
    desc: "Organic dried Albino Penis Envy and Golden Teacher caps, 4000mg PolkaDot Belgian chocolate bars, and microdose edibles.",
    IconComponent: IconSparkles,
  },
  {
    id: "pharms",
    name: "Pharms & Lab",
    path: "/pharms",
    badge: "Factory Sealed",
    desc: "Factory-sealed Farmapram 2mg cartons, Pfizer Xanax XR bottles, and authentic 16oz promethazine codeine solution pints.",
    IconComponent: IconPill,
  },
  {
    id: "budcart",
    name: "Bud'Cart & Disposable",
    path: "/budcart",
    badge: "Ceramic Core",
    desc: "Rechargeable 2.0g liquid diamond disposables, Clean Carts, Muha Meds live resin, and full ceramic core vape pods.",
    IconComponent: IconVape,
  },
];

export const metadata = {
  title: "PushinPacks Network . All Portals Hub",
  description: "Autonomous decentralized catalog network engineered for certified product verification, precision hardware specifications, and secure dispatch logistics across independent portals.",
};

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Top Header Navigation */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.navLogo} aria-label="PushinPacks619 Home">
          <Image
            src="/logo.jpg"
            alt="PushinPacks Logo"
            width={38}
            height={38}
            className={styles.navLogoImg}
            priority
          />
          <span className={styles.navBrand}>PUSHINPACKS619</span>
        </Link>

        <div className={styles.navActions}>
          <Link
            href="/checkout"
            className={styles.checkoutBtn}
            aria-label="Express Checkout"
          >
            Express Checkout
          </Link>
          <Link
            href="/admin"
            className={styles.adminBtn}
            aria-label="Admin Console"
          >
            Admin Console
          </Link>
        </div>
      </header>

      {/* Hero Section with Automatic Background Slideshow */}
      <HeroSlideshow />

      {/* Catalog Hub Grid */}
      <section id="catalogs" className={styles.catalogSection} aria-label="Available Independent Catalogs">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeadingGroup}>
            <div className={styles.sectionLabel}>
              <span className={styles.sectionLabelDot} aria-hidden="true" />
              <span>AVAILABLE INDEPENDENT CATALOGS</span>
            </div>
            <p className={styles.sectionSubtitle}>
              Select a dedicated private reserve portal below. From 99.8% HPLC-certified research peptides and direct-import raw fishscale bricks to tactical match-grade Glock hardware, sacred organic harvests, sealed pharmaceutical formulations, and liquid diamond disposables, each autonomous division features verified inventory, laboratory assays, and encrypted checkout.
            </p>
          </div>
        </div>

        <div className={styles.catalogGrid}>
          {PORTALS.map((portal) => {
            const Icon = portal.IconComponent;
            return (
              <Link
                key={portal.id}
                href={portal.path}
                className={styles.catalogCard}
                aria-label={`Open ${portal.name} Catalog`}
              >
                <div className={styles.catalogThumb}>
                  <Image
                    src={`/images/portals/${portal.id}.jpg`}
                    alt={`${portal.name} Thumbnail`}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover" }}
                    className={styles.catalogThumbImg}
                  />
                </div>
                <div className={styles.catalogInfo}>
                  <div className={styles.titleRow}>
                    <h2 className={styles.catalogName}>
                      {portal.name}
                    </h2>
                    <span className={styles.catalogBadge}>
                      {portal.badge}
                    </span>
                  </div>
                  <p className={styles.catalogDesc}>{portal.desc}</p>
                </div>
                <div className={styles.catalogArrow} aria-hidden="true">
                  <IconArrowRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Large Product Disclaimer Block */}
      <ProductDisclaimer />

      {/* Multi-Column Professional Hub Footer */}
      <HubFooter />
    </div>
  );
}
