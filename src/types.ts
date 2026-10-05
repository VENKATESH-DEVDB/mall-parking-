export type SpotType = 'standard' | 'ev_charge' | 'accessible' | 'compact' | 'vip';

export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'selected';

export interface ParkingSpot {
  id: string; // e.g. "P1-A01"
  code: string; // e.g. "A-01"
  floorId: 'P1' | 'P2' | 'P3' | 'P4';
  type: SpotType;
  status: SpotStatus;
  ratePerHour: number;
  row: number;
  col: number;
  section: 'A' | 'B' | 'C' | 'D';
  nearLobby: string; // e.g. "West Elevator - Zara & Fashion Court"
  distanceMeters: number;
  evKw?: number;
  lastUpdated?: string;
  occupiedPlate?: string;
}

export interface FloorInfo {
  id: 'P1' | 'P2' | 'P3' | 'P4';
  name: string;
  subname: string;
  totalSpots: number;
  availableSpots: number;
  evSpots: number;
  accessibleSpots: number;
  clearance: string;
  features: string[];
  baseRate: number;
}

export interface Reservation {
  id: string;
  spotId: string;
  spotCode: string;
  floorId: 'P1' | 'P2' | 'P3' | 'P4';
  floorName: string;
  licensePlate: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleType: 'sedan' | 'suv' | 'ev' | 'hatchback' | 'motorcycle';
  phone: string;
  startTime: number; // timestamp
  endTime: number; // timestamp
  durationHours: number;
  baseAmount: number;
  evAddon: number;
  carWashAddon: boolean;
  carWashAmount: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'apple_pay' | 'card' | 'google_pay' | 'upi';
  paymentCardLast4?: string;
  paymentStatus: 'completed' | 'refunded';
  qrCodeToken: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface ParkingFilter {
  type: 'all' | SpotType;
  nearLiftOnly: boolean;
  maxDistance?: number;
  searchQuery: string;
}
