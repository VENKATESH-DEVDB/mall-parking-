/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FLOORS, generateInitialSpots } from './data/parkingData';
import { FloorInfo, ParkingSpot, Reservation, SpotType } from './types';
import { AmbientBackground } from './components/AmbientBackground';
import { Header } from './components/Header';
import { FloorSelector } from './components/FloorSelector';
import { ParkingFilters } from './components/ParkingFilters';
import { ParkingGrid } from './components/ParkingGrid';
import { SpotDetailsDrawer } from './components/SpotDetailsDrawer';
import { PaymentModal } from './components/PaymentModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { MallGuideModal } from './components/MallGuideModal';
import { NavigationOverlay } from './components/NavigationOverlay';
import { playSensorChime, playSpotSelectSound } from './utils/audio';
import mallHeroLightImage from './assets/images/mall_glass_light_1791181180368.jpg';

export default function App() {
  const [spots, setSpots] = useState<ParkingSpot[]>(() => generateInitialSpots());
  const [selectedFloorId, setSelectedFloorId] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P1');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // Modals & Navigation Tabs
  const [activeTab, setActiveTab] = useState<'map' | 'my-passes' | 'rates'>('map');
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState<boolean>(false);
  const [paymentConfig, setPaymentConfig] = useState<{
    spot: ParkingSpot;
    floor: FloorInfo;
    config: any;
  } | null>(null);
  const [activeTicket, setActiveTicket] = useState<Reservation | null>(null);
  const [navigatingSpot, setNavigatingSpot] = useState<ParkingSpot | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | SpotType>('all');
  const [nearLiftOnly, setNearLiftOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Initialized with a realistic active pass
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const now = Date.now();
    return [
      {
        id: 'RES-AUR8920',
        spotId: 'P1-A-03',
        spotCode: 'A-03',
        floorId: 'P1',
        floorName: 'P1 · Ground & Luxury Court',
        licensePlate: '8XYZ-901',
        vehicleMake: 'Porsche',
        vehicleModel: 'Taycan',
        vehicleColor: 'Frozen Blue',
        vehicleType: 'ev',
        phone: '+1 (555) 349-2041',
        startTime: now - 35 * 60 * 1000,
        endTime: now + 85 * 60 * 1000,
        durationHours: 2,
        baseAmount: 9.0,
        evAddon: 5.0,
        carWashAddon: false,
        carWashAmount: 0,
        discountAmount: 2.8,
        discountCode: 'SHOPPER20',
        taxAmount: 0.89,
        totalAmount: 12.09,
        paymentMethod: 'apple_pay',
        paymentCardLast4: '8821',
        paymentStatus: 'completed',
        qrCodeToken: 'MALL-PARK:P1-A-03:8XYZ-901',
        status: 'active',
        createdAt: now - 35 * 60 * 1000,
      },
    ];
  });

  // Calculate available counts per floor
  const floorAvailableCounts = useMemo(() => {
    const counts: Record<string, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };
    spots.forEach((s) => {
      if (s.status === 'available') {
        counts[s.floorId] = (counts[s.floorId] || 0) + 1;
      }
    });
    return counts;
  }, [spots]);

  const currentFloor = useMemo(() => {
    return FLOORS.find((f) => f.id === selectedFloorId) || FLOORS[0];
  }, [selectedFloorId]);

  // Filtered spots for current floor
  const currentFloorSpots = useMemo(() => {
    return spots.filter((spot) => {
      if (spot.floorId !== selectedFloorId) return false;
      if (filterType !== 'all' && spot.type !== filterType) return false;
      if (nearLiftOnly && spot.distanceMeters > 20) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const codeMatches = spot.code.toLowerCase().includes(q);
        const plateMatches = spot.occupiedPlate?.toLowerCase().includes(q);
        const lobbyMatches = spot.nearLobby.toLowerCase().includes(q);
        if (!codeMatches && !plateMatches && !lobbyMatches) return false;
      }
      return true;
    });
  }, [spots, selectedFloorId, filterType, nearLiftOnly, searchQuery]);

  // Total free spots in entire mall
  const totalFreeSpots = useMemo(() => {
    return spots.filter((s) => s.status === 'available').length;
  }, [spots]);

  // Active reservations count
  const activeReservationsCount = useMemo(() => {
    const now = Date.now();
    return reservations.filter((r) => r.status === 'active' && r.endTime > now).length;
  }, [reservations]);

  // Live traffic simulation function
  const triggerTrafficShift = () => {
    setIsSimulating(true);
    playSensorChime();

    setTimeout(() => {
      setSpots((prev) => {
        const next = [...prev];
        const candidates = next.filter((s) => s.id !== selectedSpot?.id && !reservations.some((r) => r.spotId === s.id));
        if (candidates.length > 0) {
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const target = candidates[randomIndex];
          const targetGlobalIndex = next.findIndex((s) => s.id === target.id);

          if (targetGlobalIndex !== -1) {
            if (next[targetGlobalIndex].status === 'available') {
              next[targetGlobalIndex] = {
                ...next[targetGlobalIndex],
                status: 'occupied',
                occupiedPlate: `${Math.floor(100 + Math.random() * 900)}W-${Math.floor(10 + Math.random() * 90)}`,
              };
            } else if (next[targetGlobalIndex].status === 'occupied') {
              next[targetGlobalIndex] = {
                ...next[targetGlobalIndex],
                status: 'available',
                occupiedPlate: undefined,
              };
            }
          }
        }
        return next;
      });
      setIsSimulating(false);
    }, 700);
  };

  // Automated background occupancy shifts
  useEffect(() => {
    const timer = setInterval(() => {
      triggerTrafficShift();
    }, 35000);
    return () => clearInterval(timer);
  }, [selectedSpot]);

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setBookingDrawerOpen(true);
  };

  const handleProceedToPayment = (config: any) => {
    if (!selectedSpot) return;
    setBookingDrawerOpen(false);
    setPaymentConfig({
      spot: selectedSpot,
      floor: currentFloor,
      config,
    });
  };

  const handlePaymentSuccess = (newReservation: Reservation) => {
    setPaymentConfig(null);

    // Update spot status in local state to reserved
    setSpots((prev) =>
      prev.map((s) =>
        s.id === newReservation.spotId
          ? { ...s, status: 'reserved' as const }
          : s
      )
    );

    // Append reservation
    setReservations((prev) => [newReservation, ...prev]);

    // Open Digital Ticket view
    setActiveTicket(newReservation);
  };

  const handleExtendTime = (reservationId: string, hours: number) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            endTime: r.endTime + hours * 60 * 60 * 1000,
            durationHours: r.durationHours + hours,
            totalAmount: r.totalAmount + 4.0 * hours,
          };
        }
        return r;
      })
    );

    if (activeTicket && activeTicket.id === reservationId) {
      setActiveTicket((prev) => (prev ? {
        ...prev,
        endTime: prev.endTime + hours * 60 * 60 * 1000,
        durationHours: prev.durationHours + hours,
        totalAmount: prev.totalAmount + 4.0 * hours,
      } : null));
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' as const } : r))
    );

    setSpots((prev) =>
      prev.map((s) => (s.id === target.spotId ? { ...s, status: 'available' as const } : s))
    );

    if (activeTicket?.id === reservationId) {
      setActiveTicket(null);
    }
  };

  const handleNavigateToSpot = (spotId: string) => {
    const spot = spots.find((s) => s.id === spotId);
    if (spot) {
      setSelectedFloorId(spot.floorId);
      setSelectedSpot(spot);
      setNavigatingSpot(spot);
      setActiveTab('map');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-sky-500/20 selection:text-sky-900">
      {/* Background ambient lighting */}
      <AmbientBackground />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activePassesCount={activeReservationsCount}
        liveSensorCount={spots.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Mall Hero & Live Availability Glance */}
        <section className="relative rounded-2xl overflow-hidden glass-panel p-6 sm:p-8 border border-white/90 transition-all shadow-sm">
          {/* Daylight architectural backdrop with soft scrim */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
            <img
              src={mallHeroLightImage}
              alt="Grand Horizon Mall Daylight Glass Architecture"
              className="w-full h-full object-cover object-center filter blur-[1px] scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              {/* Unboxed clean metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-sky-700 font-mono mb-2 font-medium">
                <span>Grand Horizon Mall &amp; Galleria</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-bold">{totalFreeSpots} Bays Available</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">Fast EV &amp; Valet</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
                Reserve your mall parking spot in real-time.
              </h1>

              <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                Skip circling the parking garage. Pick an open bay near your favorite store or cinema, reserve instantly, and pay securely online.
              </p>
            </div>

            {/* Quick Live Stats Glass Cluster */}
            <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto min-w-[280px]">
              <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 backdrop-blur-md shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Total Bays</div>
                <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {spots.length}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Across 4 Levels</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 backdrop-blur-md shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Available</div>
                <div className="font-mono text-xl font-bold text-emerald-700 tabular-nums">
                  {totalFreeSpots}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono font-medium">Live Sensors</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 backdrop-blur-md shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">EV Fast</div>
                <div className="font-mono text-xl font-bold text-sky-700 tabular-nums">
                  26
                </div>
                <div className="text-[10px] text-sky-700 font-mono font-medium">150kW CCS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Floor Selection Bar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span className="text-slate-800 font-semibold">Select Mall Level &amp; Section</span>
            <span>Tap any level to view bay occupancy</span>
          </div>

          <FloorSelector
            floors={FLOORS}
            selectedFloorId={selectedFloorId}
            onSelectFloor={(id) => {
              playSpotSelectSound();
              setSelectedFloorId(id);
            }}
            floorAvailableCounts={floorAvailableCounts}
          />
        </section>

        {/* Filters & Interactive Search Bar */}
        <section>
          <ParkingFilters
            selectedType={filterType}
            onSelectType={setFilterType}
            nearLiftOnly={nearLiftOnly}
            onToggleNearLift={() => setNearLiftOnly(!nearLiftOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTriggerTrafficShift={triggerTrafficShift}
            isSimulating={isSimulating}
          />
        </section>

        {/* Interactive Real-Time Parking Lot Floor Map */}
        <section>
          <ParkingGrid
            floor={currentFloor}
            spots={currentFloorSpots}
            selectedSpot={selectedSpot}
            onSelectSpot={handleSpotSelect}
            targetPlateSearch={searchQuery}
          />
        </section>
      </main>

      {/* Spot Details Drawer / Booking Panel */}
      {bookingDrawerOpen && selectedSpot && (
        <SpotDetailsDrawer
          spot={selectedSpot}
          floor={currentFloor}
          onClose={() => setBookingDrawerOpen(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Payment Gateway Modal */}
      {paymentConfig && (
        <PaymentModal
          spot={paymentConfig.spot}
          floor={paymentConfig.floor}
          bookingConfig={paymentConfig.config}
          onClose={() => setPaymentConfig(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Active Digital Ticket Pass Modal */}
      {activeTicket && (
        <DigitalTicketModal
          reservation={activeTicket}
          onClose={() => setActiveTicket(null)}
          onExtendTime={handleExtendTime}
          onNavigateToSpot={handleNavigateToSpot}
        />
      )}

      {/* "My Passes" View Modal */}
      {activeTab === 'my-passes' && (
        <MyBookingsModal
          reservations={reservations}
          onSelectReservation={(res) => {
            setActiveTicket(res);
            setActiveTab('map');
          }}
          onExtendTime={handleExtendTime}
          onCancelReservation={handleCancelReservation}
          onClose={() => setActiveTab('map')}
          onNavigateToSpot={handleNavigateToSpot}
        />
      )}

      {/* "Rates & Mall Guide" Modal */}
      {activeTab === 'rates' && (
        <MallGuideModal onClose={() => setActiveTab('map')} />
      )}

      {/* Turn-by-Turn Waypoint Guidance Overlay */}
      {navigatingSpot && (
        <NavigationOverlay
          spot={navigatingSpot}
          onClose={() => setNavigatingSpot(null)}
        />
      )}

      {/* Quiet Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 py-6 px-4 text-xs text-slate-500 bg-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-slate-700 font-semibold">AuraPark Smart Mall System</span>
            <span aria-hidden="true">·</span>
            <span>Grand Horizon Mall Galleria</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>24/7 Barrier Automation</span>
            <span aria-hidden="true">·</span>
            <span>PCI-DSS Level 1 Encrypted</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('rates')}
              className="text-sky-700 hover:text-sky-800 transition-colors underline underline-offset-2"
            >
              Visitor Guidelines
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
