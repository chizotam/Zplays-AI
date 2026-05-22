import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToggleLeft, ToggleRight, MessageSquare, ShieldCheck, Zap, Users, Package, HelpCircle, Smartphone, Check, Loader2, RefreshCw } from "lucide-react";
import { AutomationWorkflow } from "../types";

const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: "shift_reminders",
    title: "Automate Shift Reminders",
    description: "Ping backup baristas automatically at 4:30 PM if rosters remain unconfirmed",
    trigger: "Daily at 4:30 PM",
    status: "active",
    category: "staff"
  },
  {
    id: "yelp_auto",
    title: "Auto-Reply to Yelp / Google FAQs",
    description: "Scan active feedback for location, diet, or hour questions and draft instant responses",
    trigger: "Immediate on FAQ Detection",
    status: "active",
    category: "customer"
  },
  {
    id: "inventory_warn",
    title: "Low Bakery Flour Inventory Alert",
    description: "Senses inventory registers. Warns Lagos supply hub if local wheat flour < 3 bags",
    trigger: "Flour count drops < 3 bags",
    status: "paused",
    category: "inventory"
  },
  {
    id: "weekend_broadcast",
    title: "Friday Speclals Newsletter",
    description: "Schedules a broadcast of the weekly menu to your local Lagos WhatsApp customer group",
    trigger: "Fridays at 8:30 AM",
    status: "paused",
    category: "customer"
  }
];

