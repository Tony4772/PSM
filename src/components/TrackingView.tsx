import React from 'react';
import { ASSETS } from '../data/menuData';
import { CartItem, FulfillmentMode, OrderStage } from '../types';

interface TrackingViewProps {
  orderNumber: string;
  orderStage: OrderStage;
  setOrderStage: (stage: OrderStage) => void;
  fulfillmentMode: FulfillmentMode;
  cartItems: CartItem[];
  cartTotal: number;
  deliveryAddress: string;
  onBackToMenu: () => void;
}

const STAGES = [
  {
    stage: 1 as OrderStage,
    title: 'Pedido Confirmado',
    subtitle: 'Pago recibido por Culqi / Yape',
    icon: 'receipt_long',
    time: '19:42',
  },
  {
    stage: 2 as OrderStage,
    title: 'Fritura al Momento',
    subtitle: 'Dorando en aceite a 180°C',
    icon: 'skillet',
    time: '19:47',
  },
  {
    stage: 3 as OrderStage,
    title: 'Empaque Térmico',
    subtitle: 'Caja con micro-respiraderos anti-humedad',
    icon: 'inventory_2',
    time: '19:55',
  },
  {
    stage: 4 as OrderStage,
    title: 'En Camino',
    subtitle: 'Repartidor Carlos en ruta por San Miguel',
    icon: 'two_wheeler',
    time: '20:05',
  },
  {
    stage: 5 as OrderStage,
    title: '¡Entregado!',
    subtitle: 'Piqueos crujientes listos para compartir',
    icon: 'check_circle',
    time: '20:18',
  },
];

