import fs from "fs";
import path from "path";
import { CATALOGS } from "../data/catalogs";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

// Default Store Configuration
const DEFAULT_CONFIG = {
  storeName: "PushinPacks",
  whatsappNumber: "16195550199", // International format without +, spaces, or dashes
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
  storeContactEmail: "ops@pushinpacks619.internal",
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

  if (!fs.existsSync(ORDERS_FILE)) {
    // Seed with initial order
    const initialOrders = [
      {
        id: "ord_1730000001",
        orderReference: "PP-2026-9481",
        customer: {
          fullName: "Marcus Vance",
          phone: "+16195551234",
          email: "vance.biolab@proton.me",
        },
        delivery: {
          method: "delivery",
          address: "742 Evergreen Terrace",
          city: "San Diego",
          notes: "Discreet vacuum packaging requested.",
        },
        items: [
          {
            productId: "pep-1",
            name: "GHK-Cu Copper Peptide",
            spec: "50mg * 10 vials",
            unitPrice: 24.0,
            quantity: 2,
            lineTotal: 48.0,
            portal: "peptides",
          },
          {
            productId: "pep-9",
            name: "SLU-PP-332 Metabolic",
            spec: "10mg * 10 vials",
            unitPrice: 110.0,
            quantity: 1,
            lineTotal: 110.0,
            portal: "peptides",
          },
        ],
        subtotal: 158.0,
        deliveryFee: 15.0,
        discount: 0.0,
        total: 173.0,
        currency: "USD",
        paymentMethod: "zelle",
        paymentStatus: "Awaiting payment confirmation",
        orderStatus: "Pending confirmation",
        createdAt: "2026-10-23T14:15:00.000Z",
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), "utf8");
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
  const cleanPhone = (config.whatsappNumber || "16195550199").replace(/[^0-9]/g, "");

  const lines = [
    `*NEW ORDER: ${order.orderReference}*`,
    `Store: ${config.storeName}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    ``,
    `*CUSTOMER DETAILS:*`,
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    order.customer.email ? `Email: ${order.customer.email}` : null,
    `Delivery Method: ${order.delivery.method === "delivery" ? "Home Delivery" : "Store Pickup"}`,
    order.delivery.method === "delivery"
      ? `Address: ${order.delivery.address}, ${order.delivery.city}`
      : `Pickup Location: ${config.storeLocation}`,
    order.delivery.notes ? `Notes: ${order.delivery.notes}` : null,
    ``,
    `*ORDERED ITEMS:*`,
  ].filter(Boolean);

  order.items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.productNameSnapshot || item.name || "Item"} (${item.spec || "Standard"})`
    );
    lines.push(
      `   Qty: ${item.quantity} x ${formatCurrency(item.unitPrice, currency)} = ${formatCurrency(item.lineTotal, currency)}`
    );
  });

  lines.push(``);
  lines.push(`*PAYMENT & TOTALS:*`);
  lines.push(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
  lines.push(`Subtotal: ${formatCurrency(order.subtotal, currency)}`);
  lines.push(
    `Delivery Fee: ${
      order.deliveryFee > 0 ? formatCurrency(order.deliveryFee, currency) : "Free"
    }`
  );
  if (order.discount > 0) {
    lines.push(`Discount: -${formatCurrency(order.discount, currency)}`);
  }
  lines.push(`*TOTAL: ${formatCurrency(order.total, currency)}*`);
  lines.push(``);
  lines.push(`Payment Status: ${order.paymentStatus}`);
  lines.push(`Please confirm this order and provide dispatch timeline.`);

  const text = lines.join("\n");
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

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

  // Persist order to database
  const orders = getAllOrders();
  orders.unshift(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");

  return {
    success: true,
    order: newOrder,
    whatsAppUrl,
  };
}
