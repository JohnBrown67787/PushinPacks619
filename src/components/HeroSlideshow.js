"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./HeroSlideshow.module.css";

const SLIDES = [
  {
    src: "/images/slideshow/photo_1682@19-06-2026_16-15-24.jpg",
    alt: "Botanical Extracts and Live Terpene Distillates",
    tag: "Bud'Cart & Disposable",
  },
  {
    src: "/images/slideshow/photo_51@20-05-2026_12-09-51.jpg",
    alt: "Lyophilized Bio-Peptides Certified Synthesis",
    tag: "Peptides Synthesis",
  },
  {
    src: "/images/slideshow/photo_59@20-05-2026_12-11-05.jpg",
    alt: "Custom CNC Precision Slides and Match Hardware",
    tag: "Glock Precision Hardware",
  },
  {
    src: "/images/slideshow/photo_6375@08-10-2026_21-17-41.jpg",
    alt: "Pharmaceutical Analytical Compounds and Formulations",
    tag: "Pharms & Lab Solutions",
  },
  {
    src: "/images/slideshow/photo_854@04-06-2026_23-46-03.jpg",
    alt: "Master Kilo Bricks and Direct Imports",
    tag: "Stocks Reserve",
  },
  {
    src: "/images/slideshow/photo_423@28-05-2026_16-25-59.jpg",
    alt: "Dual-Airflow Ceramic Core Hardware",
    tag: "Vaporizer Engineering",
  },
  {
    src: "/images/slideshow/photo_1830@20-06-2026_17-27-00.jpg",
    alt: "Subcutaneous Peptide Injection Systems",
    tag: "Clinical Synthesis",
  },
  {
    src: "/images/slideshow/photo_4180@07-08-2026_16-55-31.jpg",
    alt: "Pure High-Concentration Lyophilized Vials",
    tag: "Laboratory Standards",
  },
  {
    src: "/images/slideshow/photo_68@20-05-2026_12-12-25.jpg",
    alt: "Tactical and Match-Grade Precision Hardware",
    tag: "Machined Steel Engineering",
  },
  {
    src: "/images/slideshow/photo_1810@20-06-2026_17-08-56.jpg",
    alt: "High Purity Pure Crystalline Formulations",
    tag: "Direct Import Reserve",
  },
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className={styles.heroContainer} aria-label="PushinPacks Hero Slideshow">
      {/* Background Slides Track */}
      <div className={styles.slideTrack}>
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.src}
            className={`${styles.slideItem} ${idx === currentIndex ? styles.slideActive : ""}`}
            aria-hidden={idx !== currentIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={styles.slideImage}
            />
          </div>
        ))}
      </div>

      {/* Dark Vignettes & Contrast Overlays */}
      <div className={styles.darkOverlay} />
      <div className={styles.topVignette} />
      <div className={styles.bottomVignette} />

      {/* Hero Foreground Content */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.heroTitle}>
          PushinPacks <span className={styles.gradientNetwork}>Network</span>
        </h1>

        <p className={styles.heroDescription}>
          Direct-access private reserve network engineered for verified inventory procurement. Sourcing pharmaceutical-grade 99.8% research peptides, direct-import raw Colombian fishscale stocks, custom match-grade Glock builds, sacred organic botanical cultivations, factory-sealed prescription pharmaceuticals, and rechargeable liquid diamond vaporizers with discreet cold-chain dispatch.
        </p>

        {/* Slideshow Navigation Indicators */}
        <div className={styles.indicatorsContainer} role="tablist" aria-label="Slideshow Controls">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Slide ${idx + 1}: ${slide.tag}`}
              onClick={() => setCurrentIndex(idx)}
              className={`${styles.indicatorDot} ${idx === currentIndex ? styles.indicatorActive : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
