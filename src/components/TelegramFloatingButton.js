"use client";

import { usePathname } from "next/navigation";
import { IconTelegram } from "./Icons";

export default function TelegramFloatingButton() {
  const pathname = usePathname();
  const telegramUrl = "https://t.me/+HImHG4wbxOQ5ZGU0?utm_source=chatgpt.com";

  // Do not render on checkout (where payment buttons live) or admin panel
  if (pathname === "/checkout" || pathname?.startsWith("/checkout") || pathname === "/admin" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Telegram group"
      className="telegramFloatingBtn"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9990,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 18px 10px 14px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #0088cc 0%, #00a2ed 100%)",
        color: "#ffffff",
        textDecoration: "none",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "0.2px",
        boxShadow: "0 6px 24px rgba(0, 136, 204, 0.45), 0 2px 8px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        userSelect: "none",
      }}
    >
      {/* Telegram Icon with Pulse Ring */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.18)",
          flexShrink: 0,
        }}
      >
        <IconTelegram size={17} />
      </span>

      {/* Message Text */}
      <span style={{ whiteSpace: "nowrap" }}>Join Group</span>

      {/* Green Online Pulse Indicator */}
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 8px #10b981",
          flexShrink: 0,
        }}
      />
    </a>
  );
}
