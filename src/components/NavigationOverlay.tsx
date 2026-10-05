import React, { useState } from 'react';
import { ParkingSpot } from '../types';
import { Navigation, Compass, ArrowRight, CornerDownRight, CheckCircle2, X } from 'lucide-react';

interface NavigationOverlayProps {
  spot: ParkingSpot;
  onClose: () => void;
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ spot, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: 'Enter via Mall Gate 2 (West Wing Ramp)',
      detail: 'Approach optical scanner or let camera read plate. Barrier arm raises automatically.',
      icon: <Compass className="w-4 h-4 text-sky-600" />,
      dist: '120m ahead',
    },
    {
      title: `Descend Ramp to Level ${spot.floorId}`,
      detail: 'Follow illuminated overhead blue LED digital floor markers to Level ' + spot.floorId + '.',
      icon: <CornerDownRight className="w-4 h-4 text-indigo-600" />,
      dist: '60m ahead',
    },
    {
      title: `Merge into Section ${spot.section} One-Way Lane`,
      detail: 'Maintain 10 km/h speed limit. Watch for pedestrian crosswalk near elevator lobby.',
      icon: <ArrowRight className="w-4 h-4 text-sky-600" />,
      dist: '25m ahead',
    },
    {
      title: `Arrive at Bay ${spot.code}`,
      detail: `Bay ${spot.code} is marked with glowing overhead sensor indicator. Near ${spot.nearLobby}.`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      dist: 'Arrived at destination',
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl glass-panel-elevated rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Live Bay Guidance · {spot.code} ({spot.floorId})
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Step {currentStep + 1} of {steps.length} · {steps[currentStep].dist}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Step Instruction */}
      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 mb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-sky-800 mb-1">
          {steps[currentStep].icon}
          <span>{steps[currentStep].title}</span>
        </div>
        <p className="text-xs text-slate-600 pl-6">
          {steps[currentStep].detail}
        </p>
      </div>

      {/* Step Navigation Dots & Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-6 bg-sky-600 shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <span>Next Turn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <span>Finish Guidance</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
