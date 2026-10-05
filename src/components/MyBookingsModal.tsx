import React from 'react';
import { Reservation } from '../types';
import { Ticket, Clock, Navigation, X } from 'lucide-react';

interface MyBookingsModalProps {
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
  onExtendTime: (reservationId: string, hours: number) => void;
  onCancelReservation: (reservationId: string) => void;
  onClose: () => void;
  onNavigateToSpot: (spotId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  reservations,
  onSelectReservation,
  onExtendTime,
  onCancelReservation,
  onClose,
  onNavigateToSpot,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl border border-slate-200/90 overflow-hidden my-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              My Digital Passes &amp; Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review active reservations, extend sessions, or download receipts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {reservations.length === 0 ? (
            <div className="py-12 text-center">
              <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-700">No active passes yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select any available parking bay on the map to reserve your spot with instant online checkout.
              </p>
            </div>
          ) : (
            reservations.map((res) => {
              const isActive = res.status === 'active';
              const isPast = Date.now() > res.endTime;

              return (
                <div
                  key={res.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive && !isPast
                      ? 'bg-white border-sky-300 shadow-md ring-1 ring-sky-500/10'
                      : 'bg-white/60 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-300 flex items-center justify-center font-mono font-bold text-base text-sky-800">
                        {res.spotCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {res.floorName}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-800 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300">
                            {res.licensePlate}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Pass ID: {res.id} · {res.vehicleMake} {res.vehicleModel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && !isPast ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Session</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">
                          {res.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Duration</div>
                      <div className="font-mono text-slate-800 font-semibold">{res.durationHours} Hours</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Total Paid</div>
                      <div className="font-mono text-sky-700 font-bold">${res.totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">EV &amp; Extras</div>
                      <div className="text-slate-700 font-medium">
                        {res.evAddon > 0 ? 'EV Fast Charge' : res.carWashAddon ? 'Car Wash' : 'Standard Bay'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Expires At</div>
                      <div className="font-mono text-slate-800 font-semibold">
                        {new Date(res.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <button
                      onClick={() => onSelectReservation(res)}
                      className="text-xs text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1 py-1"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View QR Ticket</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isActive && !isPast && (
                        <>
                          <button
                            onClick={() => {
                              onNavigateToSpot(res.spotId);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium flex items-center gap-1 transition-colors"
                          >
                            <Navigation className="w-3 h-3 text-sky-600" />
                            <span>Navigate</span>
                          </button>

                          <button
                            onClick={() => onExtendTime(res.id, 1)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Extend 1h</span>
                          </button>

                          <button
                            onClick={() => onCancelReservation(res.id)}
                            className="px-2 py-1 text-xs rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
