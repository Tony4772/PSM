import React from 'react';

interface TopAnnouncementProps {
  currentView: 'menu' | 'tracking';
  setCurrentView: (view: 'menu' | 'tracking') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  orderNumber: string;
}

export const TopAnnouncement: React.FC<TopAnnouncementProps> = ({
  currentView,
  setCurrentView,
  isMobileFrame,
  setIsMobileFrame,
  orderNumber,
}) => {
  return (
    <div className="bg-[#EAE7EF] border-b border-[#E4BEBA]/40 py-1.5 px-4 text-center select-none text-[12px] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Dark Kitchen Live address */}
        <div className="flex items-center gap-2 text-[#5B403D] mx-auto sm:mx-0">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-[#1B1B21]">Dark Kitchen San Miguel:</span>
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#A20513]">location_on</span>
            Comandante Guillermo Moore 296, San Miguel, Lima
          </span>
        </div>

        {/* Schedule & WhatsApp */}
        <div className="hidden sm:flex items-center gap-3 text-[#5B403D] font-semibold text-[11px] ml-auto">
          <span className="flex items-center gap-1 text-[#A20513] font-bold">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            Horario: Mar a Dom: 4:30 PM - 11:30 PM
          </span>
          <span className="text-[#E4BEBA]">|</span>
          <a
            className="hover:text-[#A20513] transition-colors flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full"
            href="https://wa.me/51906591037?text=Hola%20Piqueos%20San%20Miguel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-emerald-700 font-extrabold">WhatsApp:</span> +51 906 591 037
          </a>
        </div>

        {/* View Switcher Controls (Convenient preview tool for user) */}
        <div className="flex items-center gap-1.5 mx-auto lg:mx-0">
          <button
            onClick={() => setCurrentView('menu')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              currentView === 'menu'
                ? 'bg-[#A20513] text-white shadow-xs'
                : 'bg-white/80 text-[#5B403D] hover:bg-white'
            }`}
            title="Ver Carta Digital"
          >
            <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
            Carta
          </button>

          <button
            onClick={() => setCurrentView('tracking')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              currentView === 'tracking'
                ? 'bg-[#6C45C0] text-white shadow-xs'
                : 'bg-white/80 text-[#5B403D] hover:bg-white'
            }`}
            title="Ver Seguimiento en Vivo"
          >
            <span className="material-symbols-outlined text-[14px]">two_wheeler</span>
            Pedido #{orderNumber}
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border ${
              isMobileFrame
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white/80 text-[#5B403D] border-[#E4BEBA]/40 hover:bg-white'
            }`}
            title="Simular visualización en teléfono móvil como en la imagen de referencia"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            {isMobileFrame ? 'Vista Desktop' : 'Simular Móvil'}
          </button>
        </div>
      </div>
    </div>
  );
};
