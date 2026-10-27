"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconChevronDown, IconCheck } from "./Icons";

/**
 * CustomDropdown
 * A fully custom-designed dropdown component adhering to the PushinPacks
 * shining black & grey design language with white primary typography.
 *
 * Props:
 * - value: string | number
 * - onChange: (newValue) => void
 * - options: Array<{ value: string | number, label: string, color?: string, bg?: string, icon?: React.ReactNode }>
 * - placeholder?: string
 * - variant?: "default" | "status" | "scope" | "compact"
 * - style?: React.CSSProperties
 * - disabled?: boolean
 */
export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  variant = "default",
  style = {},
  disabled = false,
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Determine variant trigger styles
  let triggerStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    padding: "9px 14px",
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    transition: "all 0.2s ease",
    width: "100%",
    minHeight: "38px",
  };

  if (variant === "status") {
    const statusBg = selectedOption?.bg || "rgba(255, 255, 255, 0.08)";
    const statusColor = selectedOption?.color || "#ffffff";
    const statusBorder = selectedOption?.borderColor || "rgba(255, 255, 255, 0.18)";

    triggerStyle = {
      ...triggerStyle,
      width: "auto",
      minWidth: "130px",
      padding: "6px var(--space-sm-md)",
      borderRadius: "8px",
      fontSize: "var(--text-2xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.6px",
      background: statusBg,
      color: statusColor,
      border: `1px solid ${statusBorder}`,
      boxShadow: isOpen ? `0 0 12px rgba(255, 255, 255, 0.1)` : "none",
    };
  } else if (variant === "scope") {
    triggerStyle = {
      ...triggerStyle,
      width: "auto",
      minWidth: "210px",
      padding: "9px 16px",
      background: "rgba(255, 255, 255, 0.06)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      fontSize: "var(--text-sm)",
      fontWeight: 600,
    };
  } else if (variant === "compact") {
    triggerStyle = {
      ...triggerStyle,
      width: "auto",
      padding: "5px 10px",
      fontSize: "var(--text-xs)",
      borderRadius: "6px",
    };
  }

  // Hover/Active glow
  if (isOpen) {
    triggerStyle.borderColor = "#ffffff";
    triggerStyle.boxShadow = "0 0 0 2px rgba(255, 255, 255, 0.15)";
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        width: variant === "status" || variant === "scope" || variant === "compact" ? "auto" : "100%",
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={triggerStyle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
            opacity: 0.75,
            flexShrink: 0,
          }}
        >
          <IconChevronDown size={variant === "status" ? 12 : 14} color="currentColor" />
        </span>
      </button>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            minWidth: "100%",
            width: variant === "status" ? "180px" : "max-content",
            maxWidth: "320px",
            background: "#0d0d12",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: "8px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            padding: "6px",
            backdropFilter: "blur(20px)",
            animation: "fadeIn 0.15s ease-out",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: variant === "status" ? "8px 12px" : "10px 14px",
                  borderRadius: "6px",
                  fontSize: variant === "status" ? "12px" : "13px",
                  fontWeight: isSelected ? 700 : 500,
                  color: opt.color || (isSelected ? "#ffffff" : "var(--color-text-secondary)"),
                  background: isSelected ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = opt.color || "var(--color-text-secondary)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                  {opt.icon && <span>{opt.icon}</span>}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {opt.label}
                  </span>
                </div>

                {isSelected && (
                  <span style={{ display: "inline-flex", alignItems: "center", color: "#ffffff", flexShrink: 0 }}>
                    <IconCheck size={14} color="#ffffff" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
