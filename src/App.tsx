import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, MessageSquare, BarChart2, Coffee, ShieldCheck, Heart, User, ExternalLink, X, MapPin } from "lucide-react";

import MarketingCenter from "./components/MarketingCenter";
import OperationsAutomation from "./components/OperationsAutomation";
import CustomerHub from "./components/CustomerHub";
import InsightsData from "./components/InsightsData";

export default function App() {
  const [activeTab, setActiveTab] = useState<"marketing" | "operations" | "inbox" | "insights">("marketing");
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  // Track ticking local digital clock for the bakeshop owner
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to sweet short local readable format
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "marketing":
        return <MarketingCenter />;
      case "operations":
        return <OperationsAutomation />;
      case "inbox":
        return <CustomerHub />;
      case "insights":
        return <InsightsData />;
      default:
        return <MarketingCenter />;
    }
  };

  const navItems = [
    { id: "marketing" as const, label: "Boost", desc: "AI Marketing", icon: Sparkles },
    { id: "operations" as const, label: "Automate", desc: "My Workflows", icon: Zap },
    { id: "inbox" as const, label: "Inbox", desc: "Client replies", icon: MessageSquare },
    { id: "insights" as const, label: "Insights", desc: "Value tracker", icon: BarChart2 }
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col lg:py-10" id="app-root-container">
      {/* Central responsive container supporting beautiful full screen on desktop and native-feeling app frame on mobile */}
      <div className="w-full max-w-6xl mx-auto bg-brand-cream lg:bg-white lg:border lg:border-brand-paper lg:rounded-[36px] lg:shadow-2xl flex flex-col lg:flex-row min-h-screen lg:min-h-[820px] lg:max-h-[920px] relative overflow-hidden" id="responsive-app-shell">
        
        {/* DESKTOP SIDEBAR: visible only on lg+ screens */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-brand-paper flex-col p-8 justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-terracotta rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs">z</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none text-brand-charcoal">zplays</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#D97757] font-semibold mt-1">BrewPulse AI</p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-2.5">
              {navItems.map((item) => {
                const isSelected = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`desktop-nav-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 flex items-center gap-3 group shrink-0 select-none cursor-pointer ${
                      isSelected
                        ? "border-brand-paper bg-brand-cream-warm text-brand-terracotta font-semibold"
                        : "border-transparent text-gray-500 hover:bg-brand-cream-warm/50 hover:text-brand-charcoal"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isSelected ? "text-brand-terracotta" : "text-brand-sage group-hover:text-brand-charcoal"}`} />
                    <div className="flex flex-col">
                      <span className="font-bold">{item.label}</span>
                      <span className="text-[9.5px] text-gray-400 font-normal">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Pricing tier block card customized for zplays and Naira */}
          <div className="p-4.5 bg-brand-cream-warm rounded-2xl border border-brand-paper">
            <p className="text-[10px] uppercase font-black tracking-wider text-brand-wood/60 mb-1">Current Tier</p>
            <p className="text-xl font-black text-brand-terracotta">
              ₦25,000<span className="text-xs text-brand-wood font-normal"> / mo</span>
            </p>
            <p className="text-[9.5px] text-brand-wood/75 mt-0.5 font-medium">Prime Pro active status</p>
            <button 
              id="desktop-upgrade-btn"
              onClick={() => {
                alert("You are on our best pricing tier! High-volume automated campaigns are loaded daily.");
              }}
              className="mt-3.5 w-full py-2.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs rounded-xl uppercase tracking-wider font-bold transition-all cursor-pointer"
            >
              Manage Plan
            </button>
          </div>
        </aside>

        {/* MAIN BODY LAYOUT (Responsive) */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          
          {/* Header segment - optimized to show profile or toggle info */}
          <header className="bg-brand-cream-warm border-b border-brand-paper px-6 py-4.5 flex items-center justify-between z-20 sticky top-0 lg:rounded-tr-[31px]" id="app-header-nav">
            <div className="flex items-center gap-2.5">
              {/* Logo icon only visible on mobile headers to avoid duplicate branding on desktop */}
              <div className="lg:hidden w-9 h-9 rounded-xl bg-brand-terracotta text-white flex items-center justify-center font-display font-black text-lg border border-brand-terracotta-dark shadow-xs animate-pulse">
                z
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-lg tracking-tight text-brand-charcoal">
                    {activeTab === "marketing" ? "Daily Post Boost" : activeTab === "operations" ? "Workflows" : activeTab === "inbox" ? "Smart CRM Inbox" : "Analytics Tracker"}
                  </span>
                  <span className="bg-brand-terracotta/10 text-brand-terracotta text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-sm">
                    {activeTab.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-brand-wood/65 font-medium flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-brand-terracotta shrink-0" /> Lagos Bakehouse Node
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-right">
              {/* Clock widget */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-charcoal bg-white px-2.5 py-1 rounded-md border border-brand-paper">
                  ☕️ {currentTimeStr || "13:15"}
                </div>
              </div>

              {/* Profile Avatar Trigger */}
              <button
                id="header-profile-badge-btn"
                onClick={() => setShowProfileModal(true)}
                className="w-8.5 h-8.5 rounded-full bg-brand-cream border border-brand-paper flex items-center justify-center cursor-pointer hover:border-brand-terracotta transition-all overflow-hidden"
                title="View account plans"
              >
                <User className="w-4 h-4 text-brand-wood" />
              </button>
            </div>
          </header>

          {/* Central main workspace body wrapper - scroll container */}
          <main className="flex-1 overflow-y-auto px-5 py-6 pb-24 lg:pb-8 bg-brand-cream/15" id="workspace-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="max-w-4xl mx-auto"
              >
                {renderActiveComponent()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>

        {/* Persistent Bottom Mobile-First Navigation Bar - visible on smaller than lg screens */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-paper px-4 py-3 pb-4 sm:pb-3 z-30 flex items-center justify-around shadow-lg px-2" id="app-bottom-navbar">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center focus:outline-hidden group relative flex-1 cursor-pointer"
              >
                {/* Micro-dot Indicator above bar */}
                {isSelected && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -top-3 w-3 h-1 bg-brand-terracotta rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? "bg-brand-terracotta-light text-brand-terracotta" 
                    : "text-brand-sage group-hover:text-brand-wood"
                }`}>
                  <IconComponent className="w-5 h-5 transition-transform group-active:scale-90" />
                </div>

                <span className={`text-[10px] font-bold mt-1 tracking-wide ${
                  isSelected ? "text-brand-charcoal" : "text-brand-wood/60"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* SaaS Plan / Profile Overlay Drawer Modal */}
        <AnimatePresence>
          {showProfileModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-end lg:items-center justify-center p-4"
              id="profile-overlay-backdrop"
              onClick={() => setShowProfileModal(false)}
            >
              <motion.div
                initial={{ y: 100, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-white border border-brand-paper w-full max-w-md rounded-[32px] p-6 space-y-5 shadow-2xl origin-bottom"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-brand-terracotta" />
                    <h3 className="font-display font-black text-md text-brand-charcoal">
                      zplays Account Profile
                    </h3>
                  </div>
                  <button
                    id="close-profile-modal-btn"
                    onClick={() => setShowProfileModal(false)}
                    className="w-7 h-7 rounded-full bg-brand-cream border border-brand-paper flex items-center justify-center text-brand-wood font-bold hover:bg-brand-cream-warm cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Profile detail card */}
                <div className="bg-brand-cream-warm border border-brand-paper p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-terracotta text-white flex items-center justify-center font-display font-black">
                      C
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-charcoal">Chizotam C.</div>
                      <div className="text-[10px] text-brand-wood/75">chizotamchiaghanam@gmail.com</div>
                    </div>
                  </div>

                  <div className="bg-white border border-brand-paper rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-brand-wood/50">Current Plan Tier</span>
                      <div className="font-display font-extrabold text-sm text-brand-emerald flex items-center gap-1">
                        zplays Prime Pro <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-brand-charcoal">₦25,000 / mo</div>
                      <span className="text-[9px] text-emerald-800 bg-brand-emerald-light font-bold px-1.5 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="space-y-2">
                  <button
                    id="upgrade-plan-action"
                    onClick={() => {
                      alert("You are on our best pricing tier! High-volume automated campaigns are loaded daily.");
                      setShowProfileModal(false);
                    }}
                    className="w-full bg-black hover:bg-brand-charcoal text-white font-bold text-xs py-3 rounded-xl tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Manage Prime Pro Subscriptions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-brand-wood/60 text-center">
                    Payment securely routed via local Nigerian gateways in <strong>₦ Naira</strong>.
                  </p>
                </div>

                {/* Footnote developer copyright branding */}
                <div className="border-t border-brand-paper pt-3 text-center text-[10px] text-brand-wood/50 flex items-center justify-center gap-1">
                  <span>Powering food commerce at</span>
                  <strong className="text-brand-terracotta font-semibold">zplays</strong>
                  <span>・ v1.2.0</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
