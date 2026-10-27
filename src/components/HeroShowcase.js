"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./HeroShowcase.module.css";
import { IconRefresh } from "./Icons";

// Animated hero visual: the image card spins on its vertical axis, settles back
// into place, then reveals callout labels pinned to points on the product.
export default function HeroShowcase({ catalog, footer }) {
  const [runId, setRunId] = useState(0);
  const tiltRef = useRef(null);
  const callouts = catalog.heroCallouts || [];
  const product = catalog.products[0];

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse" || !tiltRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.style.setProperty("--ry", `${px * 8}deg`);
    tiltRef.current.style.setProperty("--rx", `${py * -8}deg`);
  };

  const handlePointerLeave = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.setProperty("--ry", "0deg");
    tiltRef.current.style.setProperty("--rx", "0deg");
  };

  return (
    <div
      className={styles.stage}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--callout-count": callouts.length }}
    >
      <div className={styles.floor} key={`floor-${runId}`} aria-hidden="true"></div>

      <div className={styles.tilt} ref={tiltRef}>
        <div className={styles.ring} aria-hidden="true"></div>

        <div className={styles.spinner} key={`spin-${runId}`}>
          <div className={`${styles.face} ${styles.front}`}>
            <Image
              src={catalog.heroImage}
              alt={catalog.id === "stocks" ? "Raw Colombian Fishscale Cocaine" : (product?.name || catalog.name)}
              width={480}
              height={480}
              className={styles.image}
              priority
            />
            {catalog.id === "stocks" && (
              <div className={styles.frontBadge}>
                <span className={styles.frontBadgeDot} aria-hidden="true"></span>
                <span>Uncut Cocaine Reserve</span>
              </div>
            )}
            {catalog.id === "psychedelics" && (
              <div className={styles.frontBadge}>
                <span className={styles.frontBadgeDot} aria-hidden="true"></span>
                <span>Sacred Botanical Reserve</span>
              </div>
            )}
            <span className={styles.sheen} aria-hidden="true"></span>
          </div>

          <div className={`${styles.face} ${styles.back}`} aria-hidden="true">
            <div className={styles.backLabel}>
              {catalog.id === "stocks" ? "Laboratory Assay Report" : (catalog.id === "psychedelics" ? "Sacred Cultivation Assay" : "Certificate of Analysis")}
            </div>
            <div className={styles.backValue}>
              {catalog.id === "stocks" ? "97.4%" : (catalog.id === "psychedelics" ? "2.2%+" : product?.purity)}
            </div>
            <div className={styles.backCaption}>
              {catalog.id === "stocks" ? "Pure Cocaine Alkaloid (GC-MS Assay)" : (catalog.id === "psychedelics" ? "Active Bioactive Alkaloids" : "HPLC Purity")}
            </div>
            <div className={styles.backRule}></div>
            <div className={styles.backName}>
              {catalog.id === "stocks" ? "Raw Colombian Fishscale Cocaine" : (catalog.id === "psychedelics" ? "Golden Prime Sacred Specimen" : product?.name)}
            </div>
            <div className={styles.backSpec}>
              {catalog.id === "stocks" ? "Batch #202600 · Uncut Direct Import" : (catalog.id === "psychedelics" ? "Batch #2026-SACRED · Cold Cured Harvest" : product?.spec)}
            </div>
          </div>
        </div>

        <ul className={styles.callouts} key={`callouts-${runId}`} aria-label="Product highlights">
          {callouts.map((c, i) => (
            <li
              key={c.id}
              className={`${styles.callout} ${c.side === "left" ? styles.left : styles.right}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, "--x": c.x, "--i": i }}
            >
              <span className={styles.dot} aria-hidden="true"></span>
              <span className={styles.line} aria-hidden="true"></span>
              <span className={styles.pill}>
                <span className={styles.pillTitle}>
                  <span className={styles.pillIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.title}
                </span>
                <span className={styles.pillDetail}>{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.replay}
          key={`replay-${runId}`}
          onClick={() => setRunId((n) => n + 1)}
          aria-label="Replay animation"
        >
          <IconRefresh size={16} />
        </button>
      </div>

      {footer && (
        <div className={styles.footer} key={`footer-${runId}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
