import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Clock, MessageSquare, Flame, BarChart2, ShieldCheck, ArrowUpRight, Award, HelpCircle } from "lucide-react";
import { AnalyticsMetric } from "../types";

const MOCK_DATASETS = {
  active_week: [
    { day: "Mon", inquiries: 14, salesVal: 18000, recommendedStaff: "1 Barista" },
    { day: "Tue", inquiries: 22, salesVal: 24500, recommendedStaff: "1 Barista" },
    { day: "Wed", inquiries: 18, salesVal: 19000, recommendedStaff: "1 Barista" },
    { day: "Thu", inquiries: 35, salesVal: 42000, recommendedStaff: "2 Baristas" },
    { day: "Fri", inquiries: 82, salesVal: 110000, recommendedStaff: "3 Baristas (Peak!)" },
    { day: "Sat", inquiries: 135, salesVal: 185000, recommendedStaff: "4 Baristas (Peak!)" },
    { day: "Sun", inquiries: 95, salesVal: 130000, recommendedStaff: "3 Baristas" }
  ],
  prev_week: [
    { day: "Mon", inquiries: 10, salesVal: 12000, recommendedStaff: "1 Barista" },
    { day: "Tue", inquiries: 15, salesVal: 16000, recommendedStaff: "1 Barista" },
    { day: "Wed", inquiries: 16, salesVal: 17500, recommendedStaff: "1 Barista" },
    { day: "Thu", inquiries: 28, salesVal: 31000, recommendedStaff: "2 Baristas" },
    { day: "Fri", inquiries: 70, salesVal: 92000, recommendedStaff: "2 Baristas" },
    { day: "Sat", inquiries: 112, salesVal: 151000, recommendedStaff: "3 Baristas" },
    { day: "Sun", inquiries: 84, salesVal: 108000, recommendedStaff: "3 Baristas" }
  ]
};

