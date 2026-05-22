import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Sparkles, Send, Flame, RotateCcw, Image as ImageIcon, Instagram, Heart, MessageCircle, Bookmark, RefreshCw } from "lucide-react";
import { SocialPostGoal, SocialPostResult } from "../types";

const AVAILABLE_GOALS: SocialPostGoal[] = [
  { id: "special", label: "Promote Today's Special", description: "Push sales for high-margin lattes and daily baked pastries" },
  { id: "event", label: "Announce Weekend Event", description: "Get people in seats for live music, workshop, or community meet" },
  { id: "new_pastry", label: "Highlight New Pastry Release", description: "Showcase craft doughs, long-fermented sourdoughs or seasonal pies" },
  { id: "story", label: "Behind-the-Scenes Story", description: "Introduce bakery staff, organic flour sourcing, or early morning baking" },
  { id: "promo", label: "Social Media Quick Boost", description: "Engage locals with a interactive afternoon coffee quiz or discount codes" }
];

const TONE_PRESETS = [
  { value: "warm", label: "Warm & Neighborhood-y", emoji: "☕" },
  { value: "excited", label: "Excited & Foodie", emoji: "🥐" },
  { value: "elegant", label: "Artisanal & High-end", emoji: "🥖" },
  { value: "playful", label: "Playful & Cozy", emoji: "✨" }
];

