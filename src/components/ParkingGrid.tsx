import React from 'react';
import { FloorInfo, ParkingSpot } from '../types';
import { SpotCard } from './SpotCard';
import { ArrowRight, Footprints, CheckCircle2 } from 'lucide-react';

interface ParkingGridProps {
  floor: FloorInfo;
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSelectSpot: (spot: ParkingSpot) => void;
  targetPlateSearch?: string;
}

export const ParkingGrid: React.FC<ParkingGridProps> = ({
  floor,
  spots,
  selectedSpot,
  onSelectSpot,
}) => {
  // Split into Section A (North bays) and Section B (South bays)
  const sectionASpots = spots.filter((s) => s.section === 'A');
  const sectionBSpots = spots.filter((s) => s.section === 'B');

  return (
    <div className="rounded-2xl glass-panel p-4 md:p-6 transition-all duration-300">
      {/* Floor header info & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {floor.name}
            </h2>
            <span className="font-mono text-xs text-sky-800 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 font-medium">
              Clearance {floor.clearance}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {floor.subname}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs text-slate-600 flex-wrap font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.4)]" />
            <span>EV Bay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Main Parking Field */}
      <div className="space-y-4">
        {/* Section A (North Bays) */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              SECTION A · NORTH WING
            </span>
            <span>Near Fashion Atrium</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {sectionASpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onSelect={onSelectSpot}
              />
            ))}
          </div>
        </div>

        {/* Central Driveway Lane & Pedestrian Crosswalk */}
        <div className="relative my-6 py-4 px-4 rounded-xl bg-slate-100/80 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
          {/* Subtle lane markings */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] border-t-2 border-dashed border-slate-300 pointer-events-none hidden md:block" />

          {/* West Mall Entrance Lobby marker */}
          <div className="flex items-center gap-2 relative z-10 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs backdrop-blur-md">
            <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
              L1
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">West Lobby Lifts</div>
              <div className="text-[10px] text-slate-500">Direct to Zara &amp; Luxury Court</div>
            </div>
          </div>

          {/* Driving Flow Direction & Speed limit */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white/95 px-3 py-1 rounded-md border border-slate-200 shadow-xs">
              <ArrowRight className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>ONE-WAY LANE</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 font-semibold">MAX 10 KM/H</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-white/95 px-3 py-1 rounded-md border border-slate-200 shadow-xs">
              <Footprints className="w-3.5 h-3.5 text-emerald-600" />
              <span>Crosswalk</span>
            </div>
          </div>

          {/* East Mall Entrance Lobby marker */}
          <div className="flex items-center gap-2 relative z-10 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs backdrop-blur-md">
            <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
              L2
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">East Arcade Lifts</div>
              <div className="text-[10px] text-slate-500">IMAX, Food Terrace &amp; Hypermarket</div>
            </div>
          </div>
        </div>

        {/* Section B (South Bays) */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              SECTION B · SOUTH WING
            </span>
            <span>Near Cinema &amp; Dining Concierge</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {sectionBSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onSelect={onSelectSpot}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floor Proximity & Mall Facilities footer */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-800 font-semibold">Floor Amenities:</span>
          {floor.features.map((feat, idx) => (
            <span key={idx} className="flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{feat}</span>
            </span>
          ))}
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Live Camera &amp; Sensor Grid Online
        </div>
      </div>
    </div>
  );
};
