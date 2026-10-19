import React from 'react';
import { ASSETS } from '../data/menuData';
import { FulfillmentMode, StoreConfig } from '../types';

interface NavbarProps {
  fulfillmentMode: FulfillmentMode;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentView: 'menu' | 'tracking';
  setCurrentView: (view: 'menu' | 'tracking') => void;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
  storeConfig?: StoreConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  fulfillmentMode,
  setFulfillmentMode,
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateSection,
  currentView,
  setCurrentView,
  isAdminAuthenticated,
  onOpenAdmin,
  storeConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-[#E4BEBA]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo / Emblem */}
        <button
          onClick={() => setCurrentView('menu')}
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <img
            src={ASSETS.emblem}
            alt="Piqueos San Miguel Emblema"
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-[18px] sm:text-[20px] font-extrabold text-[#A20513] tracking-tight leading-tight">
              Piqueos San Miguel
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold text-[#6C45C0] tracking-wider -mt-0.5 italic">
              El sabor a otro nivel
            </span>
          </div>
        </button>

        {/* Desktop Fulfillment Switcher */}
        <div className="hidden md:flex items-center bg-[#F5F2FB] p-1 rounded-full border border-[#E4BEBA]/30">
          <button
            onClick={() => setFulfillmentMode('delivery')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              fulfillmentMode === 'delivery'
                ? 'bg-[#A20513] text-white shadow-xs'
                : 'text-[#5B403D] hover:text-[#A20513]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">moped</span>
            Delivery a Domicilio
          </button>
          <button
            onClick={() => setFulfillmentMode('pickup')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              fulfillmentMode === 'pickup'
                ? 'bg-[#A20513] text-white shadow-xs'
                : 'text-[#5B403D] hover:text-[#A20513]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">storefront</span>
            Recojo en Local (San Miguel)
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => {
              setCurrentView('menu');
              onNavigateSection('carta');
            }}
            className={`font-bold pb-0.5 text-[14px] transition-colors cursor-pointer ${
              currentView === 'menu'
                ? 'text-[#A20513] border-b-2 border-[#A20513]'
                : 'text-[#5B403D] hover:text-[#A20513]'
            }`}
          >
            Carta
          </button>
          <button
            onClick={() => {
              setCurrentView('menu');
              onNavigateSection('combos');
            }}
            className="text-[#5B403D] hover:text-[#A20513] transition-colors font-medium text-[14px] cursor-pointer"
          >
            Combos
          </button>
          <button
            onClick={() => {
              setCurrentView('menu');
              onNavigateSection('salsas');
            }}
            className="text-[#5B403D] hover:text-[#A20513] transition-colors font-medium text-[14px] cursor-pointer"
          >
            Salsas
          </button>
          <button
            onClick={() => {
              setCurrentView('menu');
              onNavigateSection('nosotros');
            }}
            className="text-[#5B403D] hover:text-[#A20513] transition-colors font-medium text-[14px] cursor-pointer"
          >
            Nosotros
          </button>

          {/* Only shown to owner if authenticated */}
          {isAdminAuthenticated && (
            <button
              onClick={onOpenAdmin}
              className="text-[#A20513] hover:text-[#C62828] transition-colors font-bold text-[13px] flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full border border-red-200"
              title="Panel del Dueño"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Admin
            </button>
          )}
        </nav>

        {/* Action Cluster: WhatsApp & Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/${storeConfig?.whatsappPhone || '51906591037'}?text=Hola%20Piqueos%20San%20Miguel,%20deseo%20hacer%20un%20pedido%20de%20teque%C3%B1os`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-bold text-[12px] sm:text-[13px] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="hidden md:inline">Pedir por WhatsApp</span>
            <span className="md:hidden">WhatsApp</span>
          </a>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-[#A20513] hover:bg-[#C62828] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-bold text-[13px] shadow-sm active:scale-95 transition-all cursor-pointer"
            aria-label="Ver Carrito de Compras"
          >
            <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
            <span>Carrito ({cartCount})</span>
            <span className="bg-[#6C45C0] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-0.5">
              S/ {cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
