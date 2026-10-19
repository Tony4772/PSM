import React from 'react';
import { StoreConfig } from '../types';

interface DarkKitchenSectionProps {
  storeConfig?: StoreConfig;
}

export const DarkKitchenSection: React.FC<DarkKitchenSectionProps> = ({ storeConfig }) => {
  const address = storeConfig?.address || 'Jr. Comandante Juan Guillermo Moore 296, San Miguel, Lima';
  const addressRef = storeConfig?.addressRef || 'Altura Cdra 2 de Av. La Paz';
  const mapsUrl = storeConfig?.mapsUrl || 'https://maps.google.com/?q=Comandante+Guillermo+Moore+296,+San+Miguel,+Lima';

  return (
    <section className="bg-[#F5F2FB] py-14 sm:py-16 border-t border-[#E4BEBA]/30" id="nosotros">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <span className="text-[#6C45C0] font-bold text-[13px] uppercase tracking-wider block">
            Operación Dark Kitchen San Miguel
          </span>
          <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#1B1B21] mt-1 leading-tight">
            El Sabor a Otro Nivel, Diseñado Para Delivery
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#5B403D] mt-2 leading-relaxed">
            No somos un restaurante convencional con salón; somos una cocina de producción
            hiper-especializada dedicada 100% a que tus piqueos lleguen crujientes, calientes y sin
            demoras.
          </p>
        </div>

        {/* 3 Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Feature 1 */}
          <div className="bg-white p-6 rounded-3xl border border-[#E4BEBA]/30 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFDAD6] text-[#A20513] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">skillet</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1B1B21]">Fritura al Minuto</h3>
              <p className="text-[13px] text-[#5B403D] mt-1.5 leading-relaxed">
                Nunca freímos con anticipación. El aceite vegetal de alta temperatura recibe los
                tequeños únicamente cuando el repartidor o tú están a 7 minutos de llegar.
              </p>
            </div>
          </div>

          {/* Bento Feature 2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#E4BEBA]/30 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EADDFF] text-[#6C45C0] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">inventory_2</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1B1B21]">Empaque Anti-Humedad</h3>
              <p className="text-[13px] text-[#5B403D] mt-1.5 leading-relaxed">
                Nuestras cajas cuentan con micro-respiraderos diseñados para que el vapor escape sin
                humedecer la masa wantán, conservando el crunch hasta tu casa.
              </p>
            </div>
          </div>

          {/* Bento Feature 3 */}
          <div className="bg-white p-6 rounded-3xl border border-[#E4BEBA]/30 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFDDB8] text-[#714600] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">map</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1B1B21]">Zonas de Cobertura</h3>
              <p className="text-[13px] text-[#5B403D] mt-1.5 leading-relaxed">
                Delivery ágil en San Miguel, Magdalena del Mar, Pueblo Libre, Jesús María, Bellavista
                y La Perla. O retira directo sin costo en {address}.
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps Location Callout Card */}
        <div className="mt-8 bg-white rounded-3xl border border-[#E4BEBA]/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#A20513] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[32px]">pin_drop</span>
            </div>
            <div>
              <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1B1B21]">
                ¿Deseas recoger tu pedido en nuestra Dark Kitchen?
              </h4>
              <p className="text-[13px] text-[#5B403D] mt-0.5">
                {address} (Ref. {addressRef}).
              </p>
            </div>
          </div>

          <a
            className="shrink-0 bg-[#EAE7EF] hover:bg-[#E4E1EA] text-[#1B1B21] font-bold text-[13px] px-5 py-3 rounded-full border border-[#E4BEBA]/40 flex items-center gap-2 transition-colors active:scale-95"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[19px]">navigation</span>
            Ver en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};
