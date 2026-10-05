import { FloorInfo, ParkingSpot, SpotType } from '../types';

export const FLOORS: FloorInfo[] = [
  {
    id: 'P1',
    name: 'P1 · Ground & Luxury Court',
    subname: 'Fastest Mall Entry · Designer Boutiques & Valet',
    totalSpots: 36,
    availableSpots: 14,
    evSpots: 8,
    accessibleSpots: 4,
    clearance: '2.4m',
    features: ['Direct to Fashion Gallery', 'Valet Lounge', '150kW Supercharger'],
    baseRate: 4.5,
  },
  {
    id: 'P2',
    name: 'P2 · Cinema & Dining Plaza',
    subname: 'Elevator to IMAX, Terrace Restaurants & Gaming',
    totalSpots: 36,
    availableSpots: 19,
    evSpots: 6,
    accessibleSpots: 4,
    clearance: '2.2m',
    features: ['Near IMAX Box Office', 'Food Court Express Lift', 'Family Bays'],
    baseRate: 3.5,
  },
  {
    id: 'P3',
    name: 'P3 · Hypermarket & Tech',
    subname: 'Extra Wide Bays · Direct Cart Escalators',
    totalSpots: 36,
    availableSpots: 22,
    evSpots: 8,
    accessibleSpots: 4,
    clearance: '2.2m',
    features: ['Direct Trolley Belt', 'Covered Loading Zone', '22kW EV Chargers'],
    baseRate: 3.0,
  },
  {
    id: 'P4',
    name: 'P4 · Sky Deck & Long Stay',
    subname: 'Rooftop Panoramic Bay · Solar Canopy & Best Value',
    totalSpots: 32,
    availableSpots: 26,
    evSpots: 4,
    accessibleSpots: 2,
    clearance: 'Open Air',
    features: ['Open Sky View', 'Solar Shaded Bays', 'Long-stay Discount'],
    baseRate: 2.5,
  },
];

const OCCUPIED_PLATES = [
  '7XYZ821', '9ABC410', '4KLR992', '5MNO103', '3TUV774',
  '8WXY520', '6JKL349', '2BCA911', '1HGF602', '9EDC338',
  '4PLM810', '7QWE512', '5ASD990', '3ZXC741', '8RTY229',
  '2UIO664', '6PAS118', '9DFG472', '1HJK830', '4LZX309'
];

export function generateInitialSpots(): ParkingSpot[] {
  const spots: ParkingSpot[] = [];
  let plateIndex = 0;

  const floorConfigs: { id: 'P1' | 'P2' | 'P3' | 'P4'; rows: number; cols: number; baseRate: number }[] = [
    { id: 'P1', rows: 4, cols: 9, baseRate: 4.5 },
    { id: 'P2', rows: 4, cols: 9, baseRate: 3.5 },
    { id: 'P3', rows: 4, cols: 9, baseRate: 3.0 },
    { id: 'P4', rows: 4, cols: 8, baseRate: 2.5 },
  ];

  floorConfigs.forEach((floor) => {
    for (let r = 0; r < floor.rows; r++) {
      const section: 'A' | 'B' = r < 2 ? 'A' : 'B';
      for (let c = 0; c < floor.cols; c++) {
        const spotNumber = (r % 2) * floor.cols + c + 1;
        const code = `${section}-${spotNumber < 10 ? '0' : ''}${spotNumber}`;
        const id = `${floor.id}-${code}`;

        // Determine spot type
        let type: SpotType = 'standard';
        let evKw: number | undefined;

        if ((c === 0 || c === 1) && r % 2 === 0) {
          type = 'ev_charge';
          evKw = floor.id === 'P1' ? 150 : 22;
        } else if (c === 2 && r % 2 === 0) {
          type = 'accessible';
        } else if (c === 7 || c === 8) {
          type = r === 0 ? 'vip' : 'compact';
        }

        // Deterministic realistic initial state
        const hash = (floor.id.charCodeAt(1) * 31 + r * 13 + c * 7) % 100;
        let status: 'available' | 'occupied' | 'reserved' = 'available';
        let occupiedPlate: string | undefined;

        if (hash < 48) {
          status = 'occupied';
          occupiedPlate = OCCUPIED_PLATES[plateIndex % OCCUPIED_PLATES.length];
          plateIndex++;
        } else if (hash < 58) {
          status = 'reserved';
        } else {
          status = 'available';
        }

        // Ensure key showcase spots are always available for instant user booking!
        if (code === 'A-01' || code === 'A-02' || code === 'B-04' || code === 'A-06' || code === 'B-08') {
          status = 'available';
          occupiedPlate = undefined;
        }

        // Distance & lobby proximity
        const distanceMeters = 10 + Math.abs(c - 4) * 4 + (r % 2) * 5;
        let nearLobby = 'Central Mall Elevators';
        if (c < 3) {
          nearLobby = floor.id === 'P1' ? 'West Court · Luxury & Zara' : 'West Escalator · IMAX 3D';
        } else if (c > 5) {
          nearLobby = floor.id === 'P1' ? 'East Plaza · Valet Drop-off' : 'East Lift · Gourmet Terrace';
        }

        // Rate
        let ratePerHour = floor.baseRate;
        if (type === 'vip') ratePerHour += 2.0;
        if (type === 'compact') ratePerHour = Math.max(2.0, ratePerHour - 0.5);

        spots.push({
          id,
          code,
          floorId: floor.id,
          type,
          status,
          ratePerHour,
          row: r,
          col: c,
          section,
          nearLobby,
          distanceMeters,
          evKw,
          occupiedPlate: status === 'occupied' ? occupiedPlate : undefined,
        });
      }
    }
  });

  return spots;
}