export default function MarketingCenter() {
  const [selectedGoal, setSelectedGoal] = useState<string>(AVAILABLE_GOALS[0].id);
  const [itemType, setItemType] = useState<string>("Sourdough Cardamom Buns & Double Cortado");
  const [selectedTone, setSelectedTone] = useState<string>("warm");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState<number>(0);
  const [result, setResult] = useState<SocialPostResult | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isPreviewInstagram, setIsPreviewInstagram] = useState<boolean>(true);

  const loadingPhrases = [
    "Warming up the creative deck...",
    "Grinding organic roast adjectives...",
    "Perfecting sourdough hashtags...",
    "Brewing B2B SaaS magic in Naira...",
    "Structuring image prompts with zplays AI..."
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    setCopiedCaption(false);
    setCopiedPrompt(false);

    // Rotate loading phrases every 1.5s
    const phraseInterval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1200);

    try {
      const selectedGoalObj = AVAILABLE_GOALS.find((g) => g.id === selectedGoal);
      const goalLabel = selectedGoalObj ? selectedGoalObj.label : selectedGoal;
      const toneObj = TONE_PRESETS.find((t) => t.value === selectedTone);
      const toneLabel = toneObj ? `${toneObj.label} ${toneObj.emoji}` : selectedTone;

      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goalLabel,
          itemType,
          mood: toneLabel,
          additionalNotes
        })
      });

      if (!response.ok) {
        throw new Error("Generation failure.");
      }

      const data: SocialPostResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Hard fallback if something crashed or failed
      setResult({
        caption: `🥐 Fresh out of the oven! Today we are pairing our hand-crafted, 36-hour fermented Cardamom buns with an organic double cortado. Rich, spiced, and buttery. Come find your new happy place and join the zplays community ritual from 7:00 AM! ✨☕️\n\n#zplays #SourdoughCardamom #CortadoRituals #HandcraftedBakery #LagosLocalFood`,
        imagePrompt: `A rustic bird's-eye shot of a golden sourdough cardamom bun on a handmade ceramic terracotta saucer, paired with a double cortado with milk foam art, cast in soft natural morning window light on a light-cream wooden tabletop.`
      });
    } finally {
      clearInterval(phraseInterval);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "caption" | "prompt") => {
    navigator.clipboard.writeText(text);
    if (type === "caption") {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="ai-marketing-center">
      {/* Header card info */}
      <div className="bg-brand-cream-warm border border-brand-paper-dark p-5 rounded-2xl flex items-start gap-4 shadow-xs">
        <div className="bg-brand-terracotta-light p-3 rounded-xl shrink-0 text-brand-terracotta">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-brand-charcoal">AI Daily Boost</h2>
          <p className="text-sm text-brand-wood/85 mt-1 leading-relaxed">
            Busy dough-making today? Fill in a couple of keywords and let <strong className="text-brand-terracotta font-semibold">zplays AI</strong> write professional social media marketing copy in seconds.
          </p>
        </div>
      </div>

      {/* Inputs block */}
      <div className="bg-white border border-brand-paper p-5 rounded-3xl shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-wood tracking-wide uppercase mb-2">
            1. Campaign Marketing Goal
          </label>
          <div className="grid grid-cols-1 gap-2">
            {AVAILABLE_GOALS.map((goal) => (
              <button
                key={goal.id}
                id={`goal-btn-${goal.id}`}
                onClick={() => setSelectedGoal(goal.id)}
                className={`text-left p-3 rounded-xl border text-sm transition-all duration-200 flex flex-col ${
                  selectedGoal === goal.id
                    ? "border-brand-terracotta bg-brand-terracotta-light/35 text-brand-charcoal ring-1 ring-brand-terracotta/40"
                    : "border-gray-100 hover:border-brand-paper-dark bg-brand-cream/45 text-brand-wood"
                }`}
              >
                <span className="font-semibold text-brand-charcoal">{goal.label}</span>
                <span className="text-xs text-brand-wood/75 mt-0.5">{goal.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-wood tracking-wide uppercase mb-2">
              2. Today's Hero Specials / Items
            </label>
            <input
              type="text"
              id="hero-items-input"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder="e.g. Lavender Latte & Almond Sourdough Croissant"
              className="w-full text-sm border border-brand-paper-dark bg-brand-cream/25 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-charcoal transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-wood tracking-wide uppercase mb-2">
              3. Desired Tone & Vibes
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_PRESETS.map((t) => (
                <button
                  key={t.value}
                  id={`tone-btn-${t.value}`}
                  type="button"
                  onClick={() => setSelectedTone(t.value)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                    selectedTone === t.value
                      ? "border-brand-terracotta bg-brand-terracotta text-white shadow-xs"
                      : "border-gray-100 bg-brand-cream-warm text-brand-charcoal hover:bg-brand-paper"
                  }`}
                >
                  <span className="mr-1">{t.emoji}</span> {t.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-wood tracking-wide uppercase mb-2">
            4. Special Instructions (Optional)
          </label>
          <textarea
            id="special-instructions-input"
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Mention 20% discount until noon; highlight that we source all chocolate ethically."
            className="w-full text-sm border border-brand-paper-dark bg-brand-cream/25 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-charcoal transition-all placeholder:text-gray-400"
          />
        </div>

        <button
          id="generate-post-action"
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !itemType}
          className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{loadingPhrases[loadingPhraseIndex]}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Social Post & Image Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Output screen */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
            id="marketing-results-section"
          >
            {/* Warning indicator if server bypassed */}
            {result.warning && (
              <div className="bg-brand-cream-warm border border-brand-amber/60 text-xs px-4 py-2.5 rounded-lg text-brand-wood flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-brand-terracotta animate-pulse" />
                <span>{result.warning}</span>
              </div>
            )}

            {/* Layout grid containing the social copy + live feed mock visualization wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Draft text segment and actions */}
              <div className="space-y-4">
                <div className="bg-white border border-brand-paper hover:border-brand-paper-dark rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand-terracotta-light text-brand-terracotta text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Draft Caption
                    </span>
                    <button
                      id="copy-caption-btn"
                      onClick={() => copyToClipboard(result.caption, "caption")}
                      className={`text-xs py-1.5 px-3 rounded-lg border font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        copiedCaption
                          ? "bg-emerald-550 border-emerald-600 text-brand-emerald bg-brand-emerald-light"
                          : "bg-white border-gray-100 text-brand-wood hover:border-brand-paper-dark"
                      }`}
                    >
                      {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCaption ? "Copied!" : "Copy Caption"}</span>
                    </button>
                  </div>
                  <div className="bg-brand-cream/45 border border-brand-paper rounded-2xl p-4 text-sm text-brand-charcoal whitespace-pre-line leading-relaxed font-sans max-h-60 overflow-y-auto">
                    {result.caption}
                  </div>
                </div>

                <div className="bg-white border border-brand-paper hover:border-brand-paper-dark rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand-sage/15 text-brand-emerald text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Image Prompt (AI Generator)
                    </span>
                    <button
                      id="copy-image-prompt-btn"
                      onClick={() => copyToClipboard(result.imagePrompt, "prompt")}
                      className={`text-xs py-1.5 px-3 rounded-lg border font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        copiedPrompt
                          ? "bg-emerald-550 border-emerald-600 text-brand-emerald bg-brand-emerald-light"
                          : "bg-white border-gray-100 text-brand-wood hover:border-brand-paper-dark"
                      }`}
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? "Copied!" : "Copy Prompt"}</span>
                    </button>
                  </div>
                  <div className="bg-brand-cream-warm/45 border border-brand-paper rounded-2xl p-4 text-xs font-mono text-brand-wood leading-relaxed max-h-32 overflow-y-auto italic">
                    "{result.imagePrompt}"
                  </div>

                  {/* Aesthetic image simulation container */}
                  <div className="relative group overflow-hidden rounded-2xl border border-dashed border-brand-paper-dark h-36 bg-gradient-to-tr from-brand-amber/15 via-brand-terracotta-light/10 to-brand-sage/15 flex items-center justify-center p-4">
                    <div className="text-center space-y-1 z-10">
                      <p className="text-xs font-medium text-brand-wood/80">Copy the prompt above and paste into Imagen, Canva, or Midjourney!</p>
                      <span className="text-[10px] text-brand-terracotta font-semibold">Prompt optimized for high-conversion culinary food photography.</span>
                    </div>
                    {/* decorative background patterns */}
                    <div className="absolute right-4 top-2 w-16 h-16 rounded-full bg-brand-terracotta/5 filter blur-md" />
                    <div className="absolute left-8 bottom-2 w-12 h-12 rounded-full bg-brand-sage/5 filter blur-lg" />
                  </div>
                </div>
              </div>

              {/* Simulated Live Instagram/Facebook Feed Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-display font-bold text-sm text-brand-wood tracking-wide uppercase">
                    Instagram Mockup Preview
                  </h3>
                  <button
                    id="toggle-feed-preview"
                    onClick={() => setIsPreviewInstagram(!isPreviewInstagram)}
                    className="text-xs font-semibold text-brand-terracotta hover:text-brand-terracotta-dark flex items-center gap-1"
                  >
                    <Instagram className="w-3.5 h-3.5" /> Toggle Perspective
                  </button>
                </div>

                <div className="bg-white border border-brand-paper-dark rounded-3xl p-4 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-terracotta text-white flex items-center justify-center font-display font-semibold text-xs border border-brand-paper-dark shrink-0">
                      Z
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-charcoal">zplays_bakery</div>
                      <div className="text-[10px] text-brand-wood/60">Lagos, Nigeria ・ Sponsored</div>
                    </div>
                    <div className="ml-auto text-brand-wood/60 text-xs">•••</div>
                  </div>

                  {/* Main feed picture simulation wrapper */}
                  <div className="aspect-square relative w-full rounded-2xl overflow-hidden bg-brand-cream-warm border border-brand-paper flex flex-col justify-between p-6">
                    <div className="absolute inset-0 bg-radial from-brand-paper/50 via-brand-cream/80 to-brand-paper-dark/30 z-0 mix-blend-multiply" />
                    
                    {/* Decorative abstract bakery design */}
                    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-linear-to-t from-gray-950/45 to-transparent z-10 pointer-events-none" />

                    <div className="z-10 flex items-start justify-between">
                      <span className="bg-white/95 text-brand-terracotta backdrop-blur-xs font-semibold px-2.5 py-1 text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 border border-brand-paper-dark">
                        <Flame className="w-3 h-3 text-brand-terracotta animate-pulse" /> Daily Fresh
                      </span>
                      <span className="text-xs font-mono font-medium text-brand-wood bg-brand-cream-warm/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-brand-paper-dark">
                        ₦ 0.00 Ad Cost
                      </span>
                    </div>

                    {/* A nice layout sketch representing the coffee or pastry */}
                    <div className="z-10 flex flex-col items-center justify-center h-full my-auto py-2">
                      <div className="w-20 h-20 rounded-full border-2 border-brand-terracotta/35 border-dashed flex items-center justify-center text-brand-terracotta animate-spin-slow">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-semibold mt-3 text-brand-charcoal text-center px-6 italic">
                        "{itemType}"
                      </p>
                    </div>

                    <div className="z-10 text-white space-y-0.5">
                      <h4 className="font-display font-black text-sm drop-shadow-sm tracking-wide">
                        zplays Boutique Bakehouse
                      </h4>
                      <p className="text-[10px] text-brand-paper/90 drop-shadow-sm">
                        Taste of true Nigerian artisan sourdough craftsmanship.
                      </p>
                    </div>
                  </div>

                  {/* Instagram Action Drawer */}
                  <div className="my-3 flex items-center gap-3 text-brand-charcoal z-10 px-1">
                    <Heart className="w-5 h-5 cursor-pointer text-brand-terracotta fill-brand-terracotta" />
                    <MessageCircle className="w-5 h-5 cursor-pointer" />
                    <Send className="w-5 h-5 cursor-pointer" />
                    <Bookmark className="w-5 h-5 ml-auto cursor-pointer" />
                  </div>

                  {/* Instagram Like Counter and Captions */}
                  <div className="space-y-1.5 px-1 pb-1">
                    <div className="text-[10.5px] font-bold text-brand-charcoal">
                      Liked by coffee_lover_ng and 242 others
                    </div>
                    <div className="text-[11px] leading-relaxed text-brand-charcoal">
                      <span className="font-bold mr-1.5">zplays_bakery</span>
                      <span className="text-brand-wood/90">{result.caption.split("\n\n")[0]}</span>
                    </div>
                    <div className="text-[9px] text-brand-wood/50 uppercase tracking-wider mt-1.5">
                      May 22, 2026 ・ See translation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