export default function InsightsData() {
  const [selectedDataset, setSelectedDataset] = useState<"active_week" | "prev_week">("active_week");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = MOCK_DATASETS[selectedDataset];
  
  // Total sum computations
  const totalInquiries = activeData.reduce((sum, item) => sum + item.inquiries, 0);
  const totalSimulatedValue = activeData.reduce((sum, item) => sum + item.salesVal, 0);

  // High tier business KPIs using Naira ₦
  const kpiMetrics: AnalyticsMetric[] = [
    {
      label: "Hours Saved This Week",
      value: "8.5 hrs",
      changeValue: "+1.2 hrs vs last week",
      isPositive: true,
      colorClass: "border-brand-terracotta text-brand-terracotta bg-brand-terracotta-light/30"
    },
    {
      label: "AI Automated Replies",
      value: totalInquiries.toString(),
      changeValue: `100% answer accuracy rate`,
      isPositive: true,
      colorClass: "border-brand-sage text-brand-emerald bg-brand-emerald-light"
    },
    {
      label: "Est. Marketing Value Generated",
      value: `₦ ${totalSimulatedValue.toLocaleString()}`,
      changeValue: "+18.2% conversion boost",
      isPositive: true,
      colorClass: "border-brand-amber text-brand-wood bg-brand-cream-warm"
    }
  ];

  const maxInquiryValue = Math.max(...activeData.map((d) => d.inquiries));

  return (
    <div className="space-y-6" id="insights-data-center">
      {/* Top Welcome Title Grid context */}
      <div className="bg-brand-cream-warm border border-brand-paper-dark p-5 rounded-2xl flex items-start gap-4">
        <div className="bg-brand-amber/35 text-brand-wood p-3 rounded-xl shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-brand-charcoal">Dough & Data Dashboard</h2>
          <p className="text-sm text-brand-wood/85 mt-1 leading-relaxed font-sans">
            Your real-time business health indicators. Calculated using daily automated operations and content engagements localized to <strong className="font-semibold text-brand-terracotta">₦ (Naira)</strong>.
          </p>
        </div>
      </div>

      {/* KPI Core Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiMetrics.map((kpi, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-4 transition-all duration-200 bg-white ${
              index === 0 ? "border-l-4 border-l-brand-terracotta shadow-xs" : 
              index === 1 ? "border-l-4 border-l-brand-emerald shadow-xs" : 
              "border-l-4 border-l-brand-sage shadow-xs"
            }`}
          >
            <span className="text-[10px] uppercase font-black tracking-wider text-brand-wood/50 block">
              {kpi.label}
            </span>
            <h3 className="font-display font-black text-2xl text-brand-charcoal mt-1.5 leading-none">
              {kpi.value}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-brand-emerald">
                {kpi.changeValue}
              </span>
              <span className="text-[10px] text-brand-wood/60">• Smart Audit</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Peaks Visualizer */}
      <div className="bg-white border border-brand-paper rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-black text-sm text-brand-charcoal flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-brand-terracotta" />
              Customer Inquiry & Traffic Peaks
            </h3>
            <p className="text-[11px] text-brand-wood/65 mt-0.5">
              Hover over days to see zplays AI staffing suggestions and estimates.
            </p>
          </div>

          <div className="bg-brand-cream-warm border border-brand-paper-dark p-1 rounded-xl flex self-start sm:self-auto shrink-0">
            <button
              id="dataset-btn-active"
              onClick={() => setSelectedDataset("active_week")}
              className={`text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDataset === "active_week"
                  ? "bg-brand-terracotta text-white shadow-xs"
                  : "text-brand-wood hover:text-brand-charcoal"
              }`}
            >
              This Week
            </button>
            <button
              id="dataset-btn-prev"
              onClick={() => setSelectedDataset("prev_week")}
              className={`text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDataset === "prev_week"
                  ? "bg-brand-terracotta text-white shadow-xs"
                  : "text-brand-wood hover:text-brand-charcoal"
              }`}
            >
              Prior Cycle
            </button>
          </div>
        </div>

        {/* Premium Built SVG Chart frame */}
        <div className="relative py-4">
          <div className="w-full h-48 md:h-56 relative flex items-end">
            {/* Grid horizontal markers */}
            <div className="absolute inset-y-0 w-full flex flex-col justify-between pointer-events-none text-[9px] font-mono text-brand-wood/40 border-b border-gray-100">
              <div className="w-full border-t border-dashed border-gray-100 flex justify-between pt-1">
                <span>{maxInquiryValue} inquiries</span>
              </div>
              <div className="w-full border-t border-dashed border-gray-100 flex justify-between pt-1">
                <span>{Math.round(maxInquiryValue / 2)} inquiries</span>
              </div>
              <div className="w-full border-t border-dashed border-gray-100 flex justify-between pt-1">
                <span>0 inquiries</span>
              </div>
            </div>

            {/* Individual columns of the graph */}
            <div className="w-full h-full flex items-end justify-between gap-1 sm:gap-3 z-10 pt-6">
              {activeData.map((dataItem, idx) => {
                const barHeightPct = (dataItem.inquiries / maxInquiryValue) * 100;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={dataItem.day}
                    className="flex-1 flex flex-col items-center justify-end h-full relative"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Animated responsive terracotta bar container */}
                    <div className="w-full relative group cursor-pointer" style={{ height: `${barHeightPct}%` }}>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={`w-full rounded-t-lg origin-bottom h-full transition-all duration-300 ${
                          dataItem.inquiries > 75 
                            ? isHovered ? "bg-brand-terracotta-dark" : "bg-brand-terracotta"
                            : isHovered ? "bg-brand-sage" : "bg-brand-sage/60"
                        }`}
                      />

                      {/* Sparkle badge on Saturday/Friday Peaks */}
                      {dataItem.inquiries > 75 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-charcoal text-[8px] text-white px-1.5 rounded-full font-bold">
                          ⚡️
                        </div>
                      )}
                    </div>

                    {/* Day label */}
                    <span className="text-[10px] font-bold text-brand-wood mt-2 font-mono">
                      {dataItem.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic interactive tooltip pane positioned stably below */}
          <div className="mt-4 bg-brand-cream rounded-2xl p-4 border border-brand-paper-dark min-h-16 flex items-center justify-center">
            {hoveredIndex !== null ? (
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
                  <span className="text-xs font-black text-brand-charcoal">
                    {activeData[hoveredIndex].day} statistics:
                  </span>
                  <span className="text-xs text-brand-wood">
                    {activeData[hoveredIndex].inquiries} inquiries processed
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-brand-wood/60 font-semibold font-mono">Est. Value Added: </span>
                    <strong className="text-brand-emerald font-bold">
                      ₦ {activeData[hoveredIndex].salesVal.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-brand-terracotta-light text-brand-terracotta font-semibold px-2 py-0.5 rounded-md text-[10.5px]">
                    {activeData[hoveredIndex].recommendedStaff}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-wood/75 italic text-center">
                📊 Tip: Move your pointer or finger over the bars to inspect localized revenue & staffing schedules.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Staffing Recommendation helper box */}
      <div className="bg-brand-terracotta-light/35 border border-brand-terracotta/25 p-5 rounded-3xl space-y-3">
        <h4 className="font-display font-medium text-sm text-brand-terracotta flex items-center gap-1.5">
          <Award className="w-4 h-4 text-brand-terracotta" />
          zplays AI Staffing Scheduler Dispatch
        </h4>
        <p className="text-xs text-brand-wood/85 leading-relaxed">
          Based on <strong>{totalInquiries} automated operations and inquiries</strong> this cycle, consumer rushes peak significantly on <strong className="font-semibold text-brand-charcoal">Fridays and Saturdays</strong>. Specifically, weekend enquiries peak between 7:30 AM and 11:00 AM (breakfast baked batch rushes).
        </p>
        <div className="border-t border-brand-paper-dark pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-brand-wood text-[11px] italic">
            ✅ Roster advisory compiled on Friday, May 22, 2026.
          </span>
          <button
            id="apply-staffing-suggest-btn"
            onClick={() => alert("Staff scheduling roster draft updated inside WhatsApp roster system!")}
            className="bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold text-xs py-1.5 px-3.5 rounded-lg shadow-xs self-start sm:self-auto cursor-pointer"
          >
            Apply Staffing Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}
