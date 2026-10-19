import React from 'react';
import { StoreConfig } from '../types';
import {
  DEFAULT_WEEKLY_SCHEDULE,
  formatDateSpanish,
  formatTime12h,
  getStoreStatusInfo,
} from '../utils/scheduleUtils';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeConfig: StoreConfig;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  storeConfig,
}) => {
  if (!isOpen) return null;

  const status = getStoreStatusInfo(storeConfig);
  const weekly = storeConfig.weeklySchedule && storeConfig.weeklySchedule.length === 7
    ? storeConfig.weeklySchedule
    : DEFAULT_WEEKLY_SCHEDULE;

  // Ordenar de Lunes (1) a Domingo (0)
  const sortedDays = [...weekly].sort((a, b) => {
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  const todayDayOfWeek = new Date().getDay();
  const specialDates = storeConfig.specialDates || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7FD] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E4BEBA]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A20513] to-[#7A030D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            </div>
            <div>
              <h2 className="text-[17px] font-black tracking-tight">Horario de Atención</h2>
              <p className="text-[11px] text-white/80">Piqueos San Miguel · Dark Kitchen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Live Status Badge */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              status.isOpen
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    status.isOpen ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                    status.isOpen ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                ></span>
              </span>
              <div>
                <span className="font-extrabold text-[13px] block">
                  {status.statusBadge}
                </span>
                <span className="text-[11px] font-medium opacity-90">
                  {status.statusDetail}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 shadow-2xs">
              En Tiempo Real
            </span>
          </div>

          {/* Weekly Days Table */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#A20513]">schedule</span>
              Horarios Programados por Día
            </h3>

            <div className="bg-white rounded-2xl border border-[#E4BEBA]/40 divide-y divide-[#E4BEBA]/20 overflow-hidden shadow-2xs">
              {sortedDays.map((day) => {
                const isToday = day.dayOfWeek === todayDayOfWeek;
                return (
                  <div
                    key={day.dayOfWeek}
                    className={`p-3 flex items-center justify-between text-[12px] transition-colors ${
                      isToday ? 'bg-[#FFE9E6]/60 font-semibold' : 'hover:bg-[#F5F2FB]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-20 font-bold text-[#1B1B21]">{day.dayName}</span>
                      {isToday && (
                        <span className="bg-[#A20513] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                          HOY
                        </span>
                      )}
                    </div>

                    <div>
                      {day.isOpen ? (
                        <span className="text-[#5B403D] font-bold">
                          {formatTime12h(day.openTime)} - {formatTime12h(day.closeTime)}
                        </span>
                      ) : (
                        <span className="text-red-700 bg-red-50 text-[11px] font-bold px-2 py-0.5 rounded-md border border-red-200">
                          Cerrado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Dates / Holidays */}
          {specialDates.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#6C45C0]">event_available</span>
                Fechas Especiales y Feriados
              </h3>

              <div className="bg-white rounded-2xl border border-[#E4BEBA]/40 p-3 divide-y divide-[#E4BEBA]/20 flex flex-col gap-2">
                {specialDates.map((sd) => (
                  <div key={sd.id} className="pt-2 first:pt-0 flex items-center justify-between text-[12px]">
                    <div>
                      <span className="font-bold text-[#1B1B21] block">
                        {formatDateSpanish(sd.date)}
                      </span>
                      <span className="text-[11px] text-[#5B403D]">{sd.note}</span>
                    </div>
                    <div>
                      {sd.isClosed ? (
                        <span className="text-red-700 bg-red-100 text-[10px] font-extrabold px-2 py-1 rounded-full">
                          Cerrado todo el día
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-100 text-[10px] font-extrabold px-2 py-1 rounded-full">
                          {formatTime12h(sd.openTime || '')} - {formatTime12h(sd.closeTime || '')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Note */}
          <div className="bg-[#F5F2FB] p-3.5 rounded-2xl border border-[#E4BEBA]/30 text-[11px] text-[#5B403D] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#A20513] shrink-0 mt-0.5">info</span>
            <p>
              Hacemos entregas a través de repartidores propios y aplicativos en San Miguel, Magdalena, Pueblo Libre y alrededores. Si realizas un pedido fuera de horario, será procesado al momento de la apertura.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-[#E4BEBA]/30 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1B1B21] hover:bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold cursor-pointer transition-colors"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
