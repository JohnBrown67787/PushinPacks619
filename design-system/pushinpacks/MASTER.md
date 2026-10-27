# PushinPacks Design System (Master)

The single reference for color, type, spacing and related values used across the PushinPacks site. Page-specific overrides, if any are added later, go in `design-system/pushinpacks/pages/<page>.md` and take precedence over this file for that page.

- **Source of truth for tokens:** `src/app/globals.css` (`:root` block)
- **Audit date:** 2026-10-23, covering all 55 CSS and JS files in `src/`
- **Theme:** dark only. Near-black backgrounds, white at varying opacity for surfaces and borders, zinc-grey text, one green brand accent.

## How to use this file

1. Use a `var(--token)` whenever a token exists. Do not hardcode a hex or pixel value that a token already covers.
2. Values listed under **"In use, not yet tokenized"** are part of the current visual language and are fine to reuse, but should be turned into tokens (see [Cleanup backlog](#cleanup-backlog)).
3. Values listed as **"Avoid"** are one-off drift. Do not introduce new uses.

---

## 1. Color

### 1.1 Backgrounds and surfaces (tokens)

| Token | Value | Use |
|---|---|---|
| `--color-bg-deep` | `#050507` | Page background, text on white buttons |
| `--color-bg-primary` | `#0a0a0f` | Primary section background |
| `--color-bg-secondary` | `#111118` | Secondary section background |
| `--color-bg-card` | `rgba(18, 18, 24, 0.65)` | Glass cards |
| `--color-bg-card-hover` | `rgba(24, 24, 32, 0.8)` | Glass card hover |
| `--color-bg-elevated` | `rgba(30, 30, 38, 0.6)` | Elevated panels |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.04)` | Badges, ghost button hover |

**In use, not yet tokenized**

| Value | Uses | Use |
|---|---|---|
| `#0d0d12` | 12 | Solid panels: dropdown menus, `<option>`, cart drawer, modals |
| `rgba(20, 20, 26, 0.95)` | 5 | Near-opaque overlays |
| `rgba(5, 5, 7, 0.6 to 1)` | 7 | Hero image scrims (gradients over `--color-bg-deep`) |
| `rgba(0, 0, 0, 0.5 to 0.85)` | ~18 | Modal backdrops and shadows |

**Avoid:** `#14141b`, `#09090f`, `rgba(10,10,15,0.85)`, `rgba(12,12,17,0.7)`, and the `rgba(18,18,24,x)` variants at 0.4, 0.5, 0.55, 0.6, 0.75 and 0.8. Use `--color-bg-card` / `--color-bg-card-hover` or `#0d0d12` instead.

### 1.2 Borders (tokens)

| Token | Value |
|---|---|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` |
| `--color-border-default` | `rgba(255, 255, 255, 0.08)` |
| `--color-border-hover` | `rgba(255, 255, 255, 0.15)` |
| `--color-border-active` | `rgba(255, 255, 255, 0.2)` |

The `.glass-card` pattern uses `--color-border-default` on all sides and `--color-border-hover` on the top edge for a lit-from-above look.

### 1.3 White opacity layers

White over a dark background is the main way surfaces, fills and borders are built. Current usage counts:

| Opacity | Uses | | Opacity | Uses |
|---|---|---|---|---|
| 0.02 | 16 | | 0.10 | 29 |
| 0.03 | 15 | | 0.12 | 20 |
| 0.04 | 27 | | 0.15 | 21 |
| 0.05 | 24 | | 0.20 | 7 |
| 0.06 | 42 | | 0.25 | 9 |
| 0.08 | **59** | | 0.30 | 4 |

**Preferred steps:** 0.02, 0.04, 0.06, 0.08, 0.10, 0.15, 0.20, 0.25.
**Avoid:** 0.015, 0.025, 0.035, 0.07, 0.16, 0.18. Round to the nearest preferred step.

### 1.4 Text (tokens)

| Token | Value | Use |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Headings, primary text, white button fill |
| `--color-text-secondary` | `#d4d4d8` | Body copy, badge text |
| `--color-text-muted` | `#a1a1aa` | Supporting text, section labels (most-used token, 132 uses) |
| `--color-text-dim` | `#71717a` | Captions, disabled, metadata |

**In use, not yet tokenized:** `#e4e4e7` (12 uses) for light text on the landing, catalog and FAQ pages. It sits between primary and secondary. `#f4f4f5` appears once.

**Note:** `#ffffff` is hardcoded 180 times. Use `var(--color-text-primary)` (or `--color-accent` when it is acting as an accent).

### 1.5 Accent

| Token | Value |
|---|---|
| `--color-accent` | `#ffffff` |
| `--color-accent-glow` | `rgba(255, 255, 255, 0.2)` |

The token accent is white. In practice the site's only color accent is green:

**Brand green** (tokens: `--color-brand-green`, `-hover`, `-dark`, `-rgb`)

| Value | Uses | Use |
|---|---|---|
| `#25D366` | 34 | Primary action and confirmation color: checkout, cart drawer, navbar, home, admin |
| `#1ebd5a` | 2 | Green hover |
| `#15803d` | 2 | Green pressed / dark |
| `rgba(37, 211, 102, 0.08 to 0.5)` | ~18 | Green tints for fills, borders and glows |

### 1.6 Status colors (tokens: `--color-{success,warning,error}`, `-text`, `-rgb`; `--color-info-text`, `--color-info-rgb`)

Used mainly in the admin dashboard, checkout and order states. Pattern: a light text color on a 0.12 to 0.15 alpha fill with a 0.25 to 0.35 alpha border of the base color.

| Status | Text / icon | Base for fills and borders |
|---|---|---|
| Success | `#6ee7b7`, `#4ade80`, `#10b981` | `rgba(16, 185, 129, x)`, `rgba(34, 197, 94, x)` |
| Warning | `#fcd34d`, `#fbbf24` | `rgba(245, 158, 11, x)` |
| Error | `#fca5a5`, `#f87171`, `#ef4444` | `rgba(239, 68, 68, x)` |
| Info | `#93c5fd` | `rgba(59, 130, 246, x)` |
| Neutral | `#94a3b8`, `#a1a1aa` | `rgba(113, 113, 122, x)` |
| Admin extra: purple | `#d8b4fe` | `rgba(168, 85, 247, x)` |
| Admin extra: cyan | `#67e8f9` | `rgba(6, 182, 212, x)` |

`#10b981` also appears as an "in stock" / verified indicator in the catalog, products, FAQ and landing views.

### 1.7 Payment brand colors

Used only for payment method icons (`src/components/Icons.js`, `src/app/checkout/page.js`). Do not use them anywhere else.

| Brand | Color |
|---|---|
| Bitcoin | `#F7931A` |
| Cash App | `#00D632` |
| Zelle | `#7414CA` |
| PayPal | `#003087`, `#0079c1`, `#00457c` |
| Venmo | `#008CFF` |

---

## 2. Typography

### 2.1 Font pairing

| Role | Token | Family | Defaults |
|---|---|---|---|
| Headings (`h1` to `h6`) | `--font-heading` | **Outfit** | weight 700, line-height 1.15, letter-spacing -0.02em |
| Body | `--font-body` | **Inter** | 16px, line-height 1.6 |

Fallback for both is `sans-serif`. Available weights: 300 to 900.

**Other families in use (avoid adding more):**
- `ui-monospace, monospace`: one green code-style label.
- System stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`: one place.

**Known issue:** fonts are loaded twice, by `next/font/google` in `src/app/layout.js` (exposed as `--font-inter` and `--font-outfit`) and by a Google Fonts `@import` in `globals.css`. The tokens use the plain family names, so the `next/font` copies are unused. See [Cleanup backlog](#cleanup-backlog).

### 2.2 Type scale (tokens `--text-2xs` to `--text-3xl` cover 11 to 28px)

| Size | Uses | Role |
|---|---|---|
| `clamp(2.5rem, 6vw, 4rem)` | 1 | Home hero title |
| `clamp(2.5rem, 5vw, 3.5rem)` | 1 | Catalog hero title |
| `3rem` | 6 | Storefront page titles (`*/page.module.css`) |
| `clamp(2rem, 4vw, 3rem)` | 2 | FAQ and Products page titles |
| `clamp(1.75rem, 3.5vw, 2.5rem)` | 1 | Section titles |
| 28px | 5 | Large subheadings, stat values |
| 24px | 3 | Subheadings |
| 20px | 13 | Card and panel titles |
| 18px | 14 | Card titles |
| 16px | 15 | Small titles, body |
| 15px | 16 | Compact titles (headings font) |
| 14px | 29 | Buttons, body copy |
| **13px** | 77 | Secondary text, inputs, selects |
| **12px** | 81 | Labels, metadata |
| **11px** | 50 | Badges, all-caps labels |
| 10px | 3 | Tiny tags |

`1.25rem` (20px) is used for storefront subtitles.

**Recommended scale:** 11, 12, 13, 14, 16, 18, 20, 24, 28 px plus the hero clamps above.
**Avoid:** 10px (below readable minimum), 15px, 17px, 22px, 26px. Round to the nearest step on the recommended scale.

### 2.3 Weights

| Weight | Uses | Role |
|---|---|---|
| 900 | 1 | Avoid |
| 800 | 28 | Page titles, hero, prices |
| 700 | 75 | Headings, active states |
| 600 | 73 | Buttons, badges, labels |
| 500 | 12 | Ghost buttons, inactive tabs |
| 400 | 2 | Body (default) |

### 2.4 Line height

| Value | Role |
|---|---|
| 1.05 to 1.15 | Headings and hero titles |
| 1.4 | Compact UI text |
| 1.5 | Body in cards |
| 1.6 | Body default (`body`) |
| 1.7 | Long-form copy (FAQ answers) |

### 2.5 Letter spacing

| Value | Role |
|---|---|
| -0.04em to -0.01em | Headings (default -0.02em) |
| 0.5px to 1px | All-caps small labels (1px is the most common, 28 uses) |
| 1.5px | `.badge` |
| 2px | `.section-label` |

All-caps text is always paired with positive letter spacing and weight 600 or more.

---

## 3. Spacing

### 3.1 Scale (tokens)

| Token | Desktop | Below 768px |
|---|---|---|
| `--space-xs` | 4px | 4px |
| `--space-sm` | 8px | 8px |
| `--space-sm-md` | 12px | 12px |
| `--space-md` | 16px | 16px |
| `--space-md-lg` | 20px | 20px |
| `--space-lg` | 24px | 16px |
| `--space-xl` | 32px | 24px |
| `--space-2xl` | 48px | 32px |
| `--space-3xl` | 64px | 48px |
| `--space-4xl` | 96px | 64px |

### 3.2 Actual usage

The tokens are used only 7 times. Padding, margin and gap are almost all hardcoded. Frequency of values:

| Value | Uses | On scale? |
|---|---|---|
| 8px | 92 | yes (`sm`) |
| 16px | 84 | yes (`md`) |
| 12px | 76 | **no** |
| 10px | 64 | **no** |
| 20px | 57 | **no** |
| 6px | 52 | **no** |
| 24px | 51 | yes (`lg`) |
| 4px | 48 | yes (`xs`) |
| 14px | 45 | **no** |
| 32px | 33 | yes (`xl`) |
| 2px | 14 | no |
| 18px | 13 | no |
| 28px | 11 | no |
| 40px | 9 | no |
| 80px | 8 | no |
| 48px | 7 | yes (`2xl`) |
| 64px | 6 | yes (`3xl`) |

Rare values (avoid): 3, 5, 7, 9, 11, 22, 34, 36, 50, 56, 60, 100px.

**Effective rhythm:** a 2/4px grid. Small UI (badges, inputs, buttons, list rows) uses 4, 6, 8, 10, 12, 14. Layout uses 16, 20, 24, 32, 48, 64, 80.

**Recommended additions to the token scale:** `6px`, `12px`, `20px`, `40px`, `80px`. For new code, prefer 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 and avoid 10, 14 and 18.

### 3.3 Common component padding

| Component | Padding |
|---|---|
| `.btn-primary`, `.btn-ghost` | 12px 24px |
| `.badge` | 6px 14px |
| `select` | 8px 34px 8px 12px |
| `.section` side gutter | `--space-lg` (24px, 16px on mobile) |
| `.divider` vertical margin | `--space-3xl` |

---

## 4. Radius

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 8px | Cards, panels |
| `--radius-button` | 8px | Buttons, inputs, selects |
| `--radius-badge` | 20px | Badges, pills |
| `--radius-full` | 9999px | Fully round |

**In use:** 8px (105 uses, mostly hardcoded), 6px (13), 4px (13), 20px (11), 50% (10, for circles), 12px (3), 10px (2), 3px (scrollbar thumb).

8px is the dominant radius. Use 4px and 6px for small inner elements (tags, inner chips), 20px for pills, and 50% for dots and avatars.

---

## 5. Layout

- **Content width:** `.section` is `max-width: 1200px`, centered, with `--space-lg` side padding. 1200px appears 15 times and is the site standard.
- **Narrow containers in use:** 880px (FAQ and long text), 640, 580, 560, 520, 480, 440, 420, 400, 380, 360, 320px (modals, drawers, forms).
- **Breakpoints in use:** 480 (max), 640 (min), 768 (max), 900 (max), 1024 (min). The token overrides switch at **768px**.
  - Recommended standard: 480, 768, 1024. Avoid adding 640 and 900.

---

## 6. Elevation and effects

| Token | Value |
|---|---|
| `--shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.4)` |
| `--shadow-card-hover` | `0 8px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.02)` |
| `--shadow-elevated` | `0 20px 60px rgba(0, 0, 0, 0.5)` |
| `--shadow-glow` | `0 0 40px rgba(255, 255, 255, 0.03)` |

- **Glass:** `backdrop-filter: blur(16px)` on cards, `blur(8px)` on badges.
- **Ambient background:** `body::before` layers three radial gradients (`rgba(40,40,50,0.3)`, `rgba(30,30,40,0.3)`, `rgba(20,20,28,0.2)`).
- **Primary button hover glow:** `0 0 20px rgba(255, 255, 255, 0.15)`.
- **Focus (select):** border `#ffffff` plus `0 0 0 2px rgba(255, 255, 255, 0.1)`.

