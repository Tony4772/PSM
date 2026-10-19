import React from 'react';
import { MenuItem, StoreConfig } from '../types';
import { getStoreStatusInfo } from '../utils/scheduleUtils';

interface HeroBannerProps {
  storeConfig: StoreConfig;
  onScrollToMenu: () => void;
  onQuickOrder: () => void;
  onAddSuperBox: () => void;
  featuredItem?: MenuItem;
  onOpenSchedule?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  storeConfig,
  onScrollToMenu,
  onQuickOrder,
  onAddSuperBox,
  featuredItem,
  onOpenSchedule,
}) => {
  const status = getStoreStatusInfo(storeConfig);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FBF8FF] via-[#F5F2FB] to-[#EAE7EF] py-10 lg:py-14 border-b border-[#E4BEBA]/30">
      {/* Ambient Lighting Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A20513]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#6C45C0]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Status Pill with Schedule Click */}
            <button
              type="button"
              onClick={onOpenSchedule}
              className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4BEBA]/40 shadow-xs w-fit hover:border-[#A20513]/40 cursor-pointer transition-all text-left group"
              title="Haz clic para ver horarios detallados y feriados"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    status.isOpen ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    status.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
              </span>
              <span className="text-[13px] font-bold text-[#1B1B21]">
                {status.statusBadge}
              </span>
              <span className="text-[#E4BEBA]">·</span>
              <span className="text-[12px] text-[#A20513] font-semibold">
                {status.statusDetail}
              </span>
              <span className="text-[#E4BEBA] hidden sm:inline">·</span>
              <span className="text-[12px] text-[#5B403D] hidden sm:flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#925C00]">timer</span>
                {storeConfig.deliveryTimeEstimate}
              </span>
            </button>

            {/* Main Punchy Title */}
            <h1 className="text-[28px] sm:text-[38px] lg:text-[46px] font-extrabold text-[#1B1B21] tracking-tight leading-[1.15]">
              {storeConfig.heroTitle}{' '}
              <span className="text-[#A20513] underline decoration-[#6C45C0] decoration-wavy decoration-2">
                {storeConfig.heroHighlight}
              </span>{' '}
              de Lima, Recién Fritos a Tu Puerta
            </h1>

            <p className="text-[15px] sm:text-[16px] text-[#5B403D] max-w-2xl leading-relaxed font-normal">
              {storeConfig.heroDescription}
            </p>

            {/* Action Buttons CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToMenu}
                className="bg-[#A20513] hover:bg-[#C62828] text-white px-5 sm:px-6 py-3 rounded-full font-bold text-[14px] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                Ver Carta de Tequeños
              </button>
              <button
                onClick={onQuickOrder}
                className="bg-white hover:bg-[#F5F2FB] border border-[#8F706C]/40 text-[#A20513] px-5 sm:px-6 py-3 rounded-full font-bold text-[14px] shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                Hacer Pedido Rápido
              </button>
            </div>

            {/* Value Chips Horizontal Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E4BEBA]/30">
              <div className="flex items-center gap-2.5 bg-white/80 p-2.5 rounded-xl border border-[#E4BEBA]/30 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FFDAD6] flex items-center justify-center text-[#A20513] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">skillet</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1B1B21]">Masa Artesanal</h4>
                  <p className="text-[11px] text-[#5B403D]">Fritura crocante dorada</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 p-2.5 rounded-xl border border-[#E4BEBA]/30 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#EADDFF] flex items-center justify-center text-[#6C45C0] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1B1B21]">Salsas Gratis</h4>
                  <p className="text-[11px] text-[#5B403D]">Guacamole + Ají casero</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 p-2.5 rounded-xl border border-[#E4BEBA]/30 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FFDDB8] flex items-center justify-center text-[#714600] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1B1B21]">Yape & Plin</h4>
                  <p className="text-[11px] text-[#5B403D]">100% Pago Seguro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Bento Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <img
                src={storeConfig.heroImage}
                alt="Tequeños Dorados Crocantes Piqueos San Miguel"
                className="w-full h-80 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Crispy Badge */}
              <div className="absolute top-4 right-4 bg-[#A20513] text-white font-extrabold text-[12px] px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                ¡Recién Fritos!
              </div>

              {/* Floating Special Offer Tag */}
              {featuredItem && (
                <div
                  onClick={onAddSuperBox}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E4BEBA]/40 flex items-center justify-between shadow-lg cursor-pointer hover:bg-white active:scale-98 transition-all"
                  title={`Hacer clic para agregar ${featuredItem.name} al pedido`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6C45C0] text-white flex items-center justify-center font-bold shrink-0">
                      <span className="material-symbols-outlined text-[22px]">stars</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#6C45C0] block uppercase tracking-wide">
                        {featuredItem.badge || 'Recomendado'}
                      </span>
                      <span className="text-[15px] sm:text-[16px] font-extrabold text-[#1B1B21] block truncate max-w-[180px]">
                        {featuredItem.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[20px] font-extrabold text-[#A20513] leading-none">
                      S/ {featuredItem.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
