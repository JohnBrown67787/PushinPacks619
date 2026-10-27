import Link from "next/link";
import styles from "../app/shared.module.css";

const ALL_PORTALS = [
  { id: "peptides", name: "Peptides", path: "/peptides" },
  { id: "stocks", name: "Stocks", path: "/stocks" },
  { id: "glock", name: "Glock", path: "/glock" },
  { id: "psychedelics", name: "Psychedelics", path: "/psychedelics" },
  { id: "pharms", name: "Pharms", path: "/pharms" },
  { id: "budcart", name: "Bud'Cart", path: "/budcart" },
];

export default function PortalFooter({ catalog }) {
  const portalPath = `/${catalog.slug}`;

  return (
    <footer style={{ marginTop: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.06)", background: "rgba(5, 5, 7, 0.9)" }}>
      {/* Portals Network Cross-Navigation */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "32px", flexWrap: "wrap", marginBottom: "32px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
              PushinPacks {catalog.name}
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
              {catalog.footerDesc || "Autonomous digital catalog system engineered for precision, certified quality, and discreet fulfillment."}
            </p>
          </div>

          <div>
            <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "var(--space-sm-md)" }}>
              Portal Pages
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "var(--text-sm)" }}>
              <Link href={portalPath} style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
                Landing Page
              </Link>
              <Link href={`${portalPath}/products`} style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
                All Products Catalog
              </Link>
              <Link href={`${portalPath}/faq`} style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
                Frequently Asked Questions
              </Link>
              <Link href="/" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
                Network Command Hub
              </Link>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "var(--space-sm-md)" }}>
              Other Autonomous Portals
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxWidth: "400px" }}>
              {ALL_PORTALS.map((portal) => (
                <Link
                  key={portal.id}
                  href={portal.path}
                  style={{
                    padding: "6px var(--space-sm-md)",
                    borderRadius: "8px",
                    background: portal.id === catalog.id ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                    border: portal.id === catalog.id ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.06)",
                    color: portal.id === catalog.id ? "#ffffff" : "var(--color-text-secondary)",
                    fontSize: "var(--text-xs)",
                    textDecoration: "none",
                  }}
                >
                  {portal.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.04)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}>
          PushinPacks {catalog.name} Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
