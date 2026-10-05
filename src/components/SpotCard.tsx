import React from 'react';
import { ParkingSpot } from '../types';
import { Zap, Accessibility, Shield, Car, Check } from 'lucide-react';
import { playSpotSelectSound } from '../utils/audio';

interface SpotCardProps {
  spot: ParkingSpot;
  isSelected: boolean;
  onSelect: (spot: ParkingSpot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, isSelected, onSelect }) => {
  const isAvailable = spot.status === 'available';
  const isOccupied = spot.status === 'occupied';
  const isReserved = spot.status === 'reserved';

  const handleClick = () => {
    if (isAvailable || isSelected) {
      playSpotSelectSound();
      onSelect(spot);
    }
  };

  const renderTypeIcon = () => {
    switch (spot.type) {
      case 'ev_charge':
        return (
          <span className="flex items-center gap-0.5 text-sky-600 font-mono text-[10px] font-semibold" title={`${spot.evKw}kW EV Charger`}>
            <Zap className="w-3 h-3 text-sky-600" />
            <span>{spot.evKw}kW</span>
          </span>
        );
      case 'accessible':
        return (
          <span title="Accessible Parking Bay">
            <Accessibility className="w-3.5 h-3.5 text-blue-600" />
          </span>
        );
      case 'vip':
        return (
          <span title="VIP Valet Bay">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
          </span>
        );
      case 'compact':
        return <span className="text-[10px] font-mono text-slate-500 font-medium">CPT</span>;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isOccupied || isReserved}
      className={`relative w-full aspect-[4/5] sm:aspect-square p-2 rounded-xl text-left transition-all duration-200 flex flex-col justify-between group overflow-hidden border ${
        isSelected
          ? 'bg-sky-50/90 border-sky-500 shadow-[0_0_20px_rgba(2,132,199,0.18)] ring-2 ring-sky-500/25'
          : isAvailable
          ? 'bg-white/70 hover:bg-white border-slate-200/90 hover:border-sky-400 cursor-pointer shadow-xs hover:shadow-md'
          : isReserved
          ? 'bg-amber-50/70 border-amber-200/80 opacity-70 cursor-not-allowed'
          : 'bg-slate-100/70 border-slate-200/60 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Visual bay lane boundary markings */}
      <div className="absolute top-1 bottom-1 left-0.5 w-[2px] bg-slate-300/40" />
      <div className="absolute top-1 bottom-1 right-0.5 w-[2px] bg-slate-300/40" />

      {/* Top row: Spot code & Spot type indicator */}
      <div className="flex items-center justify-between w-full relative z-10">
        <span className={`font-mono text-xs font-bold tracking-wider ${
          isSelected ? 'text-sky-800' : isAvailable ? 'text-slate-900' : 'text-slate-500'
        }`}>
          {spot.code}
        </span>
        <div className="flex items-center gap-1">
          {renderTypeIcon()}
        </div>
      </div>

      {/* Middle content: Car silhouette or Status */}
      <div className="flex-1 flex flex-col items-center justify-center my-1 relative z-10">
        {isSelected ? (
          <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold shadow-[0_0_10px_rgba(2,132,199,0.3)]">
            <Check className="w-4 h-4" />
          </div>
        ) : isOccupied ? (
          <div className="flex flex-col items-center">
            <Car className="w-5 h-5 text-slate-400 mb-0.5" />
            <span className="font-mono text-[9px] text-slate-500 uppercase font-medium tracking-wider">
              {spot.occupiedPlate || 'BUSY'}
            </span>
          </div>
        ) : isReserved ? (
          <span className="font-mono text-[10px] text-amber-700 font-semibold">
            HOLD
          </span>
        ) : (
          <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] mb-1" />
            <span className="text-[10px] text-slate-700 font-semibold">Free</span>
          </div>
        )}
      </div>

      {/* Bottom row: Rate & Distance */}
      <div className="flex items-center justify-between w-full text-[10px] relative z-10 pt-1 border-t border-slate-100">
        <span className="font-mono text-slate-600 font-medium tabular-nums">
          ${spot.ratePerHour.toFixed(1)}/h
        </span>
        <span className="text-slate-500 font-mono text-[9px]">
          {spot.distanceMeters}m
        </span>
      </div>
    </button>
  );
};
