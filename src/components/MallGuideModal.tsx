import React from 'react';
import { X, CheckCircle2, Zap, Shield, Clock, Gift } from 'lucide-react';

interface MallGuideModalProps {
  onClose: () => void;
}

export const MallGuideModal: React.FC<MallGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl border border-slate-200/90 overflow-hidden my-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Mall Parking Rates &amp; Visitor Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Grand Horizon Mall · 2,400 Total Covered Smart Bays
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Parking Tariffs by Floor */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Standard Hourly Tariffs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">P1 Ground &amp; Luxury Court</span>
                  <span className="font-mono text-sky-700 font-bold">$4.50 / hr</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Quickest access to designer boutiques, valet service, and 150kW DC fast charging.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">P2 Cinema &amp; Dining Plaza</span>
                  <span className="font-mono text-sky-700 font-bold">$3.50 / hr</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct express elevators to IMAX Theater, Level 4 Gourmet Terrace, and VR Arcade.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">P3 Hypermarket &amp; Tech</span>
                  <span className="font-mono text-sky-700 font-bold">$3.00 / hr</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Extra-wide family bays with direct trolley escalators and cargo loading zones.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">P4 Sky Deck (Open Air)</span>
                  <span className="font-mono text-sky-700 font-bold">$2.50 / hr</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rooftop bays with solar canopies. Best value for all-day mall shopping &amp; dining.
                </p>
              </div>
            </div>
          </div>

          {/* Validation Perks */}
          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200">
            <h3 className="text-sm font-bold text-sky-900 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4 text-sky-600" />
              <span>Shopper &amp; Cinema Validation Discounts</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Cinema Patrons:</strong> Use promo code <code className="font-mono text-sky-800 bg-white px-1 py-0.5 rounded border border-sky-300 font-bold">CINEMA20</code> for 20% discount.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Mall Receipts &gt; $50:</strong> Use code <code className="font-mono text-sky-800 bg-white px-1 py-0.5 rounded border border-sky-300 font-bold">SHOPPER50</code> for 50% discount on 2+ hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>First-time visitors:</strong> Use code <code className="font-mono text-sky-800 bg-white px-1 py-0.5 rounded border border-sky-300 font-bold">WELCOME10</code> for 10% off.</span>
              </li>
            </ul>
          </div>

          {/* EV Charging & Security */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-600" />
                <span>EV Fast Charging Network</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All P1 and P3 green bays are equipped with universal Type-2 and CCS fast chargers (up to 150kW). Charging session initiates automatically upon parking.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>24/7 Security &amp; Camera Grid</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                High-definition AI license-plate readers at all barrier gates, continuous patrol, and 24/7 on-site emergency battery jump-start assistance.
              </p>
            </div>
          </div>

          {/* Need Assistance */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Parking Operations Dispatch: +1 (800) 555-PARK</span>
            <span className="font-mono text-sky-700 font-semibold">Intercom at all bay pillars</span>
          </div>
        </div>
      </div>
    </div>
  );
};