export default function OperationsAutomation() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_WORKFLOWS);
  const [whatsAppConnected, setWhatsAppConnected] = useState<boolean>(false);
  const [whatsAppConnecting, setWhatsAppConnecting] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const handleToggle = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextStatus = w.status === "active" ? "paused" : "active";
          addToast(`"${w.title}" has been successfully ${nextStatus === "active" ? "Activated 🟢" : "Paused 🟡"}`);
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  const handleConnectWhatsApp = () => {
    setWhatsAppConnecting(true);
    addToast("Generating secure zplays QR routing channel...");
    setTimeout(() => {
      setWhatsAppConnecting(false);
      setShowQRModal(true);
    }, 1200);
  };

  const handleSimulateQRScan = () => {
    setScanSuccess(true);
    addToast("QR details received. Authorizing connection...");
    setTimeout(() => {
      setShowQRModal(false);
      setWhatsAppConnected(true);
      setScanSuccess(false);
      addToast("Successfully linked WhatsApp Business with zplays platform! 🎉");
    }, 1500);
  };

  const filteredWorkflows = filterCategory === "all"
    ? workflows
    : workflows.filter((w) => w.category === filterCategory);

  return (
    <div className="space-y-6" id="operations-automation-center">
      {/* Toast Alert stack absolute */}
      <div className="fixed bottom-20 left-4 right-4 z-55 pointer-events-none space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-brand-charcoal text-brand-cream text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-brand-wood mx-auto max-w-sm pointer-events-auto flex items-center justify-center text-center leading-normal"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header info */}
      <div className="bg-brand-emerald-light border border-brand-sage/20 p-5 rounded-2xl flex items-start gap-4">
        <div className="bg-brand-emerald text-brand-cream p-3 rounded-xl shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-brand-charcoal">Operations Companion</h2>
          <p className="text-sm text-brand-wood/85 mt-1 leading-relaxed">
            Eliminate chore lists. Set triggers that communicate automatically over WhatsApp and social channels, keeping your bakery smoothly moving.
          </p>
        </div>
      </div>

      {/* WhatsApp linkage controller bar */}
      <div className="bg-white border border-brand-paper hover:border-brand-paper-dark p-5 rounded-3xl shadow-xs transition-all relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 rounded-full bg-brand-emerald/5 filter blur-xl" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${whatsAppConnected ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-sm text-brand-charcoal">WhatsApp Integration</h3>
                {whatsAppConnected && (
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Live Channel
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-wood/75 mt-0.5 max-w-md">
                Used to dispatch low inventory reminders, daily menu announcements, and staff shift reminders instantly to your team's phones.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {whatsAppConnected ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3">
                <div className="text-left">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Connected Account</div>
                  <div className="text-xs font-mono font-bold text-brand-charcoal">+234 81 1234 5678</div>
                </div>
                <button
                  id="disconnect-whatsapp-btn"
                  onClick={() => {
                    setWhatsAppConnected(false);
                    addToast("WhatsApp channel disconnected successfully.");
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer pl-2 border-l border-emerald-200"
                >
                  Unlink
                </button>
              </div>
            ) : (
              <button
                id="connect-whatsapp-btn"
                onClick={handleConnectWhatsApp}
                disabled={whatsAppConnecting}
                className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {whatsAppConnecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Spinning up channel...</span>
                  </>
                ) : (
                  <>
                    <span>Connect to WhatsApp</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code link simulation dialogue overlay in screen */}
      <AnimatePresence>
        {showQRModal && (
          <div className="relative border border-brand-paper-dark bg-brand-cream-warm p-5 rounded-2xl " id="qr-modal-container">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-medium text-sm text-brand-charcoal">Scan zplays Sync Code</h4>
              <button
                id="close-qr-modal"
                onClick={() => setShowQRModal(false)}
                className="text-xs text-brand-wood hover:text-brand-charcoal cursor-pointer font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="bg-white p-3 rounded-2xl border border-brand-paper shadow-xs flex flex-col items-center justify-center">
                {scanSuccess ? (
                  <div className="h-44 w-44 flex flex-col items-center justify-center text-emerald-800 space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-semibold">Authorizing zplays node...</p>
                  </div>
                ) : (
                  <div className="h-44 w-44 bg-brand-cream rounded-xl border-4 border-brand-charcoal p-2 flex flex-col items-center justify-center relative group">
                    {/* Simulated elegant aesthetic QR pattern using nested grids */}
                    <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i * 3 + 2) % 5 === 0 || i === 0 || i === 3 || i === 12
                              ? "bg-brand-charcoal"
                              : "bg-transparent border border-brand-paper-dark"
                          }`}
                        />
                      ))}
                    </div>
                    {/* scanning visual bar */}
                    <div className="absolute left-0 right-0 top-0 h-1 bg-brand-terracotta/80 animate-bounce" />
                    <span className="absolute bottom-2 text-[9px] bg-brand-charcoal text-brand-cream px-1.5 py-0.5 rounded-sm">
                      WhatsApp Applet Sync
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-brand-wood/60 mt-1.5">Point camera to link business roster</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-brand-wood">
                  <span className="bg-brand-paper text-brand-charcoal font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
                  <span>Open WhatsApp on your device. Navigate to <strong>Linked Devices</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-brand-wood">
                  <span className="bg-brand-paper text-brand-charcoal font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
                  <span>Point your camera lens at this grid pattern.</span>
                </div>
                <button
                  id="simulate-scan-action-btn"
                  onClick={handleSimulateQRScan}
                  disabled={scanSuccess}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs py-3 rounded-lg font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Simulate QR Scan (Mock Scan)
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Category filters bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {[
          { id: "all", label: "All Active Rules" },
          { id: "customer", label: "Customer Relations" },
          { id: "staff", label: "Roster/Staff Alerts" },
          { id: "inventory", label: "Supplies/Inventory" }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-tab-${tab.id}`}
            onClick={() => setFilterCategory(tab.id)}
            className={`text-xs px-4 py-2 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              filterCategory === tab.id
                ? "bg-brand-charcoal text-brand-cream shadow-xs"
                : "bg-white border border-brand-paper text-brand-wood hover:bg-brand-cream-warm"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rules stack */}
      <div className="space-y-3">
        {filteredWorkflows.map((flow) => {
          const isActive = flow.status === "active";
          return (
            <div
              key={flow.id}
              id={`workflow-card-${flow.id}`}
              className={`bg-white border rounded-2xl p-4 transition-all duration-200 ${
                isActive ? "border-brand-paper-dark" : "border-brand-paper opacity-80"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-display font-bold text-sm ${isActive ? "text-brand-charcoal" : "text-brand-wood/80"}`}>
                      {flow.title}
                    </h4>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      flow.category === "staff"
                        ? "bg-amber-100 text-amber-800"
                        : flow.category === "customer"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {flow.category}
                    </span>
                  </div>
                  <p className="text-xs text-brand-wood/80 leading-relaxed">
                    {flow.description}
                  </p>

                  <div className="flex items-center gap-4 pt-1.5 text-[11px] text-brand-wood/65 font-mono">
                    <div>
                      <span className="font-semibold text-brand-charcoal">Trigger: </span>
                      <span>{flow.trigger}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`toggle-action-${flow.id}`}
                  onClick={() => handleToggle(flow.id)}
                  className="shrink-0 transition-transform active:scale-95 text-brand-wood cursor-pointer"
                  title={isActive ? "Deactivate rule" : "Activate rule"}
                >
                  {isActive ? (
                    <div className="text-brand-terracotta flex items-center justify-center">
                      <ToggleRight className="w-12 h-8" />
                    </div>
                  ) : (
                    <div className="text-gray-300 flex items-center justify-center">
                      <ToggleLeft className="w-12 h-8" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