---

## 7. Motion

| Token | Value |
|---|---|
| `--ease-smooth` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--duration-fast` | 0.2s (buttons, inputs) |
| `--duration-normal` | 0.35s (cards) |
| `--duration-slow` | 0.5s |

- **Keyframes:** `fadeInUp` (30px rise, 0.6s), `fadeIn`, `shimmer`, `float` (8px), `pulseGlow`.
- **Entrance stagger:** `.animate-in` plus `.animate-in-delay-1` to `-4` (0.1s steps).
- **Hover lift:** cards `translateY(-4px) scale(1.01)`, primary button `translateY(-1px)`, press `scale(0.97)`.

---

## 8. Shared components (globals.css)

| Class | Summary |
|---|---|
| `.glass-card` | Card background, 16px blur, default border with brighter top edge, `--radius-card`, card shadow, lift on hover |
| `.badge` | Inline pill, glass surface, 11px / 600 / uppercase / 1.5px tracking, 6px 14px padding |
| `.btn-primary` | White fill, `--color-bg-deep` text, 14px / 600, 12px 24px, white glow on hover |
| `.btn-ghost` | Transparent, default border, 14px / 500, 12px 24px, glass fill on hover |
| `.section` | 1200px centered container |
| `.section-label` | 12px / 600 / uppercase / 2px tracking, muted, 8px white dot before |
| `.divider` | 1px subtle line, `--space-3xl` vertical margin |
| `select` | Custom chevron, white 0.05 fill, 0.12 border, 8px radius, 13px |

---

## Cleanup backlog

Gaps between this system and the code, in suggested order:

**Done (2026-10-23):** brand green, status, type scale and 12/20px spacing tokens added (see [Tokens added](#tokens-added-2026-10-23)), and every exact hardcoded match in `src/` replaced with them. That was 293 font sizes, 132 spacing values and 96 colors.

**Remaining:**

1. **More tokens:** `--color-bg-panel: #0d0d12`, `--color-text-light: #e4e4e7`, and spacing steps `6px`, `40px`, `80px`.
2. **Fix font loading:** keep `next/font` and point `--font-heading` / `--font-body` at `var(--font-outfit)` / `var(--font-inter)`, then remove the `@import` from `globals.css`.
3. **Off-scale font sizes still hardcoded:** 10px, 15px, 17px, 22px, and the `3rem` / `clamp()` titles.
4. **Status colors with no token:** `#4ade80` with `rgba(34,197,94,x)` (admin "Paid" state) and `#f87171` (admin delete button). Either add tokens or switch them to the success and error tokens.
5. **Icon color props** (`<IconCheck color="#10b981" />` and others) still use hex, because SVG `stroke` and `fill` attributes don't reliably accept `var()`. Making icons use `stroke="currentColor"` and setting color through CSS would fix this. Note that `IconWhatsApp` ignores its `color` prop entirely, since it renders with `fill="currentColor"`.
6. **Spacing values 4, 8, 16px and above** are still hardcoded. Note that `--space-lg` and larger shrink below 768px, so swapping 24px for `--space-lg` would change mobile layouts.
7. **Collapse drift:** off-step white opacities, the extra `rgba(18,18,24,x)` card variants, and the 640 and 900px breakpoints.

