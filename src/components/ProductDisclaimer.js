import { IconAlertTriangle } from "./Icons";
import styles from "./ProductDisclaimer.module.css";

const NOTICES = [
  {
    title: "Product Depiction & Natural Specifications",
    text: "Product photographs and descriptions illustrate current production batches. Minor cosmetic variations, packaging iterations, or natural coloration may occur across distinct synthesis lots without impacting certified molecular purity or specifications.",
  },
  {
    title: "Dynamic Valuation & Stock Allocations",
    text: "Live market valuations, volumetric availability, and inventory allocations are updated in real time. Unconfirmed quotes or pending reservations are subject to market adjustments prior to confirmed invoice issuance.",
  },
  {
    title: "Supplier Verification & Analytical Standards",
    text: "Authenticity, analytical certificates (COA), and manufacturing warranties must be verified against supplier batch numbers. Verification reports and laboratory assays are accessible upon dispatch.",
  },
  {
    title: "Jurisdictional Compliance & Statutory Regulations",
    text: "Certain specialty categories and chemical compounds may be subject to regional regulations, laboratory permit requirements, or jurisdictional restrictions. Customers are solely responsible for compliance with all applicable local, state, and national laws.",
  },
  {
    title: "Age Limitations & Safe Handling Protocols",
    text: "Purchasers must meet all applicable legal age requirements (21+ where mandated) and possess proper equipment and competency for safe storage, handling, and protocol execution.",
  },
  {
    title: "Discreet Transit, Returns & Liability Terms",
    text: "PushinPacks operates as an independent catalog network. Orders dispatched via express couriers include tamper-evident tracking. Return, refund, and replacement requests must follow documented protocol within 48 hours of delivery receipt.",
  },
];

export default function ProductDisclaimer() {
  return (
    <section id="disclaimer" className={styles.disclaimerBlock} aria-label="Product Regulatory Disclaimer">
      <div className={styles.headerRow}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <IconAlertTriangle size={24} color="#22c55e" />
        </div>
        <div className={styles.headerText}>
          <span className={styles.badge}>Regulatory Notice &amp; Compliance</span>
          <h2 className={styles.title}>Product Disclaimer &amp; Catalog Terms</h2>
        </div>
      </div>

      <div className={styles.noticeGrid}>
        {NOTICES.map((notice, idx) => (
          <div key={idx} className={styles.noticeItem}>
            <div className={styles.noticeTitle}>
              <span className={styles.noticeTitleDot} aria-hidden="true" />
              <span>{notice.title}</span>
            </div>
            <p className={styles.noticeText}>{notice.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
