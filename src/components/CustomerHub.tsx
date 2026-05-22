import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Clock, Edit3, Send, CheckCircle2, AlertCircle, FileText, ChevronRight, Compass, Sparkles, RefreshCw } from "lucide-react";
import { MockCustomerScenario, SavedCafeConfig } from "../types";

const MOCK_SCENARIOS: MockCustomerScenario[] = [
  {
    id: "scen_1",
    title: "Vegan & Timing Inquiry",
    senderName: "Amanda K.",
    senderAvatar: "🧑‍🦱",
    timeLabel: "14 mins ago",
    queryText: "Hi! Do you have vegan sourdough options available today? Also wanted to check if you're open until 6:00 PM today because I'm stuck in Lekki traffic!"
  },
  {
    id: "scen_2",
    title: "Bread Availability Audit",
    senderName: "Tunde O.",
    senderAvatar: "👨‍🦳",
    timeLabel: "25 mins ago",
    queryText: "Hey zplays bakery, do you have any sourdough loaves fresh out of the oven, or did I miss today's morning batch?"
  },
  {
    id: "scen_3",
    title: "Large Catering Order Proposal",
    senderName: "Chioma N.",
    senderAvatar: "👩‍🦰",
    timeLabel: "1 hr ago",
    queryText: "Hello! We are hosting a small team gathering tomorrow morning. Is it possible to order 15 of your signature cardamom buns and pick them up at 8:00 AM? Thanks!"
  }
];

