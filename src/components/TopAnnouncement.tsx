import React from 'react';
import { StoreConfig } from '../types';
import { getStoreStatusInfo } from '../utils/scheduleUtils';

interface TopAnnouncementProps {
  currentView: 'menu' | 'tracking';
  setCurrentView: (view: 'menu' | 'tracking') => void;
  orderNumber: string;
  hasActiveOrder: boolean;
  storeConfig: StoreConfig;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
  onOpenSchedule?: () => void;
}

export const TopAnnouncement: React.FC<TopAnnouncementProps> = ({
  currentView,
  setCurrentView,
  orderNumber,
  hasActiveOrder,
  storeConfig,
  isAdminAuthenticated,
  onOpenAdmin,
  onOpenSchedule,
}) => {
  const statusInfo = getStoreStatusInfo(storeConfig);

  return (
    <div className="bg-[#F5F2FB] border-b border-[#E4BEBA]/30 py-2 px-4 text-[12px] text-[#1B1B21]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Dark Kitchen Live address & Status */}
        <div className="flex items-center gap-2 text-[#5B403D]">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              statusInfo.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`}
          ></span>
          <span className="font-bold text-[#1B1B21]">Dark Kitchen San Miguel:</span>
          <span className="hidden sm:inline font-medium text-[#5B403D]">
            {storeConfig.address}
          </span>
          <span className="sm:hidden font-medium text-[#5B403D]">
            Calle Moore 296, San Miguel
          </span>
          <span className="text-gray-300">|</span>
          <span
            className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
              statusInfo.isOpen
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {statusInfo.statusBadge}
          </span>
        </div>

        {/* Schedule & WhatsApp */}
        <div className="hidden lg:flex items-center gap-3 text-[#5B403D] font-semibold text-[11px] ml-auto">
          {onOpenSchedule ? (
            <button
              onClick={onOpenSchedule}
              className="flex items-center gap-1 text-[#A20513] hover:text-[#7A030D] font-bold cursor-pointer transition-colors group"
              title="Click para ver el horario semanal completo y feriados"
            >
              <span className="material-symbols-outlined text-[15px] group-hover:scale-110 transition-transform">
                calendar_month
              </span>
              <span>{statusInfo.todayScheduleText || storeConfig.scheduleText}</span>
              <span className="text-[10px] text-gray-500 underline ml-0.5 font-normal">
                (Ver calendario)
              </span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[#A20513] font-bold">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              Horario: {storeConfig.scheduleText}
            </span>
          )}

          <span className="text-[#E4BEBA]">|</span>
          <a
            className="hover:text-[#A20513] transition-colors flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full"
            href={`https://wa.me/${storeConfig.whatsappPhone}?text=Hola%20Piqueos%20San%20Miguel,%20deseo%20hacer%20una%20consulta`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-emerald-700 font-extrabold">WhatsApp:</span>{' '}
            {storeConfig.whatsappDisplay}
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {/* Botón ver horarios en móvil */}
          {onOpenSchedule && (
            <button
              onClick={onOpenSchedule}
              className="lg:hidden px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#A20513] border border-[#E4BEBA]/40 flex items-center gap-1 cursor-pointer"
              title="Ver horarios de atención"
            >
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              <span>Horarios</span>
            </button>
          )}

          {hasActiveOrder && (
            <button
              onClick={() => setCurrentView('tracking')}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'tracking'
                  ? 'bg-[#6C45C0] text-white shadow-xs'
                  : 'bg-purple-100 text-[#3A008B] hover:bg-purple-200'
              }`}
              title="Ver seguimiento de tu pedido en curso"
            >
              <span className="material-symbols-outlined text-[15px]">moped</span>
              <span>Pedido #{orderNumber}</span>
            </button>
          )}

          {currentView === 'tracking' && (
            <button
              onClick={() => setCurrentView('menu')}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-[#A20513] hover:bg-gray-50 border border-[#E4BEBA]/40 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">restaurant_menu</span>
              Carta
            </button>
          )}

          {/* Only shown to owner if authenticated */}
          {isAdminAuthenticated && (
            <button
              onClick={onOpenAdmin}
              className="bg-[#A20513] hover:bg-[#C62828] text-white px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              title="Panel del Dueño Activo"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Panel Dueño</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
