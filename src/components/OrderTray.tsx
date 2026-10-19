import React, { useState } from 'react';
import { CartItem, ComprobanteType, FacturaDetails, FulfillmentMode, StoreConfig } from '../types';

interface OrderTrayProps {
  cartItems: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  fulfillmentMode: FulfillmentMode;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  comprobante: ComprobanteType;
  setComprobante: (type: ComprobanteType) => void;
  facturaDetails: FacturaDetails;
  setFacturaDetails: React.Dispatch<React.SetStateAction<FacturaDetails>>;
  onConfirmOrder: () => void;
  storeConfig?: StoreConfig;
  selectedZoneId?: string;
  onSelectZone?: (zoneId: string) => void;
}

export const OrderTray: React.FC<OrderTrayProps> = ({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  fulfillmentMode,
  setFulfillmentMode,
  comprobante,
  setComprobante,
  facturaDetails,
  setFacturaDetails,
  onConfirmOrder,
  storeConfig,
  selectedZoneId = 'san-miguel',
  onSelectZone,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('Av. La Paz 1420, Dpto 402, San Miguel');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const zones = storeConfig?.deliveryZones || [
    { id: 'san-miguel', name: 'San Miguel (Zona Base)', fee: 5.00 },
    { id: 'magdalena', name: 'Magdalena del Mar', fee: 6.50 },
    { id: 'pueblo-libre', name: 'Pueblo Libre', fee: 6.50 },
    { id: 'bellavista-laperla', name: 'Bellavista / La Perla (Callao)', fee: 7.50 },
    { id: 'jesus-maria', name: 'Jesús María / Breña', fee: 8.50 },
  ];

  const currentZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const freeThreshold = storeConfig?.freeDeliveryThreshold ?? 60.0;
  const isFreeDeliveryQualified = freeThreshold > 0 && subtotal >= freeThreshold;

  const baseZoneFee = currentZone ? currentZone.fee : (storeConfig?.deliveryFee ?? 5.0);
  const deliveryFee = fulfillmentMode === 'delivery' ? (isFreeDeliveryQualified ? 0.0 : baseZoneFee) : 0.0;
  const total = subtotal + deliveryFee;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <aside className="flex flex-col gap-4">
      <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-5 shadow-lg flex flex-col gap-4">
        {/* Header of Tray */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#A20513] text-[24px]">
              shopping_basket
            </span>
            <h3 className="text-[18px] font-bold text-[#1B1B21]">Tu Pedido Actual</h3>
          </div>
          <span className="bg-[#A20513]/10 text-[#A20513] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
            {totalItemsCount} {totalItemsCount === 1 ? 'Ítem' : 'Ítems'}
          </span>
        </div>

        {/* Free Delivery Incentive Bar */}
        {freeThreshold > 0 && fulfillmentMode === 'delivery' && (
          <div className="p-2.5 bg-gradient-to-r from-[#F5F2FB] to-white rounded-2xl border border-[#6C45C0]/25 text-[12px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1 text-[#6C45C0]">
                <span className="material-symbols-outlined text-[16px]">moped</span>
                {isFreeDeliveryQualified ? '¡Delivery GRATIS conseguido!' : 'Envío GRATIS en pedidos desde S/ ' + freeThreshold.toFixed(0)}
              </span>
              <span className="text-[#A20513] font-black">
                {isFreeDeliveryQualified ? 'S/ 0.00' : `Faltan S/ ${(freeThreshold - subtotal).toFixed(2)}`}
              </span>
            </div>
            <div className="w-full bg-[#EAE7EF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#A20513] to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Fulfillment Toggle inside cart */}
        <div className="bg-[#F5F2FB] p-1.5 rounded-2xl flex flex-col gap-2 border border-[#E4BEBA]/20">
          <div className="grid grid-cols-2 gap-1 text-center text-[12px]">
            <button
              type="button"
              onClick={() => setFulfillmentMode('pickup')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer ${
                fulfillmentMode === 'pickup'
                  ? 'font-bold bg-white text-[#A20513] shadow-xs'
                  : 'font-medium text-[#5B403D] hover:text-[#A20513]'
              }`}
            >
              Recojo en Local
              <span className="block text-[10px] text-emerald-600 font-bold">¡Gratis! (S/ 0.00)</span>
            </button>

            <button
              type="button"
              onClick={() => setFulfillmentMode('delivery')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer ${
                fulfillmentMode === 'delivery'
                  ? 'font-bold bg-white text-[#A20513] shadow-xs'
                  : 'font-medium text-[#5B403D] hover:text-[#A20513]'
              }`}
            >
              Delivery Express
              <span className="block text-[10px] text-[#5B403D] font-normal">
                {isFreeDeliveryQualified ? '¡Gratis por tu compra!' : `Desde S/ ${zones[0]?.fee.toFixed(2)}`}
              </span>
            </button>
          </div>

          {/* Delivery Zone Selector if delivery is selected */}
          {fulfillmentMode === 'delivery' && (
            <div className="px-1 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#1B1B21] flex items-center justify-between">
                <span>Distrito / Zona de Entrega:</span>
                <span className="text-[10px] text-[#6C45C0] font-semibold">Tarifa variable</span>
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => onSelectZone && onSelectZone(e.target.value)}
                className="w-full bg-white text-[12px] font-medium p-2 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-1 focus:ring-[#A20513]"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {isFreeDeliveryQualified ? 'GRATIS (Supera umbral)' : `S/ ${zone.fee.toFixed(2)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Address / Location Info banner */}
          <div className="p-2.5 bg-white rounded-xl border border-[#E4BEBA]/30 text-[12px] text-[#5B403D] flex items-start gap-2">
            {fulfillmentMode === 'pickup' ? (
              <>
                <span className="material-symbols-outlined text-[#A20513] text-[18px] shrink-0">
                  store
                </span>
                <div>
                  <strong className="text-[#1B1B21] block font-bold">Dark Kitchen San Miguel:</strong>
                  <span>{storeConfig?.address || 'Comandante Guillermo Moore 296, San Miguel'} (Listo en 15-20 min).</span>
                </div>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[#6C45C0] text-[18px] shrink-0">
                  moped
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1B1B21] block font-bold">Dirección de Entrega:</strong>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-[10px] text-[#A20513] font-bold underline cursor-pointer"
                    >
                      {isEditingAddress ? 'Guardar' : 'Cambiar'}
                    </button>
                  </div>
                  {isEditingAddress ? (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-[11px] p-1.5 mt-1 border rounded border-[#E4BEBA]"
                      placeholder="Ingresa tu dirección exacta en San Miguel..."
                    />
                  ) : (
                    <span>{deliveryAddress} (25-40 min)</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scroll">
          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-[#5B403D] text-[13px]">
              <span className="material-symbols-outlined text-4xl text-[#E4BEBA] block mb-1">
                production_quantity_limits
              </span>
              Tu carrito está vacío. ¡Elige tus tequeños favoritos!
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F2FB] border border-[#E4BEBA]/20 gap-2"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[13px] font-bold text-[#1B1B21] truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-[#5B403D]">
                    {item.portionLabel || 'Con salsas de la casa'}
                  </span>
                  <span className="text-[14px] font-extrabold text-[#A20513] mt-0.5">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-[#E4BEBA]/30 shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="text-[#5B403D] hover:text-[#A20513] text-[16px] font-bold px-1 cursor-pointer"
                    title="Disminuir"
                  >
                    −
                  </button>
                  <span className="text-[12px] font-bold text-[#1B1B21] px-1">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="text-[#5B403D] hover:text-[#A20513] text-[16px] font-bold px-1 cursor-pointer"
                    title="Aumentar"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[#8F706C] hover:text-[#BA1A1A] p-1 transition-colors cursor-pointer"
                  title="Eliminar ítem"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Electronic Receipt Selector (Boleta / Factura SUNAT) */}
        <div className="pt-2 border-t border-[#E4BEBA]/20">
          <label className="block text-[11px] font-bold text-[#1B1B21] mb-1.5">
            Comprobante Electrónico (SUNAT):
          </label>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <label
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                comprobante === 'boleta'
                  ? 'border-[#A20513] bg-[#FFDAD6]/30 font-bold text-[#1B1B21]'
                  : 'border-[#E4BEBA]/30 bg-[#F5F2FB] text-[#5B403D]'
              }`}
            >
              <input
                type="radio"
                name="comprobante"
                value="boleta"
                checked={comprobante === 'boleta'}
                onChange={() => setComprobante('boleta')}
                className="text-[#A20513] focus:ring-[#A20513]"
              />
              <span>Boleta de Venta</span>
            </label>

            <label
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                comprobante === 'factura'
                  ? 'border-[#A20513] bg-[#FFDAD6]/30 font-bold text-[#1B1B21]'
                  : 'border-[#E4BEBA]/30 bg-[#F5F2FB] text-[#5B403D]'
              }`}
            >
              <input
                type="radio"
                name="comprobante"
                value="factura"
                checked={comprobante === 'factura'}
                onChange={() => setComprobante('factura')}
                className="text-[#A20513] focus:ring-[#A20513]"
              />
              <span>Factura RUC</span>
            </label>
          </div>

          {/* Factura Fields */}
          {comprobante === 'factura' && (
            <div className="mt-2 p-2.5 bg-[#EAE7EF] rounded-xl flex flex-col gap-2 text-[12px]">
              <input
                type="text"
                placeholder="Número de RUC (11 dígitos)"
                value={facturaDetails.ruc}
                onChange={(e) => setFacturaDetails({ ...facturaDetails, ruc: e.target.value })}
                className="w-full bg-white rounded-lg border border-[#E4BEBA] p-2 focus:ring-[#A20513]"
              />
              <input
                type="text"
                placeholder="Razón Social de la Empresa"
                value={facturaDetails.razonSocial}
                onChange={(e) => setFacturaDetails({ ...facturaDetails, razonSocial: e.target.value })}
                className="w-full bg-white rounded-lg border border-[#E4BEBA] p-2 focus:ring-[#A20513]"
              />
              <input
                type="text"
                placeholder="Dirección Fiscal"
                value={facturaDetails.direccionFiscal}
                onChange={(e) =>
                  setFacturaDetails({ ...facturaDetails, direccionFiscal: e.target.value })
                }
                className="w-full bg-white rounded-lg border border-[#E4BEBA] p-2 focus:ring-[#A20513]"
              />
            </div>
          )}
        </div>

        {/* Total Summary Calculations */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-[#E4BEBA]/20 text-[13px]">
          <div className="flex justify-between text-[#5B403D]">
            <span>Subtotal de Tequeños:</span>
            <span className="font-semibold text-[#1B1B21]">S/ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[#5B403D]">
            <span>Empaque térmico Dark Kitchen:</span>
            <span className="font-bold text-emerald-600">Gratis (S/ 0.00)</span>
          </div>

          <div className="flex justify-between text-[#5B403D] items-center">
            <span>
              Costo de Entrega ({fulfillmentMode === 'pickup' ? 'Recojo' : currentZone?.name}):
            </span>
            <div className="text-right">
              {fulfillmentMode === 'pickup' ? (
                <span className="font-bold text-emerald-600">S/ 0.00 (Recojo)</span>
              ) : isFreeDeliveryQualified ? (
                <span className="font-bold text-emerald-600">
                  <span className="line-through text-gray-400 mr-1.5 text-[11px]">
                    S/ {baseZoneFee.toFixed(2)}
                  </span>
                  ¡GRATIS!
                </span>
              ) : (
                <span className="font-semibold text-[#1B1B21]">S/ {deliveryFee.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-[16px] font-extrabold text-[#1B1B21] pt-2 border-t border-[#E4BEBA]/30 items-baseline">
            <span>Total a Pagar:</span>
            <span className="text-[22px] font-black text-[#A20513]">S/ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Security Badge */}
        <div className="bg-[#F5F2FB] p-2.5 rounded-2xl border border-[#E4BEBA]/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#1B1B21] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              Medios de Pago Disponibles
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              Yape · Plin · POS · Efectivo
            </span>
          </div>
        </div>

        {/* Checkout Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={onConfirmOrder}
            className={`w-full py-3.5 rounded-full font-extrabold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              cartItems.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#A20513] hover:bg-[#C62828] text-white active:scale-98'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Confirmar Pedido (S/ {total.toFixed(2)})
          </button>
        </div>
      </div>
    </aside>
  );
};
