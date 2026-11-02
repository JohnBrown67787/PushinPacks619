"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconTelegram } from "./Icons";

export default function TelegramFloatingButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const telegramUrl = "https://t.me/+HImHG4wbxOQ5ZGU0?utm_source=chatgpt.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR hydration mismatches by rendering only after client mount
  if (!mounted) {
    return null;
  }

  // Do not render on checkout (where payment buttons live) or admin panel
  if (
    pathname === "/checkout" ||
    pathname?.startsWith("/checkout") ||
    pathname === "/admin" ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Telegram group"
      className="telegramFloatingBtn"
      suppressHydrationWarning
    >
      <span className="telegramIconWrap">
        <IconTelegram size={18} />
      </span>
      <span className="telegramText">Join Group</span>
      <span className="telegramPulseDot" />
    </a>
  );
}

