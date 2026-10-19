import React, { useState } from 'react';
import { ASSETS } from '../data/menuData';
import { CartItem, ComprobanteType, FacturaDetails, FulfillmentMode, OrderStage, StoreConfig } from '../types';

interface TrackingViewProps {
  orderNumber: string;
  orderStage: OrderStage;
  setOrderStage?: (stage: OrderStage) => void;
  fulfillmentMode: FulfillmentMode;
  cartItems: CartItem[];
  cartTotal: number;
  deliveryFee?: number;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  comprobante?: ComprobanteType;
  facturaDetails?: FacturaDetails;
  onBackToMenu: () => void;
  storeConfig?: StoreConfig;
}

const STAGES = [
  {
    stage: 1 as OrderStage,
    title: 'Pedido Recibido en Cocina',
    subtitle: 'Comanda registrada en la Dark Kitchen',
    icon: 'receipt_long',
    statusTag: 'Confirmado',
  },
  {
    stage: 2 as OrderStage,
    title: 'Fritura al Momento',
    subtitle: 'Dorando en aceite a 180°C - Frito al instante',
    icon: 'skillet',
    statusTag: 'En Freidora',
  },
  {
    stage: 3 as OrderStage,
    title: 'Empaque Térmico Anti-Humedad',
    subtitle: 'Caja con micro-respiraderos + potes de salsas frías',
    icon: 'inventory_2',
    statusTag: 'Empacando',
  },
  {
    stage: 4 as OrderStage,
    title: 'En Ruta de Entrega',
    subtitle: 'Motorizado en camino hacia tu dirección en San Miguel',
    icon: 'two_wheeler',
    statusTag: 'En Camino',
  },
  {
    stage: 5 as OrderStage,
    title: 'Pedido Entregado',
    subtitle: '¡Piqueos crujientes listos para disfrutar!',
    icon: 'check_circle',
    statusTag: 'Completado',
  },
];

