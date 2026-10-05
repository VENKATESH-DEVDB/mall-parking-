import React, { useState } from 'react';
import { ParkingSpot, FloorInfo } from '../types';
import { Zap, Clock, Sparkles, Navigation, X, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

interface SpotDetailsDrawerProps {
  spot: ParkingSpot;
  floor: FloorInfo;
  onClose: () => void;
  onProceedToPayment: (bookingConfig: {
    durationHours: number;
    arrivalOffsetMinutes: number;
    evAddon: boolean;
    carWashAddon: boolean;
    discountCode: string;
    discountAmount: number;
    baseAmount: number;
    totalAmount: number;
  }) => void;
}

export const SpotDetailsDrawer: React.FC<SpotDetailsDrawerProps> = ({
  spot,
  floor,
  onClose,
  onProceedToPayment,
}) => {
  const [durationHours, setDurationHours] = useState<number>(2);
  const [arrivalOffset, setArrivalOffset] = useState<number>(15);
  const [evAddon, setEvAddon] = useState<boolean>(spot.type === 'ev_charge');
  const [carWashAddon, setCarWashAddon] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // Rate calculations
  const baseRate = spot.ratePerHour;
  const baseAmount = baseRate * durationHours;
  const evFee = evAddon ? 5.0 : 0;
  const carWashFee = carWashAddon ? 14.0 : 0;
  const subtotal = baseAmount + evFee + carWashFee;

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * 0.08;
  const totalAmount = afterDiscount + taxAmount;

  const handleApplyPromo = () => {
    setPromoError('');
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'MALLSHOP50' || clean === 'SHOPPER50') {
      setAppliedPromo({ code: clean, percent: 50 });
    } else if (clean === 'CINEMA20' || clean === 'CINEMA') {
      setAppliedPromo({ code: clean, percent: 20 });
    } else if (clean === 'WELCOME10' || clean === 'MALL10') {
      setAppliedPromo({ code: clean, percent: 10 });
    } else {
      setPromoError('Invalid code. Try "SHOPPER50" or "CINEMA20"');
    }
  };

  const handleProceed = () => {
    onProceedToPayment({
      durationHours,
      arrivalOffsetMinutes: arrivalOffset,
      evAddon,
      carWashAddon,
      discountCode: appliedPromo?.code || '',
      discountAmount,
      baseAmount,
      totalAmount,
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] glass-panel-elevated border-l border-slate-200/90 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl backdrop-blur-2xl">
      <div>
        {/* Header with spot badge and close button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-300 flex items-center justify-center text-sky-800 font-mono font-bold text-lg shadow-xs">
              {spot.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Spot {spot.code}
                </h3>
                <span className="text-xs font-mono text-sky-800 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 font-medium">
                  {floor.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {floor.name.split('·')[1]?.trim() || floor.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close spot details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spot Attributes */}
        <div className="mt-4 p-3 rounded-xl bg-white/70 border border-slate-200/80 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              Proximity
            </span>
            <span className="text-slate-800 font-semibold">
              {spot.distanceMeters}m to {spot.nearLobby}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Hourly Tariff
            </span>
            <span className="text-slate-900 font-mono font-bold">
              ${spot.ratePerHour.toFixed(2)}/hr
            </span>
          </div>

          {spot.type === 'ev_charge' && (
            <div className="flex items-center justify-between text-sky-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-sky-600" />
                Charger Speed
              </span>
              <span className="font-mono font-bold">{spot.evKw}kW Fast Plug (Type 2 / CCS)</span>
            </div>
          )}
        </div>

        {/* Duration Selector */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Parking Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((hrs) => (
              <button
                key={hrs}
                onClick={() => setDurationHours(hrs)}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                  durationHours === hrs
                    ? 'bg-sky-50 border border-sky-400 text-sky-800 font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-mono text-sm">{hrs} hr{hrs > 1 ? 's' : ''}</div>
                <div className="text-[10px] text-slate-500 font-mono">${(spot.ratePerHour * hrs).toFixed(2)}</div>
              </button>
            ))}
          </div>

          {/* Full Day option */}
          <button
            onClick={() => setDurationHours(8)}
            className={`w-full mt-2 py-2 px-3 text-xs font-medium rounded-lg flex items-center justify-between transition-all ${
              durationHours === 8
                ? 'bg-sky-50 border border-sky-400 text-sky-800 font-bold shadow-xs'
                : 'bg-white/80 hover:bg-white border border-slate-200 text-slate-700'
            }`}
          >
            <span>Full Mall Day Pass (8 Hours Max Stay)</span>
            <span className="font-mono text-xs font-bold text-sky-700">${(spot.ratePerHour * 8 * 0.85).toFixed(2)} (-15%)</span>
          </button>
        </div>

        {/* Arrival Time Selector */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            2. Expected Arrival Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Now (15m hold)', val: 15 },
              { label: 'In 30 mins', val: 30 },
              { label: 'In 1 hour', val: 60 },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setArrivalOffset(opt.val)}
                className={`py-2 px-2 text-xs rounded-lg transition-all text-center ${
                  arrivalOffset === opt.val
                    ? 'bg-slate-900 border border-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white/80 hover:bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Bay will be reserved &amp; locked in real-time until your arrival window.
          </p>
        </div>

        {/* Add-on Services */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. Optional Concierge Add-ons
          </label>
          <div className="space-y-2">
            {spot.type === 'ev_charge' && (
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-200 cursor-pointer transition-colors shadow-xs">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={evAddon}
                    onChange={(e) => setEvAddon(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-sky-600" />
                      <span>Dedicated EV Fast Charging session</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Unlock continuous high-speed charging</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-sky-700 font-bold">+$5.00</span>
              </label>
            )}

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-200 cursor-pointer transition-colors shadow-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={carWashAddon}
                  onChange={(e) => setCarWashAddon(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mall Shopper Eco Hand Wash</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Exterior hand wash while you shop or dine</div>
                </div>
              </div>
              <span className="font-mono text-xs text-amber-700 font-bold">+$14.00</span>
            </label>
          </div>
        </div>

        {/* Promo Code Validation */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            4. Shopper Voucher or Promo Code
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Try: SHOPPER50 or CINEMA20"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs glass-input rounded-lg font-mono uppercase tracking-wider shadow-xs"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Apply
            </button>
          </div>

          {appliedPromo && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1.5 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Promo applied: {appliedPromo.percent}% Shopper Discount!</span>
            </div>
          )}

          {promoError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{promoError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bill Breakdown & Pay CTA */}
      <div className="mt-6 pt-4 border-t border-slate-200/80">
        <div className="space-y-1.5 text-xs mb-4">
          <div className="flex justify-between text-slate-600">
            <span>Parking ({durationHours} hrs × ${baseRate.toFixed(2)})</span>
            <span className="font-mono text-slate-800">${baseAmount.toFixed(2)}</span>
          </div>
          {evAddon && (
            <div className="flex justify-between text-slate-600">
              <span>EV Fast Charging add-on</span>
              <span className="font-mono text-sky-700 font-semibold">+$5.00</span>
            </div>
          )}
          {carWashAddon && (
            <div className="flex justify-between text-slate-600">
              <span>Eco Hand Wash</span>
              <span className="font-mono text-amber-700 font-semibold">+$14.00</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discount ({appliedPromo?.code})</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Estimated Municipal Tax &amp; Facility Fee (8%)</span>
            <span className="font-mono text-slate-800">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
            <span>Total Payable</span>
            <span className="font-mono text-sky-700 text-base tabular-nums">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-[0_4px_16px_rgba(2,132,199,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Reserve &amp; Pay Online</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