### Tokens added (2026-10-23)

| Group | Tokens |
|---|---|
| Brand green | `--color-brand-green` `#25d366`, `--color-brand-green-hover` `#1ebd5a`, `--color-brand-green-dark` `#15803d`, `--color-brand-green-rgb` `37, 211, 102` |
| Success | `--color-success` `#10b981`, `--color-success-text` `#6ee7b7`, `--color-success-rgb` `16, 185, 129` |
| Warning | `--color-warning` `#fbbf24`, `--color-warning-text` `#fcd34d`, `--color-warning-rgb` `245, 158, 11` |
| Error | `--color-error` `#ef4444`, `--color-error-text` `#fca5a5`, `--color-error-rgb` `239, 68, 68` |
| Info | `--color-info-text` `#93c5fd`, `--color-info-rgb` `59, 130, 246` |
| Type scale | `--text-2xs` 11, `--text-xs` 12, `--text-sm` 13, `--text-md` 14, `--text-base` 16, `--text-lg` 18, `--text-xl` 20, `--text-2xl` 24, `--text-3xl` 28 (px) |
| Spacing | `--space-sm-md` 12px, `--space-md-lg` 20px (fixed, no mobile override) |

**Tints:** write `rgba(var(--color-brand-green-rgb), 0.15)`, not a hardcoded `rgba(37, 211, 102, 0.15)`. The same pattern works for every `-rgb` token, in CSS and in inline `style={{}}` strings.
