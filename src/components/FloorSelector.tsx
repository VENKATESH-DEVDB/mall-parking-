import React from 'react';
import { FloorInfo } from '../types';
import { Zap } from 'lucide-react';

interface FloorSelectorProps {
  floors: FloorInfo[];
  selectedFloorId: 'P1' | 'P2' | 'P3' | 'P4';
  onSelectFloor: (floorId: 'P1' | 'P2' | 'P3' | 'P4') => void;
  floorAvailableCounts: Record<string, number>;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloorId,
  onSelectFloor,
  floorAvailableCounts,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {floors.map((floor) => {
        const isSelected = floor.id === selectedFloorId;
        const available = floorAvailableCounts[floor.id] ?? floor.availableSpots;
        const isLow = available <= 8;

        return (
          <button
            key={floor.id}
            onClick={() => onSelectFloor(floor.id)}
            className={`text-left p-3.5 rounded-xl transition-all duration-200 relative group overflow-hidden border ${
              isSelected
                ? 'bg-white border-sky-500 shadow-[0_4px_20px_rgba(2,132,199,0.12)] ring-2 ring-sky-500/20'
                : 'bg-white/65 hover:bg-white/95 border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10">
              <span className={`font-mono text-sm font-bold tracking-wider ${isSelected ? 'text-sky-700' : 'text-slate-900'}`}>
                {floor.id}
              </span>
              <span className="font-mono text-xs text-slate-500 font-medium">
                ${floor.baseRate.toFixed(2)}/h
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-800 line-clamp-1 mb-2 relative z-10">
              {floor.name.split('·')[1]?.trim() || floor.name}
            </div>

            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 relative z-10">
              <span className={isLow ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                <span className="font-mono tabular-nums">{available}</span> free
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-slate-600">
                <Zap className="w-3 h-3 text-sky-600" />
                <span className="font-mono tabular-nums">{floor.evSpots}</span> EV
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{floor.clearance}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
