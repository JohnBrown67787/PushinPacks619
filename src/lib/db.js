import fs from "fs";
import path from "path";
import { CATALOGS } from "../data/catalogs";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

// Sample demonstration inquiries (only populated when explicitly initialized from admin UI)
export const SAMPLE_INQUIRIES = [
  {
    id: "INQ-9481",
    portal: "peptides",
    portalName: "Peptides",
    client: "Dr. Marcus Vance",
    email: "vance.biolab@proton.me",
    items: [
      { name: "GHK-Cu Copper Peptide (50mg * 10 vials)", qty: 2, price: "$24.00" },
      { name: "SLU-PP-332 Metabolic (10mg * 10 vials)", qty: 1, price: "$110.00" },
    ],
    totalValue: "$158.00",
    status: "New",
    date: "2026-10-23 14:15",
    notes: "Requires cold insulated thermal pack dispatch with COA certificate.",
  },
  {
    id: "INQ-9480",
    portal: "budcart",
    portalName: "Bud'Cart",
    client: "Apex Vending Group",
    email: "orders@apexvapes.co",
    items: [
      { name: "Aura 510 Ceramic Cartridge (1.0ml)", qty: 25, price: "$45.00" },
      { name: "Stealth Disposable 2.0g", qty: 10, price: "$65.00" },
    ],
    totalValue: "$1,775.00",
    status: "Quoted",
    date: "2026-10-23 11:42",
    notes: "Wholesale inquiry for live terpene cartridge stock. Custom invoice sent.",
  },
  {
    id: "INQ-9479",
    portal: "stocks",
    portalName: "Stocks",
    client: "Kestrel Quant Capital",
    email: "trading@kestrelalpha.io",
    items: [
      { name: "Dark Pool Block Feed License", qty: 1, price: "$499/mo" },
      { name: "HFT Alpha V7 Strategy Terminal", qty: 1, price: "$5,310.25" },
    ],
    totalValue: "$5,809.25",
    status: "Fulfilled",
    date: "2026-10-22 18:30",
    notes: "API WebSocket credentials dispatched through encrypted PGP channel.",
  },
  {
    id: "INQ-9478",
    portal: "glock",
    portalName: "Glock",
    client: "Precision Arms Club",
    email: "armorer@pacprecision.net",
    items: [
      { name: "G19 Gen 5 RMR Cut Slide", qty: 3, price: "$340.00" },
      { name: "Fluted 9mm Match Barrel", qty: 3, price: "$185.00" },
    ],
    totalValue: "$1,575.00",
    status: "Reviewing",
    date: "2026-10-22 14:05",
    notes: "Customer requesting verification of RMR optic screw length compatibility.",
  },
  {
    id: "INQ-9477",
    portal: "pharms",
    portalName: "Pharms",
    client: "Sovereign Health Labs",
    email: "procurement@sovlabs.com",
    items: [
      { name: "Luminex Complex Softgels", qty: 6, price: "$85.00" },
      { name: "Sterile Osmolyte Solution", qty: 4, price: "$60.00" },
    ],
    totalValue: "$750.00",
    status: "New",
    date: "2026-10-21 21:18",
    notes: "Needs batch lot testing documentation and USP sterility stamps.",
  },
  {
    id: "INQ-9476",
    portal: "psychedelics",
    portalName: "Psychedelics",
    client: "Elena Rostova",
    email: "elena.r@neurobotanica.org",
    items: [
      { name: "Lunar Harmony 30ml Tincture", qty: 3, price: "$75.00" },
      { name: "Golden Teacher Micro Stack", qty: 2, price: "$95.00" },
    ],
    totalValue: "$415.00",
    status: "Fulfilled",
    date: "2026-10-21 16:40",
    notes: "Discreet vacuum sealed priority dispatch confirmed.",
  },
];

// Default Store Configuration
const DEFAULT_CONFIG = {
  storeName: "PushinPacks",
  whatsappNumber: "13096411111", // International format without +, spaces, or dashes
  currency: "USD",
  deliveryFeeUSD: 15.0,
  freeDeliveryThresholdUSD: 200.0,
  enabledPaymentMethods: ["paypal", "venmo", "zelle", "btc", "cashapp", "cod"],
  paymentInstructions: {
    paypal: "Send payment to our verified business PayPal: checkout@pushinpacks.com. State your Order Reference in the memo. Await confirmation on WhatsApp.",
    venmo: "Transfer to @PushinPacks-Desk on Venmo. Put your Order Reference in the payment memo. Submit confirmation screenshot on WhatsApp.",
    zelle: "Direct bank transfer to zelle@pushinpacks.com (Account: PushinPacks Logistics). Provide reference code to your WhatsApp representative.",
    btc: "Transfer exact BTC equivalent to verified wallet address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh. Confirmation requires 1 on-chain block.",
    cashapp: "Pay to $PushinPacks619 on Cash App. Include your order reference in the For line.",
    cod: "Cash on delivery authorized for pre-cleared postal routes. Have exact currency ready at delivery time.",
  },
  storeContactEmail: "Pushinpacks30@gmail.com",
  telegramNumber: "https://t.me/packmans619_1",
  telegramHandle: "@packmans619_1",
  storeLocation: "Pacific Coast Logistics Hub, San Diego, CA",
};

