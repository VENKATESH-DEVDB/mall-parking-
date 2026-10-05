import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { Clock, Navigation, CheckCircle2, Download, Copy, QrCode, X } from 'lucide-react';
import { playSensorChime, playSuccessSound } from '../utils/audio';

interface DigitalTicketModalProps {
  reservation: Reservation;
  onClose: () => void;
  onExtendTime: (reservationId: string, hours: number) => void;
  onNavigateToSpot: (spotId: string) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  reservation,
  onClose,
  onExtendTime,
  onNavigateToSpot,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; totalMs: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });
  const [barrierState, setBarrierState] = useState<'idle' | 'scanning' | 'open'>('idle');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = reservation.endTime - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, totalMs: diff });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [reservation.endTime]);

  const handleSimulateBarrierScan = () => {
    setBarrierState('scanning');
    playSensorChime();

    setTimeout(() => {
      setBarrierState('open');
      playSuccessSound();
    }, 1200);

    setTimeout(() => {
      setBarrierState('idle');
    }, 4500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTicket = () => {
    const ticketContent = `
=============================================
      GRAND HORIZON MALL · PARKING PASS
=============================================
Booking ID:     ${reservation.id}
Spot Assigned:  ${reservation.spotCode} (${reservation.floorName})
License Plate:  ${reservation.licensePlate}
Vehicle:        ${reservation.vehicleMake} ${reservation.vehicleModel} (${reservation.vehicleColor})
Valid From:     ${new Date(reservation.startTime).toLocaleTimeString()}
Valid Until:    ${new Date(reservation.endTime).toLocaleTimeString()}
Duration:       ${reservation.durationHours} Hours
Amount Paid:    $${reservation.totalAmount.toFixed(2)} (${reservation.paymentMethod.toUpperCase()})
EV Charging:    ${reservation.evAddon > 0 ? 'Active (50kW Fast Plug)' : 'No'}
Car Wash:       ${reservation.carWashAddon ? 'Included (Eco Hand Polish)' : 'No'}

ENTRY INSTRUCTIONS:
- Drive to Mall Entry Gate 2 (West Wing)
- Scan QR code or allow Automatic License Plate Camera to detect ${reservation.licensePlate}
- Follow blue illuminated lane arrows to Floor ${reservation.floorId}, Bay ${reservation.spotCode}
=============================================
`;
    const blob = new Blob([ticketContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mall-Parking-Pass-${reservation.spotCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel-elevated rounded-2xl border border-slate-200/90 overflow-hidden my-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header of Ticket */}
        <div className="bg-slate-50/90 p-6 border-b border-slate-200 relative">
          <div className="flex items-center gap-2 text-sky-700 text-xs font-mono font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACTIVE PARKING RESERVATION PASS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Grand Horizon Mall
          </h2>
          <p className="text-xs text-slate-500">
            Automated Entry &amp; Bay Guidance
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Prominent Spot & Floor Callout */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-sky-50/80 border border-sky-300 shadow-xs">
            <div>
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-semibold">
                Assigned Bay
              </div>
              <div className="text-3xl font-mono font-bold text-sky-800 tracking-wider">
                {reservation.spotCode}
              </div>
              <div className="text-xs text-slate-700 mt-0.5 font-medium">
                {reservation.floorName}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-semibold">
                Vehicle Plate
              </div>
              <div className="text-base font-mono font-bold text-slate-900 tracking-wider px-2 py-0.5 rounded bg-white border border-slate-300 mt-1 inline-block shadow-xs">
                {reservation.licensePlate}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-medium">
                {reservation.vehicleMake} {reservation.vehicleModel}
              </div>
            </div>
          </div>

          {/* Dynamic QR Code & Barrier Scanner */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/70 border border-slate-200/90 text-center shadow-xs">
            {/* Minimalist QR Visual */}
            <div className="relative p-3 bg-white rounded-xl shadow-md mb-3 border border-slate-200">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                {/* 3 Corner Anchor Marks */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="12" height="12" rx="2" fill="#0f172a" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="75" y="13" width="12" height="12" rx="2" fill="#0f172a" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="75" width="12" height="12" rx="2" fill="#0f172a" />

                {/* Data Grid Dots */}
                <rect x="38" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="38" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="24" width="6" height="6" fill="#0f172a" />
                <rect x="56" y="16" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
                <rect x="18" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="28" y="42" width="6" height="6" fill="#0f172a" />

                <rect x="38" y="38" width="8" height="8" rx="1" fill="#0284c7" />
                <rect x="48" y="48" width="8" height="8" rx="1" fill="#0284c7" />
                <rect x="38" y="58" width="8" height="8" rx="1" fill="#0284c7" />
                <rect x="58" y="38" width="8" height="8" rx="1" fill="#0284c7" />
                <rect x="48" y="68" width="8" height="8" rx="1" fill="#0284c7" />

                <rect x="70" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="82" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="72" y="56" width="6" height="6" fill="#0f172a" />
                <rect x="86" y="64" width="6" height="6" fill="#0f172a" />

                <rect x="40" y="82" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="86" width="6" height="6" fill="#0f172a" />
                <rect x="64" y="80" width="6" height="6" fill="#0f172a" />
                <rect x="76" y="78" width="6" height="6" fill="#0f172a" />
                <rect x="86" y="86" width="6" height="6" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-xs font-mono text-slate-700 flex items-center gap-1.5 font-medium">
              <span>Pass ID:</span>
              <span className="font-bold text-sky-700">{reservation.id}</span>
              <button
                onClick={handleCopyCode}
                className="p-1 hover:text-slate-900 transition-colors"
                title="Copy Pass ID"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Point your screen at the scanner at Gate 2, or let the high-res camera read your plate automatically.
            </p>

            {/* Test Barrier Scanner Simulator button */}
            <div className="mt-3 w-full">
              <button
                onClick={handleSimulateBarrierScan}
                disabled={barrierState !== 'idle'}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                  barrierState === 'open'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : barrierState === 'scanning'
                    ? 'bg-sky-50 border-sky-400 text-sky-800'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                {barrierState === 'open' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Barrier Gate Raised · Welcome!</span>
                  </>
                ) : barrierState === 'scanning' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
                    <span>Optical Sensor Scanning QR...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-3.5 h-3.5 text-sky-600" />
                    <span>Test Scanner (Simulate Barrier Entry)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Remaining Time Counter */}
          <div className="p-3.5 rounded-xl bg-white/70 border border-slate-200/90 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Remaining Parking Time</div>
                <div className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Quick 1-Hour Extension */}
            <button
              onClick={() => onExtendTime(reservation.id, 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 transition-colors whitespace-nowrap shadow-xs"
            >
              +1 Hr ($4.00)
            </button>
          </div>

          {/* Action Row: Navigate to Spot & Download Pass */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                onNavigateToSpot(reservation.spotId);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate to Bay</span>
            </button>

            <button
              onClick={handleDownloadTicket}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save / Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
