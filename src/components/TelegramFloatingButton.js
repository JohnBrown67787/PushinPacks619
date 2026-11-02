"use client";

import { usePathname } from "next/navigation";
import { IconTelegram } from "./Icons";

export default function TelegramFloatingButton() {
  const pathname = usePathname();
  const telegramUrl = "https://t.me/+HImHG4wbxOQ5ZGU0?utm_source=chatgpt.com";

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
    >
      <span className="telegramIconWrap">
        <IconTelegram size={18} />
      </span>
      <span className="telegramText">Join Group</span>
      <span className="telegramPulseDot" />
    </a>
  );
}
