import React, { useState } from 'react';
import { ASSETS, MENU_ITEMS } from '../data/menuData';
import { MenuItem, PortionOption } from '../types';

interface MenuCatalogProps {
  onAddToCart: (
    item: MenuItem,
    selectedPortion?: PortionOption,
    customNote?: string
  ) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ onAddToCart }) => {
  // Store selected portion index for each item id with multiple portions
  const [selectedPortions, setSelectedPortions] = useState<Record<string, number>>({
    'tequenos-queso': 0,
    'tequenos-lomo-saltado': 0,
    'tequenos-aji-gallina': 0,
    'tequenos-pollo-brasa': 0,
  });

  const handleSelectPortion = (itemId: string, index: number) => {
    setSelectedPortions((prev) => ({ ...prev, [itemId]: index }));
  };

  const getActivePortion = (item: MenuItem): PortionOption | undefined => {
    if (!item.portions || item.portions.length === 0) return undefined;
    const index = selectedPortions[item.id] ?? 0;
    return item.portions[index] || item.portions[0];
  };

  const getDisplayPrice = (item: MenuItem): number => {
    const activePortion = getActivePortion(item);
    return activePortion ? activePortion.price : item.price;
  };

  const tradicionales = MENU_ITEMS.filter((i) => i.category === 'tradicionales');
  const especiales = MENU_ITEMS.filter((i) => i.category === 'especiales');
  const superBox = MENU_ITEMS.find((i) => i.id === 'super-box-50')!;
  const salsas = MENU_ITEMS.filter((i) => i.category === 'salsas');
  const bebidas = MENU_ITEMS.filter((i) => i.category === 'bebidas');

  return (
    <div className="flex flex-col gap-10 sm:gap-12" id="carta">
      {/* 1. CATEGORY: TEQUEÑOS TRADICIONALES */}
      <section className="scroll-mt-36" id="tradicionales">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#1B1B21] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#A20513] inline-block"></span>
              Tequeños Tradicionales
            </h2>
            <p className="text-[14px] text-[#5B403D]">
              El clásico insuperable con masa extra fina y queso andino fundente.
            </p>
          </div>
          <span className="text-[11px] font-bold bg-[#FFDAD6] text-[#93000E] px-2.5 py-1 rounded-full whitespace-nowrap">
            Top Ventas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tradicionales.map((item) => {
            const activePortion = getActivePortion(item);
            const currentPrice = getDisplayPrice(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E4BEBA]/30 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative h-44 overflow-hidden bg-[#F5F2FB]">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {item.badge && (
                    <span
                      className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                        item.badgeType === 'secondary'
                          ? 'bg-[#6C45C0] text-white'
                          : 'bg-[#FFDDB8] text-[#2A1700]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1B1B21]">{item.name}</h3>
                    <p className="text-[13px] text-[#5B403D] line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Portion Selection */}
                  {item.portions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.portions.map((portion, idx) => {
                        const isSelected = (selectedPortions[item.id] ?? 0) === idx;
                        return (
                          <button
                            key={portion.label}
                            type="button"
                            onClick={() => handleSelectPortion(item.id, idx)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? 'border border-[#A20513] bg-[#FFDAD6] text-[#A20513]'
                                : 'border border-[#E4BEBA]/40 bg-[#F5F2FB] text-[#1B1B21] hover:border-[#A20513]'
                            }`}
                          >
                            {portion.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Mixtos bullet */}
                  {item.id === 'tequenos-mixtos' && (
                    <div className="flex items-center gap-1.5 pt-1 text-[12px] font-semibold text-[#5B403D]">
                      <span className="material-symbols-outlined text-[17px] text-[#714600]">
                        check_circle
                      </span>
                      24 Unidades en total + 2 Cremas
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E4BEBA]/20">
                    <div>
                      <span className="text-[11px] text-[#5B403D] block font-medium">
                        {item.unitLabel || 'Precio'}
                      </span>
                      <span className="text-[20px] font-extrabold text-[#A20513]">
                        S/ {currentPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(item, activePortion)}
                      className="bg-[#A20513] hover:bg-[#C62828] text-white px-4 py-2 rounded-full font-bold text-[13px] shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. CATEGORY: TEQUEÑOS ESPECIALES & FUSIÓN */}
      <section className="scroll-mt-36" id="especiales">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#1B1B21] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#6C45C0] inline-block"></span>
              Tequeños Especiales & Fusión
            </h2>
            <p className="text-[14px] text-[#5B403D]">
              Rellenos con los platos bandera de la gastronomía criolla limeña.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {especiales.map((item) => {
            const activePortion = getActivePortion(item);
            const currentPrice = getDisplayPrice(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E4BEBA]/30 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative h-40 overflow-hidden bg-[#F5F2FB]">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {item.badge && (
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        item.badgeType === 'primary'
                          ? 'bg-[#A20513] text-white'
                          : item.badgeType === 'tertiary'
                          ? 'bg-[#925C00] text-[#FFE3C6]'
                          : 'bg-[#A67FFD] text-[#3A008B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex flex-col flex-grow justify-between gap-2.5">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1B1B21]">{item.name}</h3>
                    <p className="text-[12px] text-[#5B403D] line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Portion buttons */}
                  {item.portions && (
                    <div className="flex gap-1.5">
                      {item.portions.map((portion, idx) => {
                        const isSelected = (selectedPortions[item.id] ?? 0) === idx;
                        return (
                          <button
                            key={portion.label}
                            type="button"
                            onClick={() => handleSelectPortion(item.id, idx)}
                            className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#EAE7EF] text-[#1B1B21] border border-[#6C45C0]'
                                : 'bg-[#F5F2FB] text-[#5B403D] hover:text-[#1B1B21]'
                            }`}
                          >
                            {portion.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E4BEBA]/20">
                    <div>
                      <span className="text-[11px] text-[#5B403D] block">
                        {activePortion ? `${activePortion.units} Unid` : '12 Unid'}
                      </span>
                      <span className="text-[17px] font-extrabold text-[#A20513]">
                        S/ {currentPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(item, activePortion)}
                      className="bg-[#A20513] hover:bg-[#C62828] text-white p-2 rounded-full font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                      title="Agregar al carrito"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CATEGORY: MEGA BOXES & COMBOS FIESTA */}
      <section className="scroll-mt-36" id="combos">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#1B1B21] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#925C00] inline-block"></span>
              Mega Boxes & Combos Fiesta
            </h2>
            <p className="text-[14px] text-[#5B403D]">
              Diseñados para fútbol, previas, reuniones de oficina y cumpleaños.
            </p>
          </div>
        </div>

        {/* Big Bento Promo Box Card */}
        <div className="bg-gradient-to-r from-white to-[#F5F2FB] rounded-3xl border-2 border-[#A20513]/25 p-5 sm:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#A20513] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Caja Gigante
                </span>
                <span className="text-[#6C45C0] font-bold text-[13px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  Para 6 a 8 personas
                </span>
              </div>

              <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#1B1B21]">
                {superBox.name}
              </h3>

              <p className="text-[14px] text-[#5B403D] leading-relaxed">
                La combinación estelar de la casa:{' '}
                <strong className="text-[#1B1B21]">25 Tequeños de Queso</strong> +{' '}
                <strong className="text-[#1B1B21]">15 de Lomo Saltado</strong> +{' '}
                <strong className="text-[#1B1B21]">10 de Pollo a la Brasa</strong>. Viene acompañado
                de 3 salsas grandes a elección en potes de 4oz.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] text-[#5B403D] font-medium">
                <span className="bg-[#EAE7EF] px-2.5 py-1 rounded-full">✓ Guacamole grande</span>
                <span className="bg-[#EAE7EF] px-2.5 py-1 rounded-full">✓ Huancaína casera</span>
                <span className="bg-[#EAE7EF] px-2.5 py-1 rounded-full">✓ Ají pollero secreto</span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-[12px] line-through text-[#8F706C]">Normal: S/ 92.00</span>
                  <span className="text-[22px] font-black text-[#A20513]">S/ 79.90</span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(superBox)}
                  className="bg-[#A20513] hover:bg-[#C62828] text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-[14px] shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Agregar Super Box
                </button>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E4BEBA]/30 bg-white">
                <img
                  src={ASSETS.superBoxPromo}
                  alt="Super Box 50 Tequeños"
                  className="w-full h-56 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-[#303036]/80 text-[#F2EFF8] text-[11px] font-bold px-2.5 py-0.5 rounded backdrop-blur-xs">
                  50 Tequeños Surtidos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY: SALSAS ARTESANALES & CREMAS */}
      <section className="scroll-mt-36" id="salsas">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#1B1B21] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#C62828] inline-block"></span>
              Salsas Artesanales & Cremas Extra
            </h2>
            <p className="text-[14px] text-[#5B403D]">
              Todas preparadas a diario en nuestra Dark Kitchen con insumos 100% frescos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {salsas.map((salsa) => {
            const icons = {
              'salsa-guacamole': { icon: 'eco', bg: 'bg-emerald-100 text-emerald-700' },
              'salsa-huancaina': { icon: 'bolt', bg: 'bg-amber-100 text-amber-800' },
              'salsa-aji-pollero': { icon: 'local_fire_department', bg: 'bg-red-100 text-red-800' },
              'salsa-rocoto': { icon: 'spa', bg: 'bg-purple-100 text-purple-800' },
            }[salsa.id] || { icon: 'soup_kitchen', bg: 'bg-emerald-100 text-emerald-700' };

            return (
              <div
                key={salsa.id}
                className="bg-white p-3.5 rounded-xl border border-[#E4BEBA]/30 text-center flex flex-col items-center justify-between gap-2 shadow-xs hover:shadow-sm transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full ${icons.bg} flex items-center justify-center font-bold`}
                >
                  <span className="material-symbols-outlined text-[24px]">{icons.icon}</span>
                </div>

                <div>
                  <h4 className="text-[14px] font-bold text-[#1B1B21]">{salsa.name}</h4>
                  <p className="text-[11px] text-[#5B403D] mt-0.5">{salsa.description}</p>
                </div>

                <div className="w-full flex items-center justify-between pt-1 border-t border-[#E4BEBA]/20">
                  <span className="text-[15px] font-extrabold text-[#A20513]">
                    S/ {salsa.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(salsa)}
                    className="text-[#A20513] hover:bg-[#A20513]/10 p-1 rounded-full cursor-pointer transition-colors"
                    title={`Agregar ${salsa.name}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">add_circle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CATEGORY: BEBIDAS HELADAS */}
      <section className="scroll-mt-36" id="bebidas">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#1B1B21] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#6C45C0] inline-block"></span>
              Bebidas Heladas
            </h2>
            <p className="text-[14px] text-[#5B403D]">
              Refrescos artesanales y gaseosas peruanas bien heladas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bebidas.map((bebida) => (
            <div
              key={bebida.id}
              className="bg-white p-4 rounded-2xl border border-[#E4BEBA]/30 flex items-center justify-between shadow-xs hover:shadow-sm transition-all"
            >
              <div>
                <h4 className="text-[15px] font-bold text-[#1B1B21]">{bebida.name}</h4>
                <p className="text-[12px] text-[#5B403D] mt-0.5">{bebida.description}</p>
                <span className="text-[16px] font-extrabold text-[#A20513] mt-1 block">
                  S/ {bebida.price.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(bebida)}
                className="bg-[#F5F2FB] hover:bg-[#A20513] hover:text-white text-[#1B1B21] p-2.5 rounded-full transition-colors cursor-pointer"
                title={`Agregar ${bebida.name}`}
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