// Ensure data directory and files exist
function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf8");
  }

  // Orders start empty by default - populated dynamically via checkout or explicit admin initialization
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
  }

  // Inquiries start empty by default - populated dynamically via client submissions or explicit admin initialization
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

// Read configuration
export function getStoreConfig() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

// Update configuration
export function updateStoreConfig(newConfig) {
  ensureFiles();
  const current = getStoreConfig();
  const merged = { ...current, ...newConfig };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}

// Read all orders
export function getAllOrders() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Find single order by ID or reference
export function getOrderById(idOrRef) {
  const orders = getAllOrders();
  return orders.find(
    (o) => o.id === idOrRef || o.orderReference.toLowerCase() === idOrRef.toLowerCase()
  );
}

// Update order status
export function updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
  const orders = getAllOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  if (orderStatus) orders[index].orderStatus = orderStatus;
  if (paymentStatus) orders[index].paymentStatus = paymentStatus;
  orders[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  return orders[index];
}

// Look up verified product price from catalog data
export function getVerifiedProduct(productId) {
  for (const portalKey of Object.keys(CATALOGS)) {
    const portal = CATALOGS[portalKey];
    const match = portal.products.find((p) => p.id === productId);
    if (match) {
      // Parse numeric price from "$24.00" or "$5,310.25"
      const numericPrice = parseFloat(match.price.replace(/[^0-9.]/g, "")) || 0;
      return {
        ...match,
        portalKey,
        portalName: portal.name,
        verifiedPrice: numericPrice,
      };
    }
  }
  return null;
}

// Format currency helper (strictly USD)
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Generate unique order reference: PP-2026-XXXXX
function generateOrderReference() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `PP-${year}-${rand}`;
}