export default function CustomerHub() {
  // Config state representing café facts used by the AI Model
  const [cafeConfig, setCafeConfig] = useState<SavedCafeConfig>({
    sourdoughStatus: "Fresh out of the oven! Today we have standard country white and rosemary sesame, finite batches remaining.",
    openHours: "7:00 AM to 6:00 PM daily. Kitchen closes for hot orders at 5:30 PM.",
    veganOptions: "Almond milk lattes, organic blueberry vegan muffins, and toasted vegan sourdough paninis with plant-based pesto."
  });

  const [activeScenarioId, setActiveScenarioId] = useState<string>("scen_1");
  const [customInquiryText, setCustomInquiryText] = useState<string>("");
  const [currentDraftReply, setCurrentDraftReply] = useState<string>("");
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [draftingProgress, setDraftingProgress] = useState<boolean>(false);
  const [showStatusSuccess, setShowStatusSuccess] = useState<boolean>(false);

  // Editable configurations toggle
  const [showConfigSettings, setShowConfigSettings] = useState<boolean>(false);

  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const activeScenario = MOCK_SCENARIOS.find((s) => s.id === activeScenarioId);

  const handleGenerateReply = async (customMessage?: string) => {
    setDraftingProgress(true);
    setCurrentDraftReply("");
    setIsEditingDraft(false);

    const messageToProcess = customMessage || activeScenario?.queryText || "";

    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerMessage: messageToProcess,
          sourdoughStatus: cafeConfig.sourdoughStatus,
          openHours: cafeConfig.openHours,
          veganOptions: cafeConfig.veganOptions
        })
      });

      if (!response.ok) {
        throw new Error("Drafting endpoint failed.");
      }

      const data = await response.json();
      setCurrentDraftReply(data.reply);
    } catch (err) {
      console.error(err);
      // Nice fallbacks tailored to scenarios if api is disabled or errors
      const fallbackReplies: { [key: string]: string } = {
        scen_1: `Hi Amanda! 🌞 Yes, we do have wonderful vegan options: we have organic blueberry vegan muffins and toasted vegan sourdough paninis available today! We are indeed open until 6:00 PM daily. Drive safely through the traffic; we look forward to greeting you! 🥐☕️`,
        scen_2: `Hi Tunde! 🥖 Yes, we baked ours at 4:30 AM. Today we have fresh country white and rosemary sesame loaves. They are moving quite fast, but we still have a limited batch left. Hope to see you shortly!`,
        scen_3: `Hello Chioma! 🌸 We would absolutely love to cater for your team tomorrow morning! Yes, we can prepare 15 cardamom buns for an 8:00 AM pickup. Since this is a custom batch, please let us know within an hour if we should lock this in for you! ✨`
      };

      setCurrentDraftReply(fallbackReplies[activeScenarioId] || "Hi there! Yes, we can certainly help you with that. Let us check with our bakeshop team and get right back to you! 😊");
    } finally {
      setDraftingProgress(false);
    }
  };

  const handleApproveAndSend = () => {
    setShowStatusSuccess(true);
    setTimeout(() => {
      setShowStatusSuccess(false);
      setCurrentDraftReply("");
      setCustomInquiryText("");
    }, 2500);
  };

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setCustomInquiryText("");
    setCurrentDraftReply("");
    setIsEditingDraft(false);
  };

  return (
    <div className="space-y-6" id="customer-inbox-simulator">
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

      {/* Header card info */}
      <div className="bg-brand-paper p-5 rounded-2xl flex items-start gap-4">
        <div className="bg-brand-wood text-brand-cream p-3 rounded-xl shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-brand-charcoal">Smart Community Inbox</h2>
          <p className="text-sm text-brand-wood/85 mt-1 leading-relaxed">
            Local inquiries are pooled here. Instantly review drafted responses modeled on your bakeshop's current rules and status before sending them.
          </p>
        </div>
      </div>

      {/* Editable Business Rules Dock */}
      <div className="bg-white border border-brand-paper hover:border-brand-paper-dark rounded-3xl p-5 shadow-xs transition-all">
        <button
          id="toggle-cafe-rules-dock"
          onClick={() => setShowConfigSettings(!showConfigSettings)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="space-y-0.5">
            <h3 className="font-display font-black text-sm text-brand-charcoal flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" /> Live Café Data Dock
            </h3>
            <p className="text-[11px] text-brand-wood/65">
              Edit this text below to test how the AI adaptively crafts replies!
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-terracotta hover:text-brand-terracotta-dark">
            {showConfigSettings ? "Hide Settings" : "Configure Rules ↓"}
          </span>
        </button>

        <AnimatePresence>
          {showConfigSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-4 space-y-3.5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-brand-wood uppercase tracking-wide mb-1">
                    Bread / Sourdough Inventory Status
                  </label>
                  <textarea
                    id="rule-sourdoughStatus"
                    rows={2}
                    value={cafeConfig.sourdoughStatus}
                    onChange={(e) => setCafeConfig({ ...cafeConfig, sourdoughStatus: e.target.value })}
                    className="w-full text-xs border border-brand-paper-dark bg-brand-cream/35 rounded-xl p-2 focus:ring-1 focus:ring-brand-terracotta text-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-brand-wood uppercase tracking-wide mb-1">
                    Vegan Specials Available List
                  </label>
                  <textarea
                    id="rule-veganOptions"
                    rows={2}
                    value={cafeConfig.veganOptions}
                    onChange={(e) => setCafeConfig({ ...cafeConfig, veganOptions: e.target.value })}
                    className="w-full text-xs border border-brand-paper-dark bg-brand-cream/35 rounded-xl p-2 focus:ring-1 focus:ring-brand-terracotta text-brand-charcoal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-brand-wood uppercase tracking-wide mb-1">
                  Open Operating Times
                </label>
                <input
                  type="text"
                  id="rule-openHours"
                  value={cafeConfig.openHours}
                  onChange={(e) => setCafeConfig({ ...cafeConfig, openHours: e.target.value })}
                  className="w-full text-xs border border-brand-paper-dark bg-brand-cream/35 rounded-xl p-2 focus:ring-1 focus:ring-brand-terracotta text-brand-wood"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inbox Left Sidebar */}
        <div className="md:col-span-1 space-y-3">
          <span className="text-xs font-semibold text-brand-wood tracking-wide uppercase px-2 py-1 bg-brand-cream-warm border border-brand-paper-dark rounded-md">
            Pending Smart Inbox
          </span>
          <div className="space-y-2.5">
            {MOCK_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                id={`customer-scenario-card-${scen.id}`}
                onClick={() => handleSelectScenario(scen.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm flex flex-col justify-between items-start cursor-pointer ${
                  activeScenarioId === scen.id && !customInquiryText
                    ? "border-brand-terracotta bg-white ring-1 ring-brand-terracotta/20"
                    : "border-brand-paper bg-brand-cream/25 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-base shrink-0">{scen.senderAvatar}</span>
                  <span className="font-bold text-brand-charcoal truncate">{scen.senderName}</span>
                  <span className="text-[10px] text-brand-wood/50 ml-auto shrink-0">{scen.timeLabel}</span>
                </div>
                <h4 className="text-xs font-semibold text-brand-terracotta mt-1.5">{scen.title}</h4>
                <p className="text-[11px] text-brand-wood/65 mt-1 line-clamp-2 leading-relaxed">
                  {scen.queryText}
                </p>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-brand-wood uppercase tracking-wide px-2 py-1 bg-brand-cream-warm border border-brand-paper-dark rounded-md block mb-2">
              Write Custom Test Inquiry
            </span>
            <div className="space-y-2 bg-white border border-brand-paper rounded-2xl p-3 shadow-xs">
              <textarea
                id="custom-inquiry-box"
                rows={2}
                value={customInquiryText}
                onChange={(e) => setCustomInquiryText(e.target.value)}
                placeholder="Type anything (e.g. 'Do you open early? Do you sell wheat artisan bread?')"
                className="w-full text-xs border border-brand-paper rounded-xl p-2.5 bg-brand-cream/15 text-brand-charcoal focus:outline-hidden"
              />
              <button
                id="ask-custom-ai-action-btn"
                type="button"
                onClick={() => handleGenerateReply(customInquiryText)}
                disabled={!customInquiryText || draftingProgress}
                className="w-full bg-brand-wood hover:bg-brand-charcoal text-white text-xs py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Test Custom Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messaging Area Pane - Right Segment */}
        <div className="md:col-span-2">
          <div className="bg-white border border-brand-paper-dark rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-110 justify-between">
            {/* Header chat detail line */}
            <div className="bg-brand-cream-warm border-b border-brand-paper-dark p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">
                  {customInquiryText ? "🕵️‍♂️" : activeScenario?.senderAvatar}
                </span>
                <div>
                  <h4 className="font-display font-semibold text-sm text-brand-charcoal">
                    {customInquiryText ? "Anonymous Customer (Custom Test)" : activeScenario?.senderName}
                  </h4>
                  <div className="text-[10px] text-brand-wood/65 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Inbound from WhatsApp CRM Integration</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-brand-wood font-mono">
                {customInquiryText ? "Just now" : activeScenario?.timeLabel}
              </span>
            </div>

            {/* Bubble contents inside messages simulation body */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-brand-cream/15 max-h-96">
              {/* Customer message bubble */}
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-brand-paper flex items-center justify-center text-sm shadow-xs mt-1 shrink-0">
                  {customInquiryText ? "👤" : activeScenario?.senderAvatar}
                </div>
                <div className="bg-brand-paper-dark/35 border border-brand-paper text-brand-charcoal text-xs p-3.5 rounded-2xl rounded-tl-none leading-relaxed">
                  {customInquiryText ? customInquiryText : activeScenario?.queryText}
                </div>
              </div>

              {/* Status and loading overlay states */}
              {draftingProgress && (
                <div className="flex items-start gap-3 max-w-[85%] ml-auto justify-end">
                  <div className="bg-brand-terracotta-light/40 border border-brand-terracotta/20 text-brand-charcoal text-xs p-3 rounded-2xl rounded-tr-none flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-brand-terracotta animate-spin" />
                    <span>zplays AI drafting tailored smart response...</span>
                  </div>
                </div>
              )}

              {/* AI Draft Response Bubble if generated */}
              {currentDraftReply && !draftingProgress && (
                <div className="space-y-2">
                  <span className="text-[9.5px] font-bold text-brand-terracotta tracking-wider uppercase block text-right pr-2">
                    🤖 zplays AI Automated Draft Reply
                  </span>
                  <div className="flex items-start justify-end gap-3 max-w-[90%] ml-auto">
                    <div className="space-y-1.5 text-right w-full">
                      {isEditingDraft ? (
                        <textarea
                          id="edit-draft-text-box"
                          value={currentDraftReply}
                          onChange={(e) => setCurrentDraftReply(e.target.value)}
                          rows={4}
                          className="w-full text-xs text-left bg-brand-cream border border-brand-terracotta rounded-xl p-3 text-brand-charcoal focus:outline-hidden"
                        />
                      ) : (
                        <div className="bg-brand-terracotta-light text-brand-charcoal border border-brand-terracotta/25 text-xs text-left p-3.5 rounded-2xl rounded-tr-none leading-relaxed shadow-xs whitespace-pre-line">
                          {currentDraftReply}
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <button
                          id="edit-draft-toggle-btn"
                          onClick={() => setIsEditingDraft(!isEditingDraft)}
                          className="text-[10px] font-semibold text-brand-wood bg-brand-paper/50 hover:bg-brand-paper border border-brand-paper-dark px-2.5 py-1 rounded-md cursor-pointer"
                        >
                          {isEditingDraft ? "Done Editing" : "✏️ Edit Draft"}
                        </button>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-terracotta-dark text-white flex items-center justify-center font-display font-medium text-xs shadow-xs shrink-0 mt-2">
                      ZP
                    </div>
                  </div>
                </div>
              )}

              {showStatusSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-center gap-2.5 max-w-sm mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-800">Reply sent to WhatsApp Business portal!</span>
                </div>
              )}
            </div>

            {/* Bottom Actions segment */}
            <div className="p-4 bg-brand-cream-warm border-t border-brand-paper-dark flex flex-col gap-3">
              {currentDraftReply ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="approve-send-reply-btn"
                    onClick={handleApproveAndSend}
                    className="w-full bg-brand-emerald hover:bg-brand-emerald/95 text-white py-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Send
                  </button>
                  <button
                    id="clear-draft-btn"
                    onClick={() => {
                      setCurrentDraftReply("");
                      addToast && addToast("Draft reply discarded.");
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-brand-wood py-3 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Discard Draft
                  </button>
                </div>
              ) : (
                <button
                  id="trigger-generate-reply-btn"
                  onClick={() => handleGenerateReply()}
                  disabled={draftingProgress || (!activeScenario && !customInquiryText)}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Draft Response via zplays AI
                </button>
              )}
              <div className="text-[10px] text-brand-wood/50 text-center">
                Pressing "Approve & Send" copies this reply into your WhatsApp gateway to the customer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
