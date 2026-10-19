import React from 'react';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const tabs = [
    { id: 'tradicionales', label: 'Tequeños Tradicionales', icon: 'lunch_dining' },
    { id: 'especiales', label: 'Tequeños Especiales & Fusión', icon: 'skillet' },
    { id: 'combos', label: 'Mega Boxes & Combos Fiesta', icon: 'celebration' },
    { id: 'salsas', label: 'Salsas Artesanales & Cremas', icon: 'soup_kitchen' },
    { id: 'bebidas', label: 'Bebidas Heladas', icon: 'local_bar' },
  ];

  return (
    <nav className="sticky top-[60px] sm:top-[69px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E4BEBA]/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 sm:py-3 no-scrollbar custom-scroll">
          {tabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full font-bold text-[12px] sm:text-[13px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6C45C0] text-white shadow-xs scale-100'
                    : 'bg-[#F5F2FB] hover:bg-[#EAE7EF] text-[#1B1B21] border border-[#E4BEBA]/30'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