// Generate WhatsApp click to chat URL with complete order details
export function buildWhatsAppOrderMessage({ order, config }) {
  const currency = order.currency || config.currency || "USD";
  const cleanPhone = (config.whatsappNumber || "13096411111").replace(/[^0-9]/g, "");

  const productLines = [];
  order.items.forEach((item, idx) => {
    const itemPrice = Number(item.unitPrice || item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    const subtotal = Number(item.lineTotal || itemPrice * itemQty) || 0;
    productLines.push(`Product: ${item.productNameSnapshot || item.name || "Item"}`);
    productLines.push(`Unit Price: ${formatCurrency(itemPrice, currency)}`);
    productLines.push(`Quantity: ${itemQty}`);
    productLines.push(`Subtotal: ${formatCurrency(subtotal, currency)}`);
    if (idx < order.items.length - 1) {
      productLines.push(``);
    }
  });

  const deliveryMethod = order.delivery?.method === "delivery" ? "Home Delivery" : "Store Pickup";
  const address = order.delivery?.method === "delivery" ? (order.delivery?.address || "N/A") : "Store Pickup";
  const city = order.delivery?.method === "delivery" ? (order.delivery?.city || "N/A") : "N/A";
  const deliveryFee = order.deliveryFee > 0 ? formatCurrency(order.deliveryFee, currency) : "$0.00";

  const lines = [
    `🧾 NEW ORDER INVOICE`,
    ``,
    `Order ID: ${order.orderReference || order.id || ""}`,
    ``,
    `PRODUCT DETAILS`,
    ...productLines,
    ``,
    `CUSTOMER INFORMATION`,
    `Full Name: ${order.customer?.fullName || ""}`,
    `WhatsApp: ${order.customer?.phone || ""}`,
    `Email: ${order.customer?.email || "Not provided"}`,
    ``,
    `DELIVERY INFORMATION`,
    `Method: ${deliveryMethod}`,
    `Address: ${address}`,
    `City: ${city}`,
    ``,
    `PAYMENT INFORMATION`,
    `Payment Method: ${(order.paymentMethod || "").toUpperCase()}`,
    `Delivery Fee: ${deliveryFee}`,
    `TOTAL: ${formatCurrency(order.total, currency)}`,
  ];

  const text = lines.join("\n");
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/${cleanPhone || "13096411111"}?text=${encodedText}`;

  return { text, encodedText, waUrl };
}

// Create and validate new order (Server-Side)
export async function createOrder(payload) {
  ensureFiles();
  const config = getStoreConfig();
  const currency = "USD";

  // Validate customer information
  if (!payload.customer || !payload.customer.fullName || !payload.customer.phone) {
    throw new Error("Full name and phone number are required.");
  }

  // Normalize delivery details (handle customer.deliveryMethod or delivery.method)
  const deliveryMethod = payload.delivery?.method || payload.customer?.deliveryMethod || payload.deliveryMethod || "delivery";
  const isDelivery = deliveryMethod === "delivery";
  const address = payload.delivery?.address || payload.customer?.address || payload.address || "";
  const city = payload.delivery?.city || payload.customer?.city || payload.city || "";
  const customerNotes = payload.notes || payload.delivery?.notes || payload.customer?.notes || "";

  if (isDelivery && (!address || !city)) {
    throw new Error("Delivery address and city are required for Home Delivery.");
  }

  // Validate cart items
  if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error("Your cart is empty. Please select at least one product.");
  }

  // Normalize payment method
  let paymentMethod = (payload.paymentMethod || "bitcoin").toLowerCase();
  if (paymentMethod === "btc") paymentMethod = "bitcoin";
  if (paymentMethod === "cod") paymentMethod = "cash";

  // Normalize channel (whatsapp or telegram)
  const channel = (payload.channel || "whatsapp").toLowerCase();
  if (!["whatsapp", "telegram"].includes(channel)) {
    throw new Error("Invalid checkout channel. Must be whatsapp or telegram.");
  }

  // Server-side price recalculation (NEVER TRUST CLIENT PRICES)
  let subtotal = 0;
  const verifiedItems = [];

  for (const clientItem of payload.items) {
    const verified = getVerifiedProduct(clientItem.productId || clientItem.id);
    let unitPrice = 0;
    let name = (verified && verified.name) || clientItem.name || clientItem.title || "Selected Item";
    let spec = (verified && verified.spec) || clientItem.spec || "Standard";
    let portal = (verified && verified.portalKey) || clientItem.portal || "peptides";

    if (verified) {
      unitPrice = verified.verifiedPrice;
    } else {
      // Fallback: parse numeric value if product not found in standard catalogs
      const fallbackPrice = parseFloat(String(clientItem.price || clientItem.unitPrice).replace(/[^0-9.]/g, "")) || 45.0;
      unitPrice = fallbackPrice;
    }

    const quantity = Math.max(1, parseInt(clientItem.quantity || clientItem.qty || 1, 10));
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    verifiedItems.push({
      productId: clientItem.productId || clientItem.id,
      productNameSnapshot: name,
      name,
      spec,
      unitPriceSnapshot: unitPrice,
      unitPrice,
      quantity,
      lineTotal,
      portal,
    });
  }

  // Calculate delivery fee (strictly USD)
  let deliveryFee = 0;
  if (isDelivery) {
    deliveryFee =
      subtotal >= (config.freeDeliveryThresholdUSD || 200) ? 0 : (config.deliveryFeeUSD || 15.0);
  }

  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  const orderReference = generateOrderReference();
  const orderId = `ord_${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newOrder = {
    id: orderId,
    orderReference,
    customer: {
      fullName: payload.customer.fullName.trim(),
      phone: payload.customer.phone.trim(),
      email: (payload.customer.email || "").trim(),
      address: isDelivery ? address.trim() : "",
      city: isDelivery ? city.trim() : "",
    },
    deliveryMethod: isDelivery ? "delivery" : "pickup",
    delivery: {
      method: isDelivery ? "delivery" : "pickup",
      address: isDelivery ? address.trim() : "",
      city: isDelivery ? city.trim() : "",
      notes: customerNotes.trim(),
    },
    items: verifiedItems,
    orderSubtotal: subtotal,
    subtotal,
    deliveryFee,
    discount,
    finalTotal: total,
    total,
    currency,
    selectedPaymentMethod: paymentMethod,
    paymentMethod,
    checkoutChannel: payload.checkoutChannel || "whatsapp",
    telegramUrl: "https://t.me/packmans619_1",
    paymentStatus: "unpaid",
    orderStatus: "pending",
    customerNotes: customerNotes.trim(),
    createdAt,
  };

  // Generate WhatsApp message and URL
  const { text: whatsappMessage, waUrl: whatsAppUrl } = buildWhatsAppOrderMessage({
    order: newOrder,
    config,
  });

  newOrder.whatsappMessage = whatsappMessage;
  newOrder.whatsappUrl = whatsAppUrl;
  newOrder.checkoutChannel = channel;
  newOrder.telegramUrl = config.telegramNumber || "https://t.me/packmans619_1";

  // Persist order to database
  const orders = getAllOrders();
  orders.unshift(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");

  return {
    success: true,
    order: newOrder,
    whatsAppUrl,
    telegramUrl: newOrder.telegramUrl,
  };
}

// ============================================
// INQUIRIES MANAGEMENT
// ============================================

export function getAllInquiries() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function createInquiry(payload) {
  ensureFiles();
  const inquiries = getAllInquiries();
  const id = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const portalKey = payload.portal || payload.portalKey || "peptides";
  const portalName = CATALOGS[portalKey]?.name || portalKey;

  const newInq = {
    id,
    portal: portalKey,
    portalName,
    client: payload.client || payload.name || "Client Direct",
    email: payload.email || "direct@client.internal",
    items: payload.items || [
      { name: payload.itemName || "Custom Catalog Inquired Item", qty: payload.qty || 1, price: payload.price || "$100.00" },
    ],
    totalValue: payload.totalValue || payload.price || "$100.00",
    status: payload.status || "New",
    date: dateStr,
    notes: payload.notes || "",
  };

  inquiries.unshift(newInq);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
  return newInq;
}

export function updateInquiryStatus(id, status) {
  ensureFiles();
  const inquiries = getAllInquiries();
  const idx = inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  inquiries[idx].status = status;
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
  return inquiries[idx];
}

export function deleteInquiry(id) {
  ensureFiles();
  let inquiries = getAllInquiries();
  inquiries = inquiries.filter((i) => i.id !== id);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
  return true;
}

export function clearAllInquiries() {
  ensureFiles();
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
  return [];
}

export function seedSampleInquiries() {
  ensureFiles();
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(SAMPLE_INQUIRIES, null, 2), "utf8");
  return SAMPLE_INQUIRIES;
}

// ============================================
// ORDER DYNAMIC CONTROLS (ADMIN INITIALIZE / CLEAR)
// ============================================

export function clearAllOrders() {
  ensureFiles();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
  return [];
}

export function seedSampleOrder() {
  ensureFiles();
  const sample = {
    id: `ord_${Date.now()}`,
    orderReference: generateOrderReference(),
    customer: {
      fullName: "Dr. Alexander Vance",
      phone: "+1 (619) 555-0199",
      email: "vance.biolab@proton.me",
      address: "124 Concord Ave, Suite 4B",
      city: "San Diego, CA",
    },
    deliveryMethod: "delivery",
    delivery: {
      method: "delivery",
      address: "124 Concord Ave, Suite 4B",
      city: "San Diego, CA",
      notes: "Priority cold insulated dispatch requested",
    },
    items: [
      {
        productId: "pep-1",
        productNameSnapshot: "GHK-Cu Copper Peptide",
        name: "GHK-Cu Copper Peptide",
        spec: "50mg * 10 vials",
        unitPriceSnapshot: 24.0,
        unitPrice: 24.0,
        quantity: 2,
        lineTotal: 48.0,
        portal: "peptides",
      },
      {
        productId: "bud-1",
        productNameSnapshot: "Aura 510 Ceramic Cartridge",
        name: "Aura 510 Ceramic Cartridge",
        spec: "1.0ml Live Resin",
        unitPriceSnapshot: 45.0,
        unitPrice: 45.0,
        quantity: 1,
        lineTotal: 45.0,
        portal: "budcart",
      },
    ],
    orderSubtotal: 93.0,
    subtotal: 93.0,
    deliveryFee: 15.0,
    discount: 0.0,
    finalTotal: 108.0,
    total: 108.0,
    currency: "USD",
    selectedPaymentMethod: "bitcoin",
    paymentMethod: "bitcoin",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    customerNotes: "Priority cold insulated dispatch requested",
    createdAt: new Date().toISOString(),
  };

  const config = getStoreConfig();
  const { text: whatsappMessage, waUrl: whatsAppUrl } = buildWhatsAppOrderMessage({
    order: sample,
    config,
  });
  sample.whatsappMessage = whatsappMessage;
  sample.whatsappUrl = whatsAppUrl;

  const orders = getAllOrders();
  orders.unshift(sample);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  return sample;
}
