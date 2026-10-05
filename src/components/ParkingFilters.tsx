import React from 'react';
import { SpotType } from '../types';
import { Zap, Accessibility, Shield, Car, Search, RefreshCw, Navigation } from 'lucide-react';

interface ParkingFiltersProps {
  selectedType: 'all' | SpotType;
  onSelectType: (type: 'all' | SpotType) => void;
  nearLiftOnly: boolean;
  onToggleNearLift: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTriggerTrafficShift: () => void;
  isSimulating: boolean;
}

export const ParkingFilters: React.FC<ParkingFiltersProps> = ({
  selectedType,
  onSelectType,
  nearLiftOnly,
  onToggleNearLift,
  searchQuery,
  onSearchChange,
  onTriggerTrafficShift,
  isSimulating,
}) => {
  const filterButtons: { type: 'all' | SpotType; label: string; icon?: React.ReactNode }[] = [
    { type: 'all', label: 'All Bays' },
    { type: 'ev_charge', label: 'EV Charging', icon: <Zap className="w-3.5 h-3.5 text-sky-600" /> },
    { type: 'accessible', label: 'Accessible', icon: <Accessibility className="w-3.5 h-3.5 text-blue-600" /> },
    { type: 'vip', label: 'VIP Valet', icon: <Shield className="w-3.5 h-3.5 text-amber-600" /> },
    { type: 'compact', label: 'Compact', icon: <Car className="w-3.5 h-3.5 text-slate-500" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/90 backdrop-blur-md shadow-xs">
      {/* Segmented type filter buttons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {filterButtons.map((btn) => {
          const isActive = selectedType === btn.type;
          return (
            <button
              key={btn.type}
              onClick={() => onSelectType(btn.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-sky-50 border border-sky-300 text-sky-800 font-semibold shadow-xs'
                  : 'bg-transparent hover:bg-slate-100/70 border border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right controls: Near lift toggle, search, simulate live traffic */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Near Elevator toggle */}
        <button
          onClick={onToggleNearLift}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            nearLiftOnly
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
              : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-sky-600" />
          <span>Near Mall Lifts</span>
        </button>

        {/* Search by Spot ID or Plate */}
        <div className="relative flex-1 sm:w-44">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Spot # or plate..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs glass-input rounded-lg placeholder-slate-400 font-mono shadow-xs"
          />
        </div>

        {/* Live Simulator Refresh Button */}
        <button
          onClick={onTriggerTrafficShift}
          disabled={isSimulating}
          title="Simulate realistic sensor updates"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 transition-all disabled:opacity-50 whitespace-nowrap shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSimulating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Simulate Sensors</span>
        </button>
      </div>
    </div>
  );
};