export const TrackingView: React.FC<TrackingViewProps> = ({
  orderNumber,
  orderStage,
  setOrderStage,
  fulfillmentMode,
  cartItems,
  cartTotal,
  deliveryAddress,
  onBackToMenu,
}) => {
  const currentStageInfo = STAGES[orderStage - 1];

  const estimatedMinutes = {
    1: '25 - 35 min',
    2: '20 - 25 min',
    3: '12 - 18 min',
    4: '5 - 10 min',
    5: 'Completado',
  }[orderStage];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 sm:py-10 flex flex-col gap-8">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4BEBA]/30">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-[#A20513] hover:text-[#C62828] font-bold text-[14px] bg-white px-4 py-2 rounded-full border border-[#E4BEBA]/40 shadow-xs cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a la Carta
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#5B403D]">Modo Simulación:</span>
          <div className="inline-flex bg-[#F5F2FB] p-1 rounded-full border border-[#E4BEBA]/30 text-[11px] font-bold">
            {([1, 2, 3, 4, 5] as OrderStage[]).map((st) => (
              <button
                key={st}
                onClick={() => setOrderStage(st)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  orderStage === st
                    ? 'bg-[#A20513] text-white shadow-xs'
                    : 'text-[#5B403D] hover:text-[#1B1B21]'
                }`}
                title={`Cambiar a etapa ${st}`}
              >
                Paso {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Tracking Status Card */}
      <div className="bg-gradient-to-br from-white via-[#FBF8FF] to-[#F5F2FB] rounded-3xl border border-[#E4BEBA]/40 p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Status Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADDFF] text-[#3A008B] font-extrabold text-[12px]">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                {orderStage === 5 ? 'Entregado con éxito' : `Llega en aprox. ${estimatedMinutes}`}
              </span>
              <span className="text-[#5B403D] text-[13px] font-bold">
                Pedido <span className="text-[#A20513]">#{orderNumber}</span>
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[34px] font-black text-[#1B1B21] tracking-tight leading-tight">
              {orderStage === 1 && '¡Hemos recibido tu pedido!'}
              {orderStage === 2 && '¡Tus tequeños están en la freidora!'}
              {orderStage === 3 && 'Empacando en caja anti-humedad...'}
              {orderStage === 4 && '¡Tu pedido va en camino a toda máquina!'}
              {orderStage === 5 && '¡Pedido entregado! ¡Buen provecho!'}
            </h1>

            <p className="text-[14px] sm:text-[15px] text-[#5B403D] leading-relaxed">
              {orderStage === 1 &&
                'El pago se procesó de forma segura con Culqi. Nuestro maestro freidor ya tiene la comanda en pantalla para iniciar la fritura exacta.'}
              {orderStage === 2 &&
                'La masa wantán se sumerge en aceite limpio y a 180°C. Cero recalentados: crujiente, doradita y con queso fundente garantizado.'}
              {orderStage === 3 &&
                'Colocamos tus piqueos en la caja con respiraderos especiales junto a tus potes de salsas frías para mantener el calor sin ablandar la masa.'}
              {orderStage === 4 &&
                (fulfillmentMode === 'delivery'
                  ? `Carlos ya salió en moto desde nuestra cocina en Calle Moore 296 rumbo a ${deliveryAddress}.`
                  : 'Tu pedido está listo y empaquetado en nuestra Dark Kitchen (Calle Moore 296). ¡Puedes pasar a recogerlo!')}
              {orderStage === 5 &&
                'Esperamos que disfrutes tus tequeños crujientes con guacamole y salsas de la casa. ¡Gracias por confiar en Piqueos San Miguel!'}
            </p>

            {/* Quick WhatsApp Support */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/51906591037?text=Hola%20Piqueos%20San%20Miguel,%20consulto%20por%20mi%20pedido%20%23${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full font-bold text-[13px] shadow-xs active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Consultar por WhatsApp (+51 906 591 037)
              </a>

              {orderStage < 5 && (
                <button
                  onClick={() => setOrderStage(Math.min(5, orderStage + 1) as OrderStage)}
                  className="bg-[#A20513] hover:bg-[#C62828] text-white px-4 py-2.5 rounded-full font-bold text-[13px] shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">fast_forward</span>
                  Avanzar Simulación
                </button>
              )}
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
                      Paso {orderStage} de 5
                    </span>
                    <span className="text-[14px] font-extrabold text-[#1B1B21]">
                      {currentStageInfo.title}
                    </span>
                  </div>
                </div>
                <span className="text-[14px] font-black text-[#6C45C0]">
                  S/ {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visual Timeline & Stepper */}
      <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 sm:p-8 shadow-xs">
        <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1B1B21] mb-6 flex items-center gap-2">
          <span className="w-2.5 h-6 rounded-full bg-[#A20513] inline-block"></span>
          Línea de Tiempo del Pedido
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
                  onClick={() => setOrderStage(s.stage)}
                  className={`flex md:flex-col items-center md:text-center gap-4 md:gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F5F2FB] border border-[#6C45C0]/40 shadow-xs'
                      : 'hover:bg-gray-50'
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
                    <span className="text-[11px] font-bold text-[#8F706C]">{s.time}</span>
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

      {/* Map Simulation & Driver Profile Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Simulated Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4BEBA]/30 p-5 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/20 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#A20513]">navigation</span>
              <h3 className="text-[16px] font-bold text-[#1B1B21]">Ruta en Vivo en San Miguel</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              GPS Activo
            </span>
          </div>

          {/* Simulated Map Canvas */}
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden map-pattern border border-[#E4BEBA]/40 flex items-center justify-center">
            {/* Street Grid Graphic Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="50" x2="400" y2="80" stroke="#6C45C0" strokeWidth="6" strokeDasharray="6,4" />
              <line x1="100" y1="200" x2="350" y2="120" stroke="#A20513" strokeWidth="8" />
              <line x1="50" y1="240" x2="320" y2="240" stroke="#BA1A1A" strokeWidth="3" />
            </svg>

            {/* Street labels */}
            <div className="absolute top-4 left-6 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#5B403D] border border-[#E4BEBA]/30 shadow-2xs">
              Av. La Paz
            </div>
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#5B403D] border border-[#E4BEBA]/30 shadow-2xs">
              Costanera / Bertolotto
            </div>

            {/* Kitchen Origin Pin */}
            <div className="absolute top-12 left-10 flex flex-col items-center">
              <div className="bg-[#A20513] text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
              </div>
              <span className="bg-white/95 text-[10px] font-extrabold text-[#1B1B21] px-2 py-0.5 rounded shadow-xs mt-1 border border-[#E4BEBA]/40">
                Dark Kitchen (Calle Moore 296)
              </span>
            </div>

            {/* Delivery Destination Pin */}
            <div className="absolute bottom-10 right-10 flex flex-col items-center">
              <div className="bg-emerald-600 text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </div>
              <span className="bg-white/95 text-[10px] font-extrabold text-[#1B1B21] px-2 py-0.5 rounded shadow-xs mt-1 border border-[#E4BEBA]/40">
                Tu Entrega
              </span>
            </div>

            {/* Moving Driver Marker based on Stage */}
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
                {orderStage < 4 ? 'En Cocina' : orderStage === 4 ? 'Motorizado Carlos' : '¡En Puerta!'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-[12px] text-[#5B403D]">
            <span>
              <strong>Destino:</strong> {fulfillmentMode === 'delivery' ? deliveryAddress : 'Recojo en Calle Moore 296'}
            </span>
            <span className="text-[#A20513] font-bold">San Miguel, Lima</span>
          </div>
        </div>

        {/* Driver Profile Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/20">
              <h3 className="text-[16px] font-bold text-[#1B1B21]">Tu Repartidor Asignado</h3>
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
              <span className="text-[#5B403D]">Mochila Térmica San Miguel:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Aislamiento Térmico OK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href="https://wa.me/51906591037?text=Hola%20Carlos,%20soy%20el%20cliente%20del%20pedido%20Piqueos%20San%20Miguel"
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

          {/* Order Summary Recap Card */}
          <div className="bg-white rounded-3xl border border-[#E4BEBA]/30 p-6 shadow-xs flex flex-col gap-3">
            <h3 className="text-[15px] font-bold text-[#1B1B21] pb-2 border-b border-[#E4BEBA]/20 flex items-center justify-between">
              <span>Resumen de Productos</span>
              <span className="text-[#A20513] font-extrabold">{cartItems.length} ítems</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto custom-scroll pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-[12px] text-[#5B403D]">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold text-[#1B1B21]">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E4BEBA]/20 flex justify-between items-baseline font-bold text-[14px]">
              <span className="text-[#1B1B21]">Total Abonado (Culqi):</span>
              <span className="text-[18px] font-black text-[#A20513]">
                S/ {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
