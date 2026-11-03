"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin.module.css";
import AdminLogin from "../../components/AdminLogin";
import CustomDropdown from "../../components/CustomDropdown";
import { CATALOGS } from "../../data/catalogs";
import {
  IconDashboard,
  IconInbox,
  IconLayers,
  IconGrid,
  IconHelpCircle,
  IconLock,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconEye,
  IconArrowRight,
  IconShield,
  IconRefresh,
  IconWhatsApp,
  IconTelegram,
  IconCopy,
  IconExternalLink,
  IconTruck,
  IconStore,
  IconBitcoin,
  IconCashApp,
  IconPayPal,
  IconVenmo,
  IconZelle,
  IconLogOut,
} from "../../components/Icons";

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPortal, setSelectedPortal] = useState("all");

  // Dynamic Inquiries State (loaded from /api/inquiries, starts empty until initialized)
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dynamic WhatsApp Orders State (loaded from /api/orders, starts empty until initialized)
  const [liveOrders, setLiveOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Store Configuration State
  const [storeConfig, setStoreConfig] = useState(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState("");
  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Fetch real data from backend APIs
  const refreshAdminData = async () => {
    try {
      const [ordersRes, configRes, inquiriesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/config"),
        fetch("/api/inquiries"),
      ]);

      const ordersData = await ordersRes.json();
      const configData = await configRes.json();
      const inquiriesData = await inquiriesRes.json();

      if (ordersData.success && ordersData.orders) {
        setLiveOrders(ordersData.orders);
      }
      if (configData.success && configData.config) {
        setStoreConfig(configData.config);
      }
      if (inquiriesData.success && inquiriesData.inquiries) {
        setInquiries(inquiriesData.inquiries);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoadingInquiries(false);
      setIsLoadingOrders(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("adminAuth");
        if (auth) {
          const parsed = JSON.parse(auth);
          if (parsed.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAdminData();
    }
  }, [isAuthenticated]);

  // ----------------------------------------------------
  // DYNAMIC INITIALIZATION & CLEARING HANDLERS
  // ----------------------------------------------------

  // Master Initialize: seeds both sample inquiries and sample order from the page
  const handleInitializeData = async () => {
    try {
      const [inqRes, ordRes] = await Promise.all([
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "initialize" }),
        }),
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "initialize" }),
        }),
      ]);

      const inqData = await inqRes.json();
      const ordData = await ordRes.json();

      if (inqData.success && inqData.inquiries) {
        setInquiries(inqData.inquiries);
      }
      if (ordData.success && ordData.order) {
        setLiveOrders((prev) => [ordData.order, ...prev.filter((o) => o.id !== ordData.order.id)]);
      }

      triggerToast("Demonstration inquiries & order initialized successfully!");
    } catch (err) {
      console.error("Initialization error:", err);
      triggerToast("Failed to initialize demonstration data");
    }
  };

  // Master Clear: wipes all inquiries and orders back to 0
  const handleClearAllData = async () => {
    if (!window.confirm("Are you sure you want to clear all inquiries and orders? Data will be reset to empty.")) {
      return;
    }
    try {
      await Promise.all([
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clear" }),
        }),
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clear" }),
        }),
      ]);

      setInquiries([]);
      setLiveOrders([]);
      setSelectedInquiry(null);
      setSelectedOrder(null);
      triggerToast("All admin records cleared back to zero.");
    } catch (err) {
      console.error("Clear error:", err);
      triggerToast("Failed to clear admin records");
    }
  };

  // Initialize Inquiries only
  const handleInitializeInquiriesOnly = async () => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize" }),
      });
      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
        triggerToast("Sample inquiries initialized!");
      }
    } catch (err) {
      console.error("Error initializing inquiries:", err);
      triggerToast("Failed to initialize inquiries");
    }
  };

  // Clear Inquiries only
  const handleClearInquiriesOnly = async () => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries([]);
        setSelectedInquiry(null);
        triggerToast("Inquiries list cleared.");
      }
    } catch (err) {
      console.error("Error clearing inquiries:", err);
      triggerToast("Failed to clear inquiries");
    }
  };

  // Initialize Sample Order only
  const handleInitializeOrdersOnly = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize" }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setLiveOrders((prev) => [data.order, ...prev.filter((o) => o.id !== data.order.id)]);
        triggerToast("Sample order initialized!");
      }
    } catch (err) {
      console.error("Error initializing order:", err);
      triggerToast("Failed to initialize order");
    }
  };

  // Clear Orders only
  const handleClearOrdersOnly = async () => {
    if (!window.confirm("Are you sure you want to clear all WhatsApp orders?")) return;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const data = await res.json();
      if (data.success) {
        setLiveOrders([]);
        setSelectedOrder(null);
        triggerToast("WhatsApp orders cleared.");
      }
    } catch (err) {
      console.error("Error clearing orders:", err);
      triggerToast("Failed to clear orders");
    }
  };

  // Update Inquiry Status (persisted to backend)
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? data.inquiry : inq))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(data.inquiry);
        }
        triggerToast(`Inquiry ${id} updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating inquiry status:", err);
      triggerToast("Failed to update inquiry status");
    }
  };

  // Delete single inquiry
  const handleDeleteInquiry = async (id) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
        triggerToast(`Inquiry ${id} deleted`);
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      triggerToast("Failed to delete inquiry");
    }
  };

  // Update WhatsApp Order Status
  const handleUpdateOrderStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setLiveOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? data.order : ord))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        triggerToast(`Order status updated to ${newOrderStatus}`);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      triggerToast("Failed to update order status");
    }
  };

  // Save Store Configuration
  const handleSaveStoreConfig = async (e) => {
    if (e) e.preventDefault();
    if (!storeConfig) return;
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeConfig),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Store configuration and contact details saved successfully");
      } else {
        triggerToast("Error saving store configuration");
      }
    } catch (err) {
      console.error("Save config error:", err);
      triggerToast("Failed to save configuration");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // ----------------------------------------------------
  // PORTAL COPY & CATALOGS STATE
  // ----------------------------------------------------

  const [portalsData, setPortalsData] = useState(() => {
    const map = {};
    Object.keys(CATALOGS).forEach((key) => {
      map[key] = { ...CATALOGS[key], active: true };
    });
    return map;
  });

  const [allProducts, setAllProducts] = useState(() => {
    const list = [];
    Object.keys(CATALOGS).forEach((portalKey) => {
      const cat = CATALOGS[portalKey];
      cat.products.forEach((prod) => {
        list.push({ ...prod, portalKey, portalName: cat.name, active: true });
      });
    });
    return list;
  });

  const [allFaqs, setAllFaqs] = useState(() => {
    const list = [];
    Object.keys(CATALOGS).forEach((portalKey) => {
      const cat = CATALOGS[portalKey];
      (cat.faqs || []).forEach((faq, idx) => {
        list.push({ id: `${portalKey}-${idx}`, portalKey, portalName: cat.name, ...faq });
      });
    });
    return list;
  });

  // Modals state
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState({
    portalKey: "peptides",
    name: "",
    category: "Specialized",
    spec: "",
    price: "$50.00",
    purity: "99%+",
    badge: "New Release",
    description: "",
  });

  const [showNewFaqModal, setShowNewFaqModal] = useState(false);
  const [newFaqData, setNewFaqData] = useState({
    portalKey: "peptides",
    q: "",
    a: "",
  });

  const [showNewInquiryModal, setShowNewInquiryModal] = useState(false);
  const [newInquiryData, setNewInquiryData] = useState({
    portalKey: "peptides",
    client: "",
    email: "",
    itemName: "",
    qty: 1,
    price: "$150.00",
    notes: "",
  });

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesPortal = selectedPortal === "all" || inq.portal === selectedPortal;
    const matchesStatus = statusFilter === "all" || inq.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      (inq.id && inq.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.client && inq.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.portalName && inq.portalName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPortal && matchesStatus && matchesSearch;
  });

  // Filter products
  const filteredProducts = allProducts.filter((p) => {
    const matchesPortal = selectedPortal === "all" || p.portalKey === selectedPortal;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPortal && matchesSearch;
  });

  // Filter FAQs
  const filteredFaqs = allFaqs.filter((f) => {
    const matchesPortal = selectedPortal === "all" || f.portalKey === selectedPortal;
    const matchesSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPortal && matchesSearch;
  });

  // Product visibility
  const handleToggleProductActive = (id) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    triggerToast("Product visibility toggled");
  };

  // Create Product Offering
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductData.name) return;
    const portal = portalsData[newProductData.portalKey];
    const newProd = {
      id: `prod-${Date.now()}`,
      ...newProductData,
      portalName: portal.name,
      active: true,
    };
    setAllProducts((prev) => [newProd, ...prev]);
    setShowNewProductModal(false);
    setNewProductData({
      portalKey: "peptides",
      name: "",
      category: "Specialized",
      spec: "",
      price: "$50.00",
      purity: "99%+",
      badge: "New Release",
      description: "",
    });
    triggerToast(`Added ${newProd.name} to ${portal.name}`);
  };

  // Create FAQ Article
  const handleCreateFaq = (e) => {
    e.preventDefault();
    if (!newFaqData.q || !newFaqData.a) return;
    const portal = portalsData[newFaqData.portalKey];
    const newFaq = {
      id: `faq-${Date.now()}`,
      portalKey: newFaqData.portalKey,
      portalName: portal.name,
      q: newFaqData.q,
      a: newFaqData.a,
    };
    setAllFaqs((prev) => [newFaq, ...prev]);
    setShowNewFaqModal(false);
    setNewFaqData({ portalKey: "peptides", q: "", a: "" });
    triggerToast(`Added FAQ to ${portal.name}`);
  };

  const handleDeleteFaq = (id) => {
    setAllFaqs((prev) => prev.filter((f) => f.id !== id));
    triggerToast("FAQ deleted");
  };

  // Create custom inquiry from page
  const handleCreateInquirySubmit = async (e) => {
    e.preventDefault();
    if (!newInquiryData.client) return;

    try {
      const portal = portalsData[newInquiryData.portalKey];
      const payload = {
        portal: newInquiryData.portalKey,
        portalName: portal.name,
        client: newInquiryData.client,
        email: newInquiryData.email,
        items: [
          {
            name: newInquiryData.itemName || "General Catalog Inquiry",
            qty: parseInt(newInquiryData.qty, 10) || 1,
            price: newInquiryData.price,
          },
        ],
        totalValue: newInquiryData.price,
        notes: newInquiryData.notes,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiries((prev) => [data.inquiry, ...prev]);
        setShowNewInquiryModal(false);
        setNewInquiryData({
          portalKey: "peptides",
          client: "",
          email: "",
          itemName: "",
          qty: 1,
          price: "$150.00",
          notes: "",
        });
        triggerToast(`Inquiry created for ${payload.client}`);
      }
    } catch (err) {
      console.error("Error creating inquiry:", err);
      triggerToast("Failed to create inquiry");
    }
  };

  // ----------------------------------------------------
  // DYNAMIC CALCULATED METRICS
  // ----------------------------------------------------
  const totalInquiriesCount = inquiries.length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "New").length;

  const inquiriesVolumeTotal = inquiries.reduce((sum, inq) => {
    const numeric = parseFloat(String(inq.totalValue).replace(/[^0-9.]/g, "")) || 0;
    return sum + numeric;
  }, 0);

  const ordersVolumeTotal = liveOrders.reduce((sum, ord) => {
    return sum + (Number(ord.finalTotal ?? ord.total) || 0);
  }, 0);

  const combinedVolumeTotal = inquiriesVolumeTotal + ordersVolumeTotal;

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f15 0%, #1a1a24 50%, #0f0f15 100%)",
      }}>
        <div style={{
          textAlign: "center",
          color: "white",
        }}>
          <p>Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={styles.adminPage}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1100,
            background: "rgba(20, 20, 26, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            padding: "var(--space-sm-md) var(--space-md-lg)",
            color: "#ffffff",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <IconCheck size={16} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerBrandRow}>
            <Image
              src="/logo.jpg"
              alt="PushinPacks Logo"
              width={36}
              height={36}
              className={styles.brandLogo}
              priority
            />
            <div>
              <span className={styles.brandTitle}>PUSHINPACKS619</span>
              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Dynamic Administration Console
              </div>
            </div>
          </div>
          <span className={styles.headerBadge}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: inquiries.length > 0 || liveOrders.length > 0 ? "var(--color-success)" : "var(--color-text-dim)" }}></span>
            <span>{inquiries.length > 0 || liveOrders.length > 0 ? `Dynamic Data: ${inquiries.length} Inq / ${liveOrders.length} Orders` : "Clean State (Uninitialized)"}</span>
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Quick Initialize / Clear Action Buttons in Header */}
          {inquiries.length === 0 && liveOrders.length === 0 ? (
            <button
              onClick={handleInitializeData}
              className={styles.primaryBtn}
              style={{ padding: "6px 14px", fontSize: "var(--text-xs)" }}
              title="Click to populate sample demonstration inquiries and order"
            >
              <IconRefresh size={14} color="#050507" />
              <span className={styles.headerBtnTextFull}>Initialize Data</span>
              <span className={styles.headerBtnTextMobile}>Initialize</span>
            </button>
          ) : (
            <button
              onClick={handleClearAllData}
              className={styles.secondaryBtn}
              style={{ padding: "6px 12px", fontSize: "var(--text-xs)", color: "#f87171" }}
              title="Reset all dynamic inquiries and orders to zero"
            >
              <IconTrash size={14} color="currentColor" />
              <span className={styles.headerBtnTextFull}>Clear Data</span>
              <span className={styles.headerBtnTextMobile}>Clear</span>
            </button>
          )}

          <Link href="/" target="_blank" className={styles.secondaryBtn}>
            <span className={styles.headerBtnTextFull}>View Public Hub</span>
            <span className={styles.headerBtnTextMobile}>Hub</span>
            <IconArrowRight size={14} color="var(--color-text-muted)" />
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("adminAuth");
              setIsAuthenticated(false);
            }}
            className={styles.secondaryBtn}
            style={{ color: "#f87171" }}
            title="Logout from Admin Console"
          >
            <IconLogOut size={14} color="currentColor" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className={styles.adminBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div>
            <div style={{ fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-dim)", padding: "0 14px 10px", fontWeight: 700 }}>
              Management Console
            </div>
            <div className={styles.sidebarMenu}>
              <button
                onClick={() => setActiveTab("overview")}
                className={activeTab === "overview" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconDashboard size={16} color="currentColor" />
                <span>Overview &amp; Metrics</span>
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={activeTab === "inquiries" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconInbox size={16} color="currentColor" />
                <span>Inquiries Desk</span>
                {inquiries.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: "var(--text-2xs)", background: "rgba(255, 255, 255, 0.1)", color: "#ffffff", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>
                    {inquiries.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("portals")}
                className={activeTab === "portals" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconLayers size={16} color="currentColor" />
                <span>Portals Content</span>
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={activeTab === "catalog" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconGrid size={16} color="currentColor" />
                <span>Catalog Offerings</span>
              </button>
              <button
                onClick={() => setActiveTab("faqs")}
                className={activeTab === "faqs" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconHelpCircle size={16} color="currentColor" />
                <span>FAQs Knowledge</span>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={activeTab === "orders" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconWhatsApp size={16} color={activeTab === "orders" ? "#25D366" : "currentColor"} />
                <span>WhatsApp Orders</span>
                {liveOrders.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: "var(--text-2xs)", background: "var(--color-brand-green)", color: "#000", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                    {liveOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("store-config")}
                className={activeTab === "store-config" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconShield size={16} color="currentColor" />
                <span>Checkout &amp; Store Config</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={activeTab === "settings" ? styles.sidebarItemActive : styles.sidebarItem}
              >
                <IconLock size={16} color="currentColor" />
                <span>Security &amp; Webhooks</span>
              </button>
            </div>
          </div>

          <div className={styles.sidebarFooter} style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "16px", paddingLeft: "10px", paddingRight: "10px" }}>
            <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-dim)", lineHeight: 1.5 }}>
              PushinPacks Dynamic Engine
              <br />
              {inquiries.length === 0 && liveOrders.length === 0 ? "Awaiting data initialization" : "Active dynamic data loaded"}
            </div>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className={styles.contentArea}>
          {/* Universal Control Bar */}
          <div className={styles.controlBar}>
            <div>
              <h1 className={styles.controlTitle}>
                {activeTab === "overview" && "Network Overview"}
                {activeTab === "orders" && "WhatsApp Orders Desk"}
                {activeTab === "store-config" && "Store & WhatsApp Checkout Configuration"}
                {activeTab === "inquiries" && "Central Inquiries Desk"}
                {activeTab === "portals" && "Portals & Content Configuration"}
                {activeTab === "catalog" && "Catalog Offerings & Specs"}
                {activeTab === "faqs" && "FAQs Knowledge Base"}
                {activeTab === "settings" && "Security & Integration Settings"}
              </h1>
              <p className={styles.controlSubtitle}>
                Unified command console controlling all 6 autonomous sub-websites across PushinPacks.
              </p>
            </div>

            {/* Portal Filter Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Active Scope:
              </span>
              <CustomDropdown
                value={selectedPortal}
                onChange={setSelectedPortal}
                variant="scope"
                options={[
                  { value: "all", label: "All Network Portals (6)" },
                  { value: "peptides", label: "Peptides (/peptides)" },
                  { value: "budcart", label: "Bud'Cart (/budcart)" },
                  { value: "stocks", label: "Stocks (/stocks)" },
                  { value: "glock", label: "Glock Precision (/glock)" },
                  { value: "psychedelics", label: "Psychedelics (/psychedelics)" },
                  { value: "pharms", label: "Pharms & Lab (/pharms)" },
                ]}
              />
            </div>
          </div>

          {/* Dynamic Notice Banner */}
          <div className={styles.noticeBanner}>
            <IconShield size={20} color="#d4d4d8" />
            <span>
              <strong>Dynamic State:</strong> Records are added dynamically as customers submit orders or inquiries. You can initialize demo data or clear all records at any time using the console controls.
            </span>
          </div>

          {/* =========================================================
              TAB 1: OVERVIEW & METRICS
             ========================================================= */}
          {activeTab === "overview" && (
            <div>
              {/* Key Metrics - 100% Dynamic */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Total Inquiries (Active)</div>
                  <div className={styles.metricValue}>{totalInquiriesCount}</div>
                  <div className={styles.metricSubtext}>
                    {totalInquiriesCount === 0
                      ? "No inquiries initialized"
                      : `${newInquiriesCount} pending review`}
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Quoted Order Volume</div>
                  <div className={styles.metricValue}>
                    ${combinedVolumeTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={styles.metricSubtext}>
                    {combinedVolumeTotal === 0
                      ? "Awaiting initialization or live orders"
                      : `From ${totalInquiriesCount} inquiries & ${liveOrders.length} orders`}
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Live Catalog Offerings</div>
                  <div className={styles.metricValue}>{allProducts.length}</div>
                  <div className={styles.metricSubtext}>Across all 6 sub-portals</div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>WhatsApp Orders</div>
                  <div className={styles.metricValue}>{liveOrders.length}</div>
                  <div className={styles.metricSubtext}>
                    {liveOrders.length === 0
                      ? "No orders recorded yet"
                      : `${liveOrders.filter((o) => o.orderStatus === "pending").length} pending coordination`}
                  </div>
                </div>
              </div>

              {/* Clean State Banner when data is not yet initialized */}
              {inquiries.length === 0 && liveOrders.length === 0 && (
                <div
                  className={styles.tableCard}
                  style={{
                    padding: "36px 24px",
                    textAlign: "center",
                    marginBottom: "var(--space-md-lg)",
                    border: "1px dashed rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div style={{ display: "inline-flex", padding: "14px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", marginBottom: "14px" }}>
                    <IconLayers size={28} color="#ffffff" />
                  </div>
                  <h3 style={{ color: "#ffffff", fontSize: "var(--text-lg)", margin: "0 0 8px 0" }}>
                    Admin Workspace Ready &mdash; Data Not Initialized
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", maxWidth: "540px", margin: "0 auto 20px auto", lineHeight: 1.6 }}>
                    The administration dashboard is in a clean dynamic state. Data will be populated only when clients interact with the store, or when you explicitly initialize demonstration data from this page.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={handleInitializeData} className={styles.primaryBtn}>
                      <IconRefresh size={15} color="#050507" />
                      <span>Initialize Demonstration Data</span>
                    </button>
                    <button onClick={() => setShowNewInquiryModal(true)} className={styles.secondaryBtn}>
                      <IconPlus size={15} color="currentColor" />
                      <span>Add Custom Inquiry</span>
                    </button>
                    <Link href="/checkout" target="_blank" className={styles.secondaryBtn}>
                      <IconExternalLink size={15} color="currentColor" />
                      <span>Simulate Customer Checkout</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Recent Inquiries Quick Table */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>
                    Recent Client Inquiries {inquiries.length > 0 ? `(${inquiries.length})` : "(0)"}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {inquiries.length === 0 ? (
                      <button onClick={handleInitializeInquiriesOnly} className={styles.secondaryBtn}>
                        <IconPlus size={14} color="currentColor" />
                        <span>Initialize Inquiries</span>
                      </button>
                    ) : (
                      <button onClick={() => setActiveTab("inquiries")} className={styles.secondaryBtn}>
                        <span>View All Inquiries</span>
                        <IconArrowRight size={14} color="var(--color-text-muted)" />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Inquiry ID</th>
                        <th>Origin Portal</th>
                        <th>Client</th>
                        <th>Items Requested</th>
                        <th>Estimated Total</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "var(--color-text-muted)" }}>
                            <div style={{ fontSize: "var(--text-sm)", marginBottom: "8px" }}>No client inquiries recorded.</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}>
                              Click &quot;Initialize Demonstration Data&quot; or use the &quot;Add Custom Inquiry&quot; button to add data.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        inquiries.slice(0, 5).map((inq) => (
                          <tr key={inq.id} style={{ cursor: "pointer" }} onClick={() => setSelectedInquiry(inq)}>
                            <td style={{ fontWeight: 700, color: "#ffffff" }}>{inq.id}</td>
                            <td>
                              <span style={{ padding: "3px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", fontSize: "var(--text-2xs)", fontWeight: 600 }}>
                                {inq.portalName}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: "#ffffff" }}>{inq.client}</div>
                              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)" }}>{inq.email}</div>
                            </td>
                            <td>{inq.items?.length || 1} items requested</td>
                            <td style={{ fontWeight: 700, color: "#ffffff" }}>{inq.totalValue}</td>
                            <td>
                              <span
                                className={
                                  inq.status === "New"
                                    ? styles.statusNew
                                    : inq.status === "Quoted"
                                    ? styles.statusQuoted
                                    : inq.status === "Reviewing"
                                    ? styles.statusReviewing
                                    : styles.statusFulfilled
                                }
                              >
                                {inq.status}
                              </span>
                            </td>
                            <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{inq.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portal Health & Direct Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-md-lg)" }}>
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>Sub-Portal Status Matrix</div>
                  </div>
                  <div style={{ padding: "var(--space-md-lg) 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {Object.keys(portalsData).map((key) => {
                      const portal = portalsData[key];
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "var(--text-md)" }}>
                              {portal.name}
                            </div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                              /{portal.slug}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "var(--text-2xs)", padding: "3px 8px", borderRadius: "12px", background: "rgba(var(--color-success-rgb), 0.12)", color: "var(--color-success-text)", fontWeight: 600 }}>
                              Online
                            </span>
                            <Link href={`/${portal.slug}`} target="_blank" className={styles.secondaryBtn} style={{ padding: "4px 8px" }}>
                              <IconEye size={14} color="currentColor" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>Dynamic Data Management</div>
                  </div>
                  <div style={{ padding: "var(--space-md-lg) 24px", display: "flex", flexDirection: "column", gap: "var(--space-sm-md)" }}>
                    <button
                      onClick={handleInitializeData}
                      className={styles.primaryBtn}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <IconRefresh size={16} color="#050507" />
                      <span>Initialize Demonstration Records</span>
                    </button>
                    <button
                      onClick={() => setShowNewInquiryModal(true)}
                      className={styles.secondaryBtn}
                      style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                    >
                      <IconPlus size={16} color="currentColor" />
                      <span>Create New Client Inquiry</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("catalog");
                        setShowNewProductModal(true);
                      }}
                      className={styles.secondaryBtn}
                      style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                    >
                      <IconGrid size={16} color="currentColor" />
                      <span>Add New Catalog Offering</span>
                    </button>
                    {(inquiries.length > 0 || liveOrders.length > 0) && (
                      <button
                        onClick={handleClearAllData}
                        className={styles.secondaryBtn}
                        style={{ width: "100%", justifyContent: "center", padding: "10px", color: "#f87171" }}
                      >
                        <IconTrash size={16} color="currentColor" />
                        <span>Clear All Initialized Records</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: CENTRAL INQUIRIES DESK
             ========================================================= */}
          {activeTab === "inquiries" && (
            <div>
              {/* Search & Filter Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "var(--space-md-lg)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["all", "New", "Reviewing", "Quoted", "Fulfilled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: statusFilter === st ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                        background: statusFilter === st ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        color: statusFilter === st ? "#ffffff" : "var(--color-text-muted)",
                      }}
                    >
                      {st === "all" ? `All (${inquiries.length})` : `${st} (${inquiries.filter((i) => i.status.toLowerCase() === st.toLowerCase()).length})`}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", minWidth: "240px" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
                      <IconSearch size={14} color="var(--color-text-muted)" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search ID, client, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        padding: "9px 14px 9px 34px",
                        color: "#ffffff",
                        fontSize: "var(--text-sm)",
                        outline: "none",
                      }}
                    />
                  </div>

                  <button onClick={() => setShowNewInquiryModal(true)} className={styles.primaryBtn}>
                    <IconPlus size={15} color="#050507" />
                    <span>Add Inquiry</span>
                  </button>

                  {inquiries.length === 0 ? (
                    <button onClick={handleInitializeInquiriesOnly} className={styles.secondaryBtn}>
                      <IconRefresh size={14} color="currentColor" />
                      <span>Initialize Samples</span>
                    </button>
                  ) : (
                    <button onClick={handleClearInquiriesOnly} className={styles.secondaryBtn} style={{ color: "#f87171" }}>
                      <IconTrash size={14} color="currentColor" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inquiries Table */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Inquiries Record ({filteredInquiries.length})</div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                    Total Desk Value: ${inquiriesVolumeTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Inquiry ID</th>
                        <th>Origin Portal</th>
                        <th>Client Contact</th>
                        <th>Items Summary</th>
                        <th>Estimated Total</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "50px 16px", color: "var(--color-text-muted)" }}>
                            <IconInbox size={36} color="var(--color-text-dim)" />
                            <div style={{ color: "#ffffff", fontSize: "var(--text-base)", marginTop: "12px", fontWeight: 600 }}>
                              {inquiries.length === 0 ? "No Inquiries on Record" : "No matching inquiries found"}
                            </div>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", maxWidth: "420px", margin: "6px auto 18px auto" }}>
                              {inquiries.length === 0
                                ? "Inquiries appear here dynamically when submitted by clients, or you can initialize demonstration data from this page."
                                : "Try clearing your search query or switching your status filter to 'All'."}
                            </p>
                            {inquiries.length === 0 && (
                              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                <button onClick={handleInitializeInquiriesOnly} className={styles.primaryBtn}>
                                  <IconRefresh size={14} color="#050507" />
                                  <span>Initialize Sample Inquiries</span>
                                </button>
                                <button onClick={() => setShowNewInquiryModal(true)} className={styles.secondaryBtn}>
                                  <IconPlus size={14} color="currentColor" />
                                  <span>Add New Inquiry</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td style={{ fontWeight: 700, color: "#ffffff" }}>{inq.id}</td>
                            <td>
                              <span style={{ padding: "3px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", fontSize: "var(--text-2xs)", fontWeight: 600 }}>
                                {inq.portalName}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: "#ffffff" }}>{inq.client}</div>
                              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)" }}>{inq.email}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                                {inq.items?.map((i) => `${i.name} (x${i.qty || 1})`).join(", ").slice(0, 45)}
                                {inq.items && inq.items.length > 1 ? "..." : ""}
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, color: "#ffffff" }}>{inq.totalValue}</td>
                            <td>
                              <CustomDropdown
                                value={inq.status}
                                onChange={(val) => handleUpdateInquiryStatus(inq.id, val)}
                                variant="status"
                                options={[
                                  { value: "New", label: "New Inquiry", color: "#ffffff", bg: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.2)" },
                                  { value: "Reviewing", label: "Reviewing", color: "#ffffff", bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.15)" },
                                  { value: "Quoted", label: "Quoted", color: "#ffffff", bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.15)" },
                                  { value: "Fulfilled", label: "Fulfilled", color: "#25D366", bg: "rgba(37, 211, 102, 0.12)", borderColor: "rgba(37, 211, 102, 0.25)" },
                                ]}
                              />
                            </td>
                            <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{inq.date}</td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => setSelectedInquiry(inq)}
                                  className={styles.secondaryBtn}
                                  style={{ padding: "4px 8px" }}
                                  title="Inspect"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className={styles.secondaryBtn}
                                  style={{ padding: "4px 8px", color: "#f87171" }}
                                  title="Delete"
                                >
                                  <IconTrash size={13} color="currentColor" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: PORTALS & CONTENT
             ========================================================= */}
          {activeTab === "portals" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-md-lg)" }}>
                {Object.keys(portalsData)
                  .filter((k) => selectedPortal === "all" || k === selectedPortal)
                  .map((key) => {
                    const portal = portalsData[key];
                    return (
                      <div key={key} className={styles.tableCard} style={{ padding: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                          <div>
                            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", color: "#ffffff", margin: 0 }}>
                              {portal.name}
                            </h3>
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                              Endpoint: /{portal.slug}
                            </span>
                          </div>
                          <Link href={`/${portal.slug}`} target="_blank" className={styles.secondaryBtn} style={{ padding: "6px 10px" }}>
                            <IconEye size={14} color="currentColor" />
                            <span>Preview</span>
                          </Link>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Tagline Headline</label>
                          <input
                            type="text"
                            value={portal.tagline}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortalsData((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], tagline: val },
                              }));
                            }}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Subtitle Description</label>
                          <textarea
                            value={portal.subtitle}
                            rows={3}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortalsData((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], subtitle: val },
                              }));
                            }}
                            className={styles.formTextarea}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)" }}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Hero Eyebrow Badge</label>
                            <input
                              type="text"
                              value={portal.badge}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortalsData((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], badge: val },
                                }));
                              }}
                              className={styles.formInput}
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Purity / Cert Badge</label>
                            <input
                              type="text"
                              value={portal.featuredBadge}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortalsData((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], featuredBadge: val },
                                }));
                              }}
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => triggerToast(`Saved configuration for ${portal.name}`)}
                          className={styles.secondaryBtn}
                          style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
                        >
                          <IconCheck size={14} color="#10b981" />
                          <span>Save {portal.name} Settings</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: CATALOG OFFERINGS
             ========================================================= */}
          {activeTab === "catalog" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "var(--space-md-lg)", flexWrap: "wrap" }}>
                <div style={{ position: "relative", minWidth: "260px" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
                    <IconSearch size={14} color="var(--color-text-muted)" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search catalog offerings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "9px 14px 9px 34px",
                      color: "#ffffff",
                      fontSize: "var(--text-sm)",
                      outline: "none",
                    }}
                  />
                </div>

                <button onClick={() => setShowNewProductModal(true)} className={styles.primaryBtn}>
                  <IconPlus size={16} color="#050507" />
                  <span>Add New Product Offering</span>
                </button>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>
                    Listed Offerings ({filteredProducts.length}) - Untracked Inventory
                  </div>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Product Title</th>
                        <th>Sub-Portal</th>
                        <th>Category</th>
                        <th>Specification</th>
                        <th>Grade / Purity</th>
                        <th>Price</th>
                        <th>Display Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600, color: "#ffffff" }}>{p.name}</td>
                          <td>
                            <span style={{ padding: "3px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", fontSize: "var(--text-2xs)", fontWeight: 600 }}>
                              {p.portalName}
                            </span>
                          </td>
                          <td>{p.category}</td>
                          <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{p.spec}</td>
                          <td style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{p.purity}</td>
                          <td style={{ fontWeight: 700, color: "#ffffff" }}>{p.price}</td>
                          <td>
                            <button
                              onClick={() => handleToggleProductActive(p.id)}
                              style={{
                                border: "none",
                                background: p.active ? "rgba(var(--color-success-rgb), 0.15)" : "rgba(255, 255, 255, 0.05)",
                                color: p.active ? "var(--color-success-text)" : "var(--color-text-muted)",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "var(--text-2xs)",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {p.active ? "Published" : "Hidden"}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                const newPrice = prompt(`Update price for ${p.name}:`, p.price);
                                if (newPrice) {
                                  setAllProducts((prev) =>
                                    prev.map((item) => (item.id === p.id ? { ...item, price: newPrice } : item))
                                  );
                                  triggerToast(`Updated price for ${p.name}`);
                                }
                              }}
                              className={styles.secondaryBtn}
                              style={{ padding: "4px 8px" }}
                              title="Edit Price"
                            >
                              <IconEdit size={14} color="currentColor" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: FAQS KNOWLEDGE BASE
             ========================================================= */}
          {activeTab === "faqs" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "var(--space-md-lg)", flexWrap: "wrap" }}>
                <div style={{ position: "relative", minWidth: "260px" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
                    <IconSearch size={14} color="var(--color-text-muted)" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search FAQ questions or answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "9px 14px 9px 34px",
                      color: "#ffffff",
                      fontSize: "var(--text-sm)",
                      outline: "none",
                    }}
                  />
                </div>

                <button onClick={() => setShowNewFaqModal(true)} className={styles.primaryBtn}>
                  <IconPlus size={16} color="#050507" />
                  <span>Create New FAQ Article</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className={styles.tableCard} style={{ padding: "var(--space-md-lg) 24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "8px" }}>
                      <div>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.06)", fontSize: "var(--text-2xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                          {faq.portalName}
                        </span>
                        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", color: "#ffffff", marginTop: "6px", marginBottom: "4px" }}>
                          {faq.q}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className={styles.secondaryBtn}
                        style={{ padding: "6px", color: "#f87171" }}
                        title="Delete FAQ"
                      >
                        <IconTrash size={14} color="currentColor" />
                      </button>
                    </div>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 6: SECURITY & WEBHOOKS
             ========================================================= */}
          {activeTab === "settings" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-md-lg)" }}>
              <div className={styles.tableCard} style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "17px", color: "#ffffff", marginBottom: "16px" }}>
                  Discreet Fulfillment &amp; Notifications
                </h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Admin Notification Email</label>
                  <input
                    type="email"
                    defaultValue="Pushinpacks30@gmail.com"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discreet Packaging Header</label>
                  <input
                    type="text"
                    defaultValue="Logistics Service Group LLC"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>PGP Public Key for Inquiry Encryption</label>
                  <textarea
                    defaultValue="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;Version: Keybase OpenPGP v2.1.13&#10;mQENBGY6s2sBCADZ4xK...&#10;-----END PGP PUBLIC KEY BLOCK-----"
                    rows={4}
                    className={styles.formTextarea}
                  />
                </div>
                <button
                  onClick={() => triggerToast("Security and notification settings updated")}
                  className={styles.primaryBtn}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <IconCheck size={16} color="#050507" />
                  <span>Update Notification Protocols</span>
                </button>
              </div>

              <div className={styles.tableCard} style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "17px", color: "#ffffff", marginBottom: "16px" }}>
                  Webhook Integrations
                </h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Live Webhook Endpoint</label>
                  <input
                    type="url"
                    defaultValue="https://api.pushinpacks.network/v1/inquiries/stream"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>HMAC Secret Key</label>
                  <input
                    type="password"
                    defaultValue="pk_live_839174910283749201"
                    className={styles.formInput}
                  />
                </div>
                <div style={{ marginTop: "24px", padding: "16px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
                    Endpoint Verification Status
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                    Receiving real-time payload pings on inquiry cart submissions. Verified HTTP 200 acknowledgment.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 7: WHATSAPP DIRECT ORDERS DESK
             ========================================================= */}
          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Top Action Bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", color: "#ffffff", margin: 0, fontWeight: 800 }}>
                    Live WhatsApp Orders Desk
                  </h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "4px 0 0 0" }}>
                    Verified orders recorded in database before customer was routed to WhatsApp click-to-chat.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-sm-md)", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={refreshAdminData} className={styles.secondaryBtn}>
                    <IconRefresh size={14} color="currentColor" />
                    <span>Refresh Orders</span>
                  </button>
                  {liveOrders.length === 0 ? (
                    <button onClick={handleInitializeOrdersOnly} className={styles.secondaryBtn}>
                      <IconPlus size={14} color="currentColor" />
                      <span>Initialize Sample Order</span>
                    </button>
                  ) : (
                    <button onClick={handleClearOrdersOnly} className={styles.secondaryBtn} style={{ color: "#f87171" }}>
                      <IconTrash size={14} color="currentColor" />
                      <span>Clear Orders</span>
                    </button>
                  )}
                  <Link href="/checkout" target="_blank" className={styles.primaryBtn}>
                    <IconExternalLink size={14} color="#050507" />
                    <span>Open Live Checkout</span>
                  </Link>
                </div>
              </div>

              {/* KPI Metrics Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-md-lg)", marginBottom: "8px" }}>
                <div className={styles.metricCard}>
                  <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Total Registered Orders
                  </div>
                  <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                    {liveOrders.length}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: liveOrders.length > 0 ? "var(--color-brand-green)" : "var(--color-text-dim)", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <IconCheck size={14} color={liveOrders.length > 0 ? "#25D366" : "#71717a"} />
                    <span>{liveOrders.length > 0 ? "Recorded in Database" : "No orders in database"}</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Active In Pipeline
                  </div>
                  <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                    {liveOrders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "processing").length}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "6px" }}>
                    Pending coordination
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Fulfilled / Dispatched
                  </div>
                  <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                    {liveOrders.filter((o) => o.orderStatus === "fulfilled" || o.orderStatus === "shipped").length}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "6px" }}>
                    Delivered &amp; completed
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Cumulative Desk Value
                  </div>
                  <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                    ${ordersVolumeTotal.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "6px" }}>
                    Verified order value
                  </div>
                </div>
              </div>

              {liveOrders.length === 0 ? (
                <div className={styles.tableCard} style={{ padding: "56px 24px", textAlign: "center" }}>
                  <IconWhatsApp size={44} color="#25D366" />
                  <h4 style={{ color: "#ffffff", marginTop: "18px", marginBottom: "8px", fontSize: "var(--text-lg)" }}>No orders recorded yet</h4>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", maxWidth: "460px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
                    When customers complete the checkout flow at /checkout, orders are automatically saved here before launching WhatsApp. You can also initialize a sample order for demonstration.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={handleInitializeOrdersOnly} className={styles.secondaryBtn}>
                      <IconPlus size={15} color="currentColor" />
                      <span>Initialize Sample Order</span>
                    </button>
                    <Link href="/checkout" target="_blank" className={styles.primaryBtn} style={{ display: "inline-flex" }}>
                      <IconExternalLink size={15} color="#050507" />
                      <span>Test WhatsApp Checkout</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className={styles.ordersTableCard}>
                  {/* Search & Filter Bar */}
                  <div className={styles.ordersToolbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
                      <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex" }}>
                          <IconSearch size={15} color="var(--color-text-muted)" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search customer, phone, ref, or address..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            padding: "9px 14px 9px 36px",
                            color: "#ffffff",
                            fontSize: "var(--text-sm)",
                            outline: "none",
                          }}
                        />
                      </div>
                      {orderSearchQuery && (
                        <button
                          onClick={() => setOrderSearchQuery("")}
                          style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xs)", cursor: "pointer" }}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Status Filter Pills */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      {["all", "pending", "confirmed", "processing", "shipped", "fulfilled", "cancelled"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          style={{
                            padding: "6px var(--space-sm-md)",
                            borderRadius: "6px",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            cursor: "pointer",
                            textTransform: "capitalize",
                            border: orderStatusFilter === st ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                            background: orderStatusFilter === st ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                            color: orderStatusFilter === st ? "#ffffff" : "var(--color-text-muted)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {st === "all" ? "All Orders" : st}
                        </button>
                      ))}
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginLeft: "8px" }}>
                        Showing {liveOrders.filter((ord) => {
                          const matchesStatus = orderStatusFilter === "all" || ord.orderStatus === orderStatusFilter;
                          const q = orderSearchQuery.toLowerCase();
                          const matchesSearch =
                            !q ||
                            (ord.orderReference && ord.orderReference.toLowerCase().includes(q)) ||
                            (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(q)) ||
                            (ord.customer?.phone && ord.customer.phone.toLowerCase().includes(q)) ||
                            (ord.customer?.email && ord.customer.email.toLowerCase().includes(q)) ||
                            (ord.customer?.city && ord.customer.city.toLowerCase().includes(q)) ||
                            (ord.customer?.address && ord.customer.address.toLowerCase().includes(q));
                          return matchesStatus && matchesSearch;
                        }).length} of {liveOrders.length}
                      </span>
                    </div>
                  </div>

                  <div className={styles.ordersTableWrapper}>
                    <table className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th style={{ width: "170px", minWidth: "170px" }}>Reference</th>
                          <th style={{ width: "240px", minWidth: "240px" }}>Customer Details</th>
                          <th style={{ width: "250px", minWidth: "250px" }}>Fulfillment / Destination</th>
                          <th style={{ width: "200px", minWidth: "200px" }}>Items Ordered</th>
                          <th style={{ width: "140px", minWidth: "140px" }}>Channel</th>
                          <th style={{ width: "150px", minWidth: "150px" }}>Total Amount</th>
                          <th style={{ width: "180px", minWidth: "180px" }}>Order Status</th>
                          <th style={{ width: "160px", minWidth: "160px" }}>Payment Status</th>
                          <th style={{ width: "120px", minWidth: "120px" }}>Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveOrders
                          .filter((ord) => {
                            const matchesStatus = orderStatusFilter === "all" || ord.orderStatus === orderStatusFilter;
                            const q = orderSearchQuery.toLowerCase();
                            const matchesSearch =
                              !q ||
                              (ord.orderReference && ord.orderReference.toLowerCase().includes(q)) ||
                              (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(q)) ||
                              (ord.customer?.phone && ord.customer.phone.toLowerCase().includes(q)) ||
                              (ord.customer?.email && ord.customer.email.toLowerCase().includes(q)) ||
                              (ord.customer?.city && ord.customer.city.toLowerCase().includes(q)) ||
                              (ord.customer?.address && ord.customer.address.toLowerCase().includes(q));
                            return matchesStatus && matchesSearch;
                          })
                          .map((ord) => (
                            <tr key={ord.id}>
                              <td>
                                <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#ffffff", fontSize: "var(--text-sm)", letterSpacing: "0.5px" }}>
                                  {ord.orderReference}
                                </span>
                                <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", marginTop: "6px" }}>
                                  {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "var(--text-md)" }}>{ord.customer?.fullName}</div>
                                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: "4px" }}>{ord.customer?.phone}</div>
                                {ord.customer?.email && (
                                  <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
                                    {ord.customer.email}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 9px",
                                    borderRadius: "8px",
                                    fontSize: "var(--text-2xs)",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    background: "rgba(255, 255, 255, 0.06)",
                                    color: "#ffffff",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    marginBottom: "6px",
                                  }}
                                >
                                  {(ord.deliveryMethod || ord.delivery?.method) === "delivery" ? "Home Delivery" : "Store Pickup"}
                                </span>
                                {((ord.deliveryMethod || ord.delivery?.method) === "delivery") && (ord.customer?.address || ord.delivery?.address) && (
                                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                                    {ord.customer?.address || ord.delivery?.address}{ord.customer?.city || ord.delivery?.city ? `, ${ord.customer?.city || ord.delivery?.city}` : ""}
                                  </div>
                                )}
                              </td>
                              <td>
                                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                                  {ord.items && ord.items.length > 0 ? (
                                    ord.items.map((it, idx) => (
                                      <div key={idx} style={{ marginBottom: "2px" }}>
                                        <span style={{ color: "#ffffff", fontWeight: 600 }}>x{it.quantity}</span> {it.productNameSnapshot || it.name || "Item"}
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ color: "var(--color-text-muted)" }}>No items listed</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "5px 12px",
                                    borderRadius: "8px",
                                    fontSize: "var(--text-2xs)",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    background: ord.checkoutChannel === "telegram" ? "rgba(0, 136, 204, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                    color: ord.checkoutChannel === "telegram" ? "#38bdf8" : "#ffffff",
                                    border: ord.checkoutChannel === "telegram" ? "1px solid rgba(0, 136, 204, 0.3)" : "1px solid rgba(255, 255, 255, 0.12)",
                                  }}
                                >
                                  {ord.checkoutChannel === "telegram" ? "Telegram" : (ord.selectedPaymentMethod || ord.paymentMethod || "WhatsApp")}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "15px" }}>
                                  ${Number(ord.finalTotal ?? ord.total ?? 0).toFixed(2)}
                                </span>
                                <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", marginTop: "4px" }}>
                                  {ord.items?.length || 0} {(ord.items?.length || 0) === 1 ? "item" : "items"}
                                </div>
                              </td>
                              <td>
                                <CustomDropdown
                                  value={ord.orderStatus}
                                  onChange={(val) => handleUpdateOrderStatus(ord.id, val, ord.paymentStatus)}
                                  variant="status"
                                  options={[
                                    { value: "pending", label: "Pending", color: "#ffffff", bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.15)" },
                                    { value: "confirmed", label: "Confirmed", color: "#ffffff", bg: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.18)" },
                                    { value: "processing", label: "Processing", color: "#ffffff", bg: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.18)" },
                                    { value: "shipped", label: "Shipped", color: "#ffffff", bg: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.18)" },
                                    { value: "fulfilled", label: "Fulfilled", color: "#25D366", bg: "rgba(37, 211, 102, 0.12)", borderColor: "rgba(37, 211, 102, 0.25)" },
                                    { value: "cancelled", label: "Cancelled", color: "#a1a1aa", bg: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" },
                                  ]}
                                />
                              </td>
                              <td>
                                <CustomDropdown
                                  value={ord.paymentStatus}
                                  onChange={(val) => handleUpdateOrderStatus(ord.id, ord.orderStatus, val)}
                                  variant="status"
                                  options={[
                                    { value: "unpaid", label: "Unpaid", color: "#e4e4e7", bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.15)" },
                                    { value: "paid", label: "Paid", color: "#25D366", bg: "rgba(37, 211, 102, 0.12)", borderColor: "rgba(37, 211, 102, 0.25)" },
                                    { value: "refunded", label: "Refunded", color: "#a1a1aa", bg: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" },
                                  ]}
                                />
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                  <button
                                    onClick={() => setSelectedOrder(ord)}
                                    className={styles.secondaryBtn}
                                    style={{ padding: "7px 11px" }}
                                    title="Inspect details"
                                  >
                                    <IconEye size={14} color="currentColor" />
                                  </button>
                                  {ord.checkoutChannel === "telegram" ? (
                                    <a
                                      href={ord.telegramUrl || "https://t.me/packmans619_1"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.secondaryBtn}
                                      style={{ padding: "7px 11px", color: "#38bdf8" }}
                                      title="Chat on Telegram"
                                    >
                                      <IconTelegram size={14} />
                                    </a>
                                  ) : (
                                    <a
                                      href={`https://wa.me/${ord.customer?.phone?.replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.secondaryBtn}
                                      style={{ padding: "7px 11px", color: "var(--color-brand-green)" }}
                                      title="Chat on WhatsApp"
                                    >
                                      <IconWhatsApp size={14} color="#25D366" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 8: STORE & WHATSAPP CHECKOUT CONFIGURATION
             ========================================================= */}
          {activeTab === "store-config" && storeConfig && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className={styles.tableCard} style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md-lg)" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", color: "#ffffff", margin: 0 }}>
                      General Store &amp; WhatsApp Settings
                    </h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "4px 0 0 0" }}>
                      Configure the receiver phone number, default currency, and fulfillment fees.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveStoreConfig}
                    className={styles.primaryBtn}
                    disabled={isSavingConfig}
                  >
                    <IconCheck size={16} color="#050507" />
                    <span>{isSavingConfig ? "Saving..." : "Save Configuration"}</span>
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store / Desk Name</label>
                    <input
                      type="text"
                      value={storeConfig.storeName || ""}
                      onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                      className={styles.formInput}
                      placeholder="e.g. PushinPacks Direct Desk"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Store WhatsApp Number (with country code, no + or spaces)
                    </label>
                    <input
                      type="text"
                      value={storeConfig.whatsappNumber || storeConfig.whatsAppNumber || ""}
                      onChange={(e) => setStoreConfig({ ...storeConfig, whatsappNumber: e.target.value, whatsAppNumber: e.target.value })}
                      className={styles.formInput}
                      placeholder="e.g. 16195550199"
                    />
                    <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-dim)", marginTop: "4px" }}>
                      Orders submitted by customers are directed to this WhatsApp account: https://wa.me/{storeConfig.whatsappNumber || storeConfig.whatsAppNumber}
                    </span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Default Currency</label>
                    <CustomDropdown
                      value={storeConfig.currency || "USD"}
                      onChange={(val) => setStoreConfig({ ...storeConfig, currency: val })}
                      options={[
                        { value: "USD", label: "USD ($) - United States Dollar (Strictly Standard)" },
                      ]}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Flat Home Delivery Fee (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={storeConfig.deliveryFeeUSD ?? storeConfig.deliveryFeeUsd ?? 15.00}
                      onChange={(e) => setStoreConfig({ ...storeConfig, deliveryFeeUSD: parseFloat(e.target.value) || 0, deliveryFeeUsd: parseFloat(e.target.value) || 0 })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store Contact Email</label>
                    <input
                      type="email"
                      value={storeConfig.storeContactEmail || storeConfig.storeEmail || ""}
                      onChange={(e) => setStoreConfig({ ...storeConfig, storeContactEmail: e.target.value, storeEmail: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Telegram Contact Link</label>
                    <input
                      type="text"
                      value={storeConfig.telegramNumber || ""}
                      onChange={(e) => setStoreConfig({ ...storeConfig, telegramNumber: e.target.value })}
                      className={styles.formInput}
                      placeholder="e.g. https://t.me/packmans619_1"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Instructions Management */}
              <div className={styles.tableCard} style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", color: "#ffffff", marginBottom: "8px" }}>
                  Payment Methods &amp; Customer Instructions
                </h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-md-lg)" }}>
                  Customize the guidance shown to customers on /checkout when they select each payment card.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {storeConfig.paymentInstructions &&
                    Object.keys(storeConfig.paymentInstructions).map((key) => (
                      <div
                        key={key}
                        style={{
                          padding: "16px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontWeight: 700, color: "#ffffff", fontSize: "var(--text-md)", textTransform: "uppercase" }}>{key}</span>
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                          <label className={styles.formLabel}>Instructions Text</label>
                          <textarea
                            rows={2}
                            value={storeConfig.paymentInstructions[key] || ""}
                            onChange={(e) => {
                              const updated = { ...storeConfig.paymentInstructions, [key]: e.target.value };
                              setStoreConfig({ ...storeConfig, paymentInstructions: updated });
                            }}
                            className={styles.formTextarea}
                          />
                        </div>
                      </div>
                    ))}
                </div>

                <div style={{ marginTop: "var(--space-md-lg)", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleSaveStoreConfig}
                    className={styles.primaryBtn}
                    disabled={isSavingConfig}
                  >
                    <IconCheck size={16} color="#050507" />
                    <span>{isSavingConfig ? "Saving..." : "Save Payment Instructions"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          MODAL 1: INQUIRY INSPECTOR MODAL
         ========================================================= */}
      {selectedInquiry && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedInquiry(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)" }}>
                  Inquiry Review
                </span>
                <div className={styles.modalTitle}>{selectedInquiry.id}</div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xl)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                Client Details
              </div>
              <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "15px" }}>{selectedInquiry.client}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{selectedInquiry.email}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
                Origin: {selectedInquiry.portalName} ({selectedInquiry.date})
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Requested Items
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedInquiry.items?.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#ffffff" }}>{it.name}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Quantity: {it.qty || 1}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "#ffffff" }}>{it.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-sm-md)", padding: "10px 14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Estimated Value</span>
                <span style={{ fontSize: "var(--text-base)", fontWeight: 800, color: "#ffffff" }}>{selectedInquiry.totalValue}</span>
              </div>
            </div>

            {selectedInquiry.notes && (
              <div style={{ marginBottom: "var(--space-md-lg)", padding: "var(--space-sm-md)", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "var(--text-2xs)", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                  Client Message / Notes
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{selectedInquiry.notes}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  handleUpdateInquiryStatus(selectedInquiry.id, "Quoted");
                  setSelectedInquiry(null);
                }}
                className={styles.primaryBtn}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Mark as Quoted
              </button>
              <button
                onClick={() => {
                  handleUpdateInquiryStatus(selectedInquiry.id, "Fulfilled");
                  setSelectedInquiry(null);
                }}
                className={styles.secondaryBtn}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Mark as Fulfilled
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: NEW INQUIRY MODAL (ADMIN INITIATIVE)
         ========================================================= */}
      {showNewInquiryModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewInquiryModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Add New Client Inquiry</div>
              <button
                onClick={() => setShowNewInquiryModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xl)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInquirySubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Origin Sub-Portal</label>
                <CustomDropdown
                  value={newInquiryData.portalKey}
                  onChange={(val) => setNewInquiryData({ ...newInquiryData, portalKey: val })}
                  options={[
                    { value: "peptides", label: "Peptides (/peptides)" },
                    { value: "budcart", label: "Bud'Cart (/budcart)" },
                    { value: "stocks", label: "Stocks (/stocks)" },
                    { value: "glock", label: "Glock Precision (/glock)" },
                    { value: "psychedelics", label: "Psychedelics (/psychedelics)" },
                    { value: "pharms", label: "Pharms & Lab (/pharms)" },
                  ]}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Vance"
                    value={newInquiryData.client}
                    onChange={(e) => setNewInquiryData({ ...newInquiryData, client: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Client Email</label>
                  <input
                    type="email"
                    placeholder="e.g. client@domain.com"
                    value={newInquiryData.email}
                    onChange={(e) => setNewInquiryData({ ...newInquiryData, email: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. GHK-Cu Copper Peptide (50mg * 10 vials)"
                  value={newInquiryData.itemName}
                  onChange={(e) => setNewInquiryData({ ...newInquiryData, itemName: e.target.value })}
                  required
                  className={styles.formInput}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newInquiryData.qty}
                    onChange={(e) => setNewInquiryData({ ...newInquiryData, qty: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Estimated Total Price</label>
                  <input
                    type="text"
                    placeholder="e.g. $150.00"
                    value={newInquiryData.price}
                    onChange={(e) => setNewInquiryData({ ...newInquiryData, price: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Client Notes / Dispatch Instructions</label>
                <textarea
                  placeholder="Specific cold chain packaging or certificate requirements..."
                  value={newInquiryData.notes}
                  onChange={(e) => setNewInquiryData({ ...newInquiryData, notes: e.target.value })}
                  rows={3}
                  className={styles.formTextarea}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button type="submit" className={styles.primaryBtn} style={{ flex: 1, justifyContent: "center" }}>
                  Record Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewInquiryModal(false)}
                  className={styles.secondaryBtn}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: NEW PRODUCT OFFERING
         ========================================================= */}
      {showNewProductModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewProductModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Add New Catalog Offering</div>
              <button
                onClick={() => setShowNewProductModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xl)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Sub-Portal</label>
                <CustomDropdown
                  value={newProductData.portalKey}
                  onChange={(val) => setNewProductData({ ...newProductData, portalKey: val })}
                  options={[
                    { value: "peptides", label: "Peptides (/peptides)" },
                    { value: "budcart", label: "Bud'Cart (/budcart)" },
                    { value: "stocks", label: "Stocks (/stocks)" },
                    { value: "glock", label: "Glock Precision (/glock)" },
                    { value: "psychedelics", label: "Psychedelics (/psychedelics)" },
                    { value: "pharms", label: "Pharms & Lab (/pharms)" },
                  ]}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. BPC-157 Lyophilized Compound"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  required
                  className={styles.formInput}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Regenerative"
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price</label>
                  <input
                    type="text"
                    placeholder="e.g. $45.00"
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Specification</label>
                  <input
                    type="text"
                    placeholder="e.g. 5mg * 10 vials"
                    value={newProductData.spec}
                    onChange={(e) => setNewProductData({ ...newProductData, spec: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Purity / Grade Rating</label>
                  <input
                    type="text"
                    placeholder="e.g. 99.5% HPLC"
                    value={newProductData.purity}
                    onChange={(e) => setNewProductData({ ...newProductData, purity: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  placeholder="Detailed description of compound or hardware characteristics..."
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  rows={3}
                  className={styles.formTextarea}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button type="submit" className={styles.primaryBtn} style={{ flex: 1, justifyContent: "center" }}>
                  Publish Offering
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className={styles.secondaryBtn}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: NEW FAQ ARTICLE
         ========================================================= */}
      {showNewFaqModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewFaqModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Create New FAQ Knowledge Article</div>
              <button
                onClick={() => setShowNewFaqModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xl)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFaq}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Sub-Portal</label>
                <CustomDropdown
                  value={newFaqData.portalKey}
                  onChange={(val) => setNewFaqData({ ...newFaqData, portalKey: val })}
                  options={[
                    { value: "peptides", label: "Peptides (/peptides)" },
                    { value: "budcart", label: "Bud'Cart (/budcart)" },
                    { value: "stocks", label: "Stocks (/stocks)" },
                    { value: "glock", label: "Glock Precision (/glock)" },
                    { value: "psychedelics", label: "Psychedelics (/psychedelics)" },
                    { value: "pharms", label: "Pharms & Lab (/pharms)" },
                  ]}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Question Title</label>
                <input
                  type="text"
                  placeholder="e.g. What is the recommended reconstitution volume?"
                  value={newFaqData.q}
                  onChange={(e) => setNewFaqData({ ...newFaqData, q: e.target.value })}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Detailed Answer</label>
                <textarea
                  placeholder="Write verified answer and laboratory handling guidelines..."
                  value={newFaqData.a}
                  onChange={(e) => setNewFaqData({ ...newFaqData, a: e.target.value })}
                  rows={4}
                  required
                  className={styles.formTextarea}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button type="submit" className={styles.primaryBtn} style={{ flex: 1, justifyContent: "center" }}>
                  Publish FAQ Article
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewFaqModal(false)}
                  className={styles.secondaryBtn}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: ORDER INSPECTOR MODAL
         ========================================================= */}
      {selectedOrder && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-brand-green)", fontWeight: 700 }}>
                  Order Details
                </span>
                <div className={styles.modalTitle}>{selectedOrder.orderReference}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", fontSize: "var(--text-xl)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: "16px", padding: "var(--space-sm-md)", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                Customer Information
              </div>
              <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "15px" }}>{selectedOrder.customer?.fullName}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                Phone: {selectedOrder.customer?.phone}
              </div>
              {selectedOrder.customer?.email && (
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  Email: {selectedOrder.customer.email}
                </div>
              )}
            </div>

            {/* Fulfillment & Destination */}
            <div style={{ marginBottom: "16px", padding: "var(--space-sm-md)", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                Fulfillment &amp; Destination
              </div>
              <div style={{ fontWeight: 600, color: "#ffffff" }}>
                Method: {(selectedOrder.deliveryMethod || selectedOrder.delivery?.method) === "delivery" ? "Home Delivery" : "Store Pickup"}
              </div>
              {((selectedOrder.deliveryMethod || selectedOrder.delivery?.method) === "delivery") && (selectedOrder.customer?.address || selectedOrder.delivery?.address) && (
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  Address: {selectedOrder.customer?.address || selectedOrder.delivery?.address}{selectedOrder.customer?.city || selectedOrder.delivery?.city ? `, ${selectedOrder.customer?.city || selectedOrder.delivery?.city}` : ""}
                </div>
              )}
            </div>

            {/* Payment & Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm-md)", marginBottom: "16px" }}>
              <div style={{ padding: "var(--space-sm-md)", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Payment Method
                </div>
                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "var(--text-md)", marginTop: "4px", textTransform: "capitalize" }}>
                  {selectedOrder.selectedPaymentMethod || selectedOrder.paymentMethod || "Direct"}
                </div>
              </div>

              <div style={{ padding: "var(--space-sm-md)", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Payment Status
                </div>
                <div style={{ fontWeight: 700, color: selectedOrder.paymentStatus === "paid" ? "#25D366" : "#e4e4e7", fontSize: "var(--text-md)", marginTop: "4px", textTransform: "capitalize" }}>
                  {selectedOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Ordered Products
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto" }}>
                {selectedOrder.items?.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "6px",
                      padding: "8px var(--space-sm-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "var(--text-sm)" }}>{it.productNameSnapshot || it.name || "Product"}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        Qty: {it.quantity} x ${Number(it.unitPriceSnapshot || it.unitPrice || 0).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "var(--text-sm)" }}>
                      ${Number(it.lineTotal || (it.quantity * (it.unitPriceSnapshot || it.unitPrice || 0))).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "var(--space-sm-md)", marginBottom: "var(--space-md-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                <span>Subtotal</span>
                <span>${Number(selectedOrder.orderSubtotal ?? selectedOrder.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "6px" }}>
                <span>Delivery Fee</span>
                <span>${Number(selectedOrder.deliveryFee ?? 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-base)", fontWeight: 800, color: "#ffffff" }}>
                <span>Total Amount</span>
                <span style={{ color: "#ffffff" }}>
                  ${Number(selectedOrder.finalTotal ?? selectedOrder.total ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.customerNotes && (
              <div style={{ marginBottom: "var(--space-md-lg)", padding: "10px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "6px", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                <strong>Customer Notes:</strong> {selectedOrder.customerNotes}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {selectedOrder.checkoutChannel === "telegram" ? (
                <a
                  href={selectedOrder.telegramUrl || "https://t.me/packmans619_1"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                  style={{ flex: 1, minWidth: "200px", justifyContent: "center", background: "linear-gradient(135deg, #0088cc 0%, #0099e5 100%)", color: "#ffffff" }}
                >
                  <IconTelegram size={16} />
                  <span>Message Client on Telegram</span>
                </a>
              ) : (
                <a
                  href={`https://wa.me/${selectedOrder.customer?.phone?.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                  style={{ flex: 1, minWidth: "200px", justifyContent: "center", background: "var(--color-brand-green)", color: "#ffffff" }}
                >
                  <IconWhatsApp size={16} color="#ffffff" />
                  <span>Message Client on WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className={styles.secondaryBtn}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