export const TrackingView: React.FC<TrackingViewProps> = ({
  orderNumber,
  orderStage,
  fulfillmentMode,
  cartItems,
  cartTotal,
  deliveryFee,
  deliveryAddress,
  customerName = 'Cliente',
  customerPhone = '906 591 037',
  paymentMethod = 'yape',
  comprobante = 'boleta',
  facturaDetails,
  onBackToMenu,
  storeConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const currentStageInfo = STAGES[orderStage - 1] || STAGES[0];

  const estimatedMinutes = {
    1: '25 - 35 min',
    2: '20 - 25 min',
    3: '12 - 18 min',
    4: '5 - 10 min',
    5: 'Entregado',
  }[orderStage];

  const paymentLabel = {
    yape: 'Yape Oficial (906 591 037)',
    plin: 'Plin (906 591 037)',
    contra_entrega: 'Pago Contra Entrega (Efectivo / POS)',
    tarjeta: 'Tarjeta de Crédito / Débito',
  }[paymentMethod] || paymentMethod;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const generateWhatsAppInquiryUrl = () => {
    const text = `Hola Piqueos San Miguel, consulto por mi pedido #${orderNumber} a nombre de ${customerName}. ¿En qué estado va?`;
    return `https://wa.me/${storeConfig?.whatsappPhone || '51906591037'}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 sm:py-10 flex flex-col gap-8 print:p-0">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4BEBA]/30 print:hidden">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-[#A20513] hover:text-[#C62828] font-bold text-[14px] bg-white px-4 py-2 rounded-full border border-[#E4BEBA]/40 shadow-xs cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a la Carta
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyOrderNumber}
            className="inline-flex items-center gap-1.5 bg-white text-[#5B403D] hover:text-[#1B1B21] px-3.5 py-1.5 rounded-full border border-[#E4BEBA]/40 font-bold text-[12px] shadow-xs cursor-pointer transition-all"
            title="Copiar código de pedido"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? '¡Copiado!' : `Copiar #${orderNumber}`}</span>
          </button>

          <button
            onClick={handlePrintTicket}
            className="inline-flex items-center gap-1.5 bg-[#1B1B21] hover:bg-black text-white px-3.5 py-1.5 rounded-full font-bold text-[12px] shadow-xs cursor-pointer transition-all"
            title="Imprimir o guardar comprobante"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Imprimir Ticket</span>
          </button>
        </div>
      </div>

      {/* Hero Tracking Status Card */}
      <div className="bg-gradient-to-br from-white via-[#FBF8FF] to-[#F5F2FB] rounded-3xl border border-[#E4BEBA]/40 p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Status Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EADDFF] text-[#3A008B] font-extrabold text-[12px]">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                {orderStage === 5 ? 'Pedido Entregado' : `Tiempo estimado: ${estimatedMinutes}`}
              </span>
              <span className="bg-[#FFDAD6] text-[#A20513] font-bold text-[12px] px-3 py-1 rounded-full">
                Pedido #{orderNumber}
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[34px] font-black text-[#1B1B21] tracking-tight leading-tight">
              {orderStage === 1 && '¡Hemos registrado tu pedido en cocina!'}
              {orderStage === 2 && '¡Tus tequeños están en la freidora!'}
              {orderStage === 3 && 'Empacando en caja térmica con respiraderos...'}
              {orderStage === 4 && '¡Tu pedido va en ruta de entrega!'}
              {orderStage === 5 && '¡Pedido entregado con éxito! ¡Buen provecho!'}
            </h1>

            <p className="text-[14px] sm:text-[15px] text-[#5B403D] leading-relaxed">
              {orderStage === 1 &&
                'El pedido fue recibido por nuestro equipo en San Miguel. La comanda se encuentra en pantalla para iniciar la cocción en el minuto preciso.'}
              {orderStage === 2 &&
                'Masa wantán sumergida en aceite limpio a temperatura óptima de 180°C. Cero recalentados: dorado crujiente y relleno fundente garantizado.'}
              {orderStage === 3 &&
                'Colocamos los piqueos en cajas térmicas con micro-ventilación para evitar que el vapor ablande el crunch, junto con tus potes de cremas frescas.'}
              {orderStage === 4 &&
                (fulfillmentMode === 'delivery'
                  ? `El repartidor se encuentra en camino desde Calle Moore 296 hacia ${deliveryAddress}.`
                  : `Tu pedido está listo y empaquetado para recojo en ${storeConfig?.address || 'Calle Moore 296, San Miguel'}.`)}
              {orderStage === 5 &&
                'Tu pedido ha sido completado. Esperamos que disfrutes cada bocado crujiente. ¡Gracias por elegir Piqueos San Miguel!'}
            </p>

            {/* Quick WhatsApp Support */}
            <div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
              <a
                href={generateWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-[13px] shadow-xs active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Consultar Estado por WhatsApp (+51 906 591 037)
              </a>

              <a
                href="tel:+51906591037"
                className="bg-white hover:bg-gray-50 text-[#1B1B21] border border-[#E4BEBA]/40 px-4 py-2.5 rounded-full font-bold text-[13px] shadow-xs active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Llamar a Cocina
              </a>
            </div>
          </div>

          {/* Graphic Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#E4BEBA]/40 bg-white shadow-xl">
              <img
                src={ASSETS.superBoxTracking}
                alt="Pedido en proceso Piqueos San Miguel"
                className="w-full h-56 object-cover"
              />
              <div className="p-4 bg-white/95 backdrop-blur-md flex items-center justify-between border-t border-[#E4BEBA]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFDAD6] text-[#A20513] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">
                      {currentStageInfo.icon}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#A20513] block">
                      {currentStageInfo.statusTag}
                    </span>
                    <span className="text-[14px] font-extrabold text-[#1B1B21]">
                      {currentStageInfo.title}
                    </span>
                  </div>
                </div>
                <span className="text-[15px] font-black text-[#6C45C0]">
                  S/ {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Stepper */}
      <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 sm:p-8 shadow-xs">
        <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1B1B21] mb-6 flex items-center gap-2">
          <span className="w-2.5 h-6 rounded-full bg-[#A20513] inline-block"></span>
          Etapas del Pedido en Cocina
        </h2>

        <div className="relative">
          {/* Progress bar background line */}
          <div className="hidden md:block absolute top-6 left-10 right-10 h-1.5 bg-[#EAE7EF] rounded-full z-0">
            <div
              className="h-full bg-gradient-to-r from-[#A20513] to-[#6C45C0] rounded-full transition-all duration-700"
              style={{ width: `${((orderStage - 1) / 4) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {STAGES.map((s) => {
              const isPast = s.stage < orderStage;
              const isCurrent = s.stage === orderStage;

              return (
                <div
                  key={s.stage}
                  className={`flex md:flex-col items-center md:text-center gap-4 md:gap-3 p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-[#F5F2FB] border border-[#6C45C0]/40 shadow-xs'
                      : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[20px] transition-all shrink-0 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#A20513] text-white custom-pulse-ring'
                        : 'bg-[#EAE7EF] text-[#8F706C]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {isPast ? 'check' : s.icon}
                    </span>
                  </div>

                  <div className="flex flex-col md:items-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8F706C]">
                      {s.statusTag}
                    </span>
                    <span
                      className={`text-[13px] font-bold leading-snug ${
                        isCurrent
                          ? 'text-[#A20513]'
                          : isPast
                          ? 'text-[#1B1B21]'
                          : 'text-[#8F706C]'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[11px] text-[#5B403D] mt-0.5 line-clamp-2">
                      {s.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map & Delivery Personnel Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real Live Map Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4BEBA]/30 p-5 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/20 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#A20513]">navigation</span>
              <h3 className="text-[16px] font-bold text-[#1B1B21]">Ruta de Entrega en San Miguel</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              GPS en Línea
            </span>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden map-pattern border border-[#E4BEBA]/40 flex items-center justify-center">
            {/* Street Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="50" x2="400" y2="80" stroke="#6C45C0" strokeWidth="6" strokeDasharray="6,4" />
              <line x1="100" y1="200" x2="350" y2="120" stroke="#A20513" strokeWidth="8" />
              <line x1="50" y1="240" x2="320" y2="240" stroke="#BA1A1A" strokeWidth="3" />
            </svg>

            {/* Landmarks */}
            <div className="absolute top-4 left-6 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#5B403D] border border-[#E4BEBA]/30 shadow-2xs">
              Av. La Paz / Parque Media Luna
            </div>
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#5B403D] border border-[#E4BEBA]/30 shadow-2xs">
              Malecón Costanera San Miguel
            </div>

            {/* Kitchen Pin */}
            <div className="absolute top-12 left-10 flex flex-col items-center">
              <div className="bg-[#A20513] text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
              </div>
              <span className="bg-white/95 text-[10px] font-extrabold text-[#1B1B21] px-2 py-0.5 rounded shadow-xs mt-1 border border-[#E4BEBA]/40">
                Dark Kitchen: Calle Moore 296
              </span>
            </div>

            {/* Customer Destination Pin */}
            <div className="absolute bottom-10 right-10 flex flex-col items-center">
              <div className="bg-emerald-600 text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </div>
              <span className="bg-white/95 text-[10px] font-extrabold text-[#1B1B21] px-2 py-0.5 rounded shadow-xs mt-1 border border-[#E4BEBA]/40">
                Destino: {customerName}
              </span>
            </div>

            {/* Driver Marker */}
            <div
              className="absolute transition-all duration-700 flex flex-col items-center"
              style={{
                top: orderStage === 1 ? '16%' : orderStage === 2 ? '25%' : orderStage === 3 ? '35%' : orderStage === 4 ? '55%' : '75%',
                left: orderStage === 1 ? '14%' : orderStage === 2 ? '25%' : orderStage === 3 ? '40%' : orderStage === 4 ? '60%' : '80%',
              }}
            >
              <div className="bg-[#6C45C0] text-white p-2 rounded-full shadow-xl custom-pulse-ring flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
              </div>
              <span className="bg-[#303036] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs mt-1">
                {orderStage < 4 ? 'Preparando en Cocina' : orderStage === 4 ? 'Motorizado Carlos en Camino' : '¡En Puerta!'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 text-[12px] text-[#5B403D] gap-2">
            <span>
              <strong>Dirección de Entrega:</strong>{' '}
              {fulfillmentMode === 'delivery' ? deliveryAddress : storeConfig?.address}
            </span>
            <span className="text-[#A20513] font-bold">San Miguel, Lima</span>
          </div>
        </div>

        {/* Order Details & Receipt (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Driver Card */}
          <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/20">
              <h3 className="text-[16px] font-bold text-[#1B1B21]">Repartidor Asignado</h3>
              <span className="text-[11px] font-bold bg-[#EADDFF] text-[#3A008B] px-2.5 py-0.5 rounded-full">
                Personal Oficial PSM
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={ASSETS.driverCarlos}
                alt="Carlos Ramírez Repartidor"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E4BEBA]/40 shadow-xs"
              />
              <div className="flex flex-col">
                <h4 className="text-[17px] font-extrabold text-[#1B1B21]">Carlos Ramírez</h4>
                <div className="flex items-center gap-1 text-amber-600 text-[13px] font-bold">
                  <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                  4.95 (520 pedidos entregados)
                </div>
                <span className="text-[12px] text-[#5B403D] mt-0.5">
                  Moto Honda Cargo · <strong className="text-[#1B1B21]">Placa: 4821-5B</strong>
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F5F2FB] rounded-2xl border border-[#E4BEBA]/20 flex items-center justify-between text-[12px]">
              <span className="text-[#5B403D]">Mochila Térmica:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Aislamiento Térmico Certificado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 print:hidden">
              <a
                href={`https://wa.me/51906591037?text=Hola%20Carlos,%20soy%20el%20cliente%20del%20pedido%20%23${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                WhatsApp
              </a>
              <a
                href="tel:+51906591037"
                className="bg-[#EAE7EF] hover:bg-[#E4E1EA] text-[#1B1B21] py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors border border-[#E4BEBA]/30"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Llamar
              </a>
            </div>
          </div>

          {/* Ticket / Detalle de Comprobante Oficial */}
          <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 shadow-xs flex flex-col gap-3">
            <h3 className="text-[15px] font-bold text-[#1B1B21] pb-2 border-b border-[#E4BEBA]/20 flex items-center justify-between">
              <span>Detalle del Pedido #{orderNumber}</span>
              <span className="text-[#A20513] font-extrabold">{cartItems.length} ítems</span>
            </h3>

            <div className="text-[12px] text-[#5B403D] flex flex-col gap-1 pb-2 border-b border-[#E4BEBA]/20">
              <div>
                <strong>Cliente:</strong> {customerName} ({customerPhone})
              </div>
              <div>
                <strong>Modalidad:</strong>{' '}
                {fulfillmentMode === 'delivery' ? 'Delivery a Domicilio' : 'Recojo en Dark Kitchen'}
              </div>
              <div>
                <strong>Método de Pago:</strong> {paymentLabel}
              </div>
              <div>
                <strong>Comprobante:</strong>{' '}
                {comprobante === 'factura' && facturaDetails?.ruc
                  ? `Factura RUC: ${facturaDetails.ruc} - ${facturaDetails.razonSocial}`
                  : 'Boleta de Venta Electrónica'}
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-[12px] text-[#5B403D]">
                  <div>
                    <span className="font-bold text-[#1B1B21]">{item.quantity}x</span> {item.name}
                    {item.portionLabel && (
                      <span className="block text-[10px] text-gray-500">{item.portionLabel}</span>
                    )}
                  </div>
                  <span className="font-semibold text-[#1B1B21]">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E4BEBA]/20 flex flex-col gap-1 text-[13px]">
              <div className="flex justify-between text-[#5B403D]">
                <span>Costo de Entrega:</span>
                <span>
                  {fulfillmentMode === 'delivery'
                    ? deliveryFee === 0
                      ? '¡GRATIS! (Promoción)'
                      : `S/ ${(deliveryFee ?? storeConfig?.deliveryFee ?? 5.0).toFixed(2)}`
                    : 'Gratis (Recojo en Local)'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[15px] text-[#1B1B21] pt-1 border-t border-[#E4BEBA]/20">
                <span>Total a Pagar:</span>
                <span className="text-[20px] font-black text-[#A20513]">
                  S/ {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
