import React, { useState } from 'react';
import { ParkingSpot, FloorInfo, Reservation } from '../types';
import { CreditCard, Smartphone, ShieldCheck, Lock, X, Loader2, Car, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/audio';

interface PaymentModalProps {
  spot: ParkingSpot;
  floor: FloorInfo;
  bookingConfig: {
    durationHours: number;
    arrivalOffsetMinutes: number;
    evAddon: boolean;
    carWashAddon: boolean;
    discountCode: string;
    discountAmount: number;
    baseAmount: number;
    totalAmount: number;
  };
  onClose: () => void;
  onPaymentSuccess: (reservation: Reservation) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  spot,
  floor,
  bookingConfig,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'google_pay' | 'upi'>('card');
  
  // Vehicle details
  const [licensePlate, setLicensePlate] = useState<string>('7XYZ-420');
  const [vehicleMake, setVehicleMake] = useState<string>('Tesla');
  const [vehicleModel, setVehicleModel] = useState<string>('Model 3');
  const [vehicleColor, setVehicleColor] = useState<string>('Pearl White');
  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'ev' | 'hatchback' | 'motorcycle'>('ev');
  const [phoneNumber, setPhoneNumber] = useState<string>('+1 (555) 234-8899');

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('4242 8821 9012 4040');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('382');
  const [cardHolder, setCardHolder] = useState<string>('ALEX RIVERA');

  // Payment execution state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handlePay = () => {
    if (!licensePlate.trim()) return;
    setIsProcessing(true);
    setProcessingStep('Authorizing payment with bank gateway...');

    setTimeout(() => {
      setProcessingStep('3D Secure cryptographic handshake...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Assigning hardware bay lock & QR pass...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch {
        // ignore
      }

      playSuccessSound();

      const startTime = Date.now() + bookingConfig.arrivalOffsetMinutes * 60 * 1000;
      const endTime = startTime + bookingConfig.durationHours * 60 * 60 * 1000;

      const newReservation: Reservation = {
        id: `RES-${Date.now().toString(36).toUpperCase()}`,
        spotId: spot.id,
        spotCode: spot.code,
        floorId: floor.id,
        floorName: floor.name,
        licensePlate: licensePlate.toUpperCase(),
        vehicleMake,
        vehicleModel,
        vehicleColor,
        vehicleType,
        phone: phoneNumber,
        startTime,
        endTime,
        durationHours: bookingConfig.durationHours,
        baseAmount: bookingConfig.baseAmount,
        evAddon: bookingConfig.evAddon ? 5.0 : 0,
        carWashAddon: bookingConfig.carWashAddon,
        carWashAmount: bookingConfig.carWashAddon ? 14.0 : 0,
        discountAmount: bookingConfig.discountAmount,
        discountCode: bookingConfig.discountCode,
        taxAmount: (bookingConfig.totalAmount * 0.08) / 1.08,
        totalAmount: bookingConfig.totalAmount,
        paymentMethod,
        paymentCardLast4: cardNumber.slice(-4) || '4040',
        paymentStatus: 'completed',
        qrCodeToken: `MALL-PARK:${spot.id}:${licensePlate}:${endTime}`,
        status: 'active',
        createdAt: Date.now(),
      };

      onPaymentSuccess(newReservation);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-2xl p-6 sm:p-7 border border-slate-200/90 my-8 shadow-2xl">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sky-700 text-xs font-mono font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>256-BIT ENCRYPTED CHECKOUT</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Reserve Spot {spot.code} · {floor.id}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total payable: <span className="font-mono text-sky-700 font-bold text-sm">${bookingConfig.totalAmount.toFixed(2)}</span> · {bookingConfig.durationHours} hrs parking
          </p>
        </div>

        {/* Processing Overlay State */}
        {isProcessing ? (
          <div className="py-14 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-300 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Securing Mall Parking Bay...
            </h3>
            <p className="text-xs font-mono text-sky-700 font-medium animate-pulse">
              {processingStep}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Vehicle & Contact Info */}
            <div className="p-4 rounded-xl bg-white/70 border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-sky-600" />
                <span>Vehicle &amp; Barrier Scanner Registration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    License Plate (For Automatic Barrier Gate)
                  </label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="e.g. 7XYZ-420"
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg font-mono uppercase tracking-wider font-bold text-sky-800 shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    Mobile Phone (For Pass &amp; Alerts)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    Vehicle Make &amp; Model
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="Make (e.g. Tesla)"
                      className="w-1/2 px-2.5 py-2 text-xs glass-input rounded-lg shadow-xs"
                    />
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="Model (e.g. Model 3)"
                      className="w-1/2 px-2.5 py-2 text-xs glass-input rounded-lg shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg shadow-xs"
                  >
                    <option value="ev">Electric Vehicle (EV)</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV / Crossover</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Methods */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select Online Payment Method</span>
                <span className="text-[11px] text-slate-500 font-mono">Instant Confirmation</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4 text-sky-600" /> },
                  { id: 'apple_pay', label: 'Apple Pay', icon: <Smartphone className="w-4 h-4 text-slate-900" /> },
                  { id: 'google_pay', label: 'Google Pay', icon: <span className="font-bold text-xs text-blue-600">GPay</span> },
                  { id: 'upi', label: 'UPI / QR', icon: <QrCode className="w-4 h-4 text-emerald-600" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs border ${
                      paymentMethod === m.id
                        ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold shadow-xs'
                        : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {m.icon}
                    <span className="font-medium text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Conditional Card inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-white/70 border border-slate-200/90 space-y-3 shadow-xs">
                  {/* Clean Titanium/Navy Minimal Virtual Card Preview */}
                  <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-950 border border-slate-700/80 shadow-md relative overflow-hidden text-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-xs tracking-widest text-sky-300 font-medium">AURAPARK SECURE PAY</span>
                      <span className="font-mono text-xs font-bold text-white">VISA / MC</span>
                    </div>
                    <div className="font-mono text-base tracking-widest text-white mb-3 font-semibold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Cardholder</div>
                        <div className="text-white font-medium">{cardHolder || 'VALUED CUSTOMER'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Expires</div>
                        <div className="text-white">{cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 text-xs glass-input rounded-lg font-mono shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-600 font-medium mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 text-xs glass-input rounded-lg font-mono shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 font-medium mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 text-xs glass-input rounded-lg font-mono shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 text-xs glass-input rounded-lg uppercase shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-5 rounded-xl bg-white/70 border border-slate-200 text-center space-y-2 shadow-xs">
                  <Smartphone className="w-8 h-8 text-slate-900 mx-auto" />
                  <div className="text-sm font-bold text-slate-900">Apple Pay Ready</div>
                  <p className="text-xs text-slate-500">
                    Confirm payment of ${bookingConfig.totalAmount.toFixed(2)} with Face ID or Touch ID on your device.
                  </p>
                </div>
              )}

              {paymentMethod === 'google_pay' && (
                <div className="p-5 rounded-xl bg-white/70 border border-slate-200 text-center space-y-2 shadow-xs">
                  <span className="font-bold text-lg text-blue-600">Google Pay</span>
                  <div className="text-sm font-bold text-slate-900">Google Pay Fast Checkout</div>
                  <p className="text-xs text-slate-500">
                    Charge saved card ending in 4040 with 1-click biometric authorization.
                  </p>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-xl bg-white/70 border border-slate-200 text-center space-y-2 shadow-xs">
                  <QrCode className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-900">Scan &amp; Pay via Any UPI App</div>
                  <p className="text-xs text-slate-500">
                    Use Google Pay, PhonePe, Paytm, or your banking app. Dynamic QR will lock the bay immediately.
                  </p>
                </div>
              )}
            </div>

            {/* Guarantee footer */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Free cancellation up to 15 minutes before reservation start time. Automated barrier opens upon arrival.
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!licensePlate.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-[0_4px_16px_rgba(2,132,199,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm &amp; Pay ${bookingConfig.totalAmount.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
