import React, { useState, useRef } from 'react';
import { MenuItem, PortionOption, StoreConfig } from '../types';

interface AdminConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  menuItems: MenuItem[];
  onSaveMenuItems: (items: MenuItem[]) => void;
  storeConfig: StoreConfig;
  onSaveStoreConfig: (config: StoreConfig) => void;
  onResetToDefaults: () => void;
  currentPassword: string;
  onUpdatePassword: (newPw: string) => void;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  menuItems,
  onSaveMenuItems,
  storeConfig,
  onSaveStoreConfig,
  onResetToDefaults,
  currentPassword,
  onUpdatePassword,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'store' | 'hero' | 'backup' | 'security'>('products');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security / Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Form states for Product Edit/Create
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<MenuItem['category']>('tradicionales');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodUnitLabel, setProdUnitLabel] = useState('');
  const [prodBadge, setProdBadge] = useState('');
  const [prodBadgeType, setProdBadgeType] = useState<MenuItem['badgeType']>('primary');
  const [prodPortions, setProdPortions] = useState<PortionOption[]>([]);

  // Form states for Store Config
  const [localStoreConfig, setLocalStoreConfig] = useState<StoreConfig>(storeConfig);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startEditProduct = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreatingNew(false);
    setProdName(item.name);
    setProdCategory(item.category);
    setProdDescription(item.description);
    setProdImage(item.image || '');
    setProdPrice(item.price);
    setProdUnitLabel(item.unitLabel || '');
    setProdBadge(item.badge || '');
    setProdBadgeType(item.badgeType || 'primary');
    setProdPortions(item.portions ? [...item.portions] : []);
  };

  const startCreateProduct = () => {
    setEditingItem(null);
    setIsCreatingNew(true);
    setProdName('');
    setProdCategory('tradicionales');
    setProdDescription('');
    setProdImage('');
    setProdPrice(18.0);
    setProdUnitLabel('12 Unid');
    setProdBadge('');
    setProdBadgeType('primary');
    setProdPortions([]);
  };

  const handleImageUploadFromDisk = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'hero') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'product') {
          setProdImage(reader.result);
          showToast('¡Imagen cargada exitosamente desde tu dispositivo!');
        } else {
          setLocalStoreConfig((prev) => ({ ...prev, heroImage: reader.result as string }));
          showToast('¡Imagen del banner actualizada desde tu dispositivo!');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }

    if (isCreatingNew) {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: prodName.trim(),
        category: prodCategory,
        description: prodDescription.trim(),
        image: prodImage.trim() || undefined,
        price: Number(prodPrice) || 0,
        unitLabel: prodUnitLabel.trim() || undefined,
        badge: prodBadge.trim() || undefined,
        badgeType: prodBadgeType,
        portions: prodPortions.length > 0 ? prodPortions : undefined,
      };
      onSaveMenuItems([...menuItems, newItem]);
      showToast(`¡Producto "${newItem.name}" creado con éxito!`);
    } else if (editingItem) {
      const updatedList = menuItems.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name: prodName.trim(),
            category: prodCategory,
            description: prodDescription.trim(),
            image: prodImage.trim() || undefined,
            price: Number(prodPrice) || 0,
            unitLabel: prodUnitLabel.trim() || undefined,
            badge: prodBadge.trim() || undefined,
            badgeType: prodBadgeType,
            portions: prodPortions.length > 0 ? prodPortions : undefined,
          };
        }
        return item;
      });
      onSaveMenuItems(updatedList);
      showToast(`¡Producto "${prodName}" actualizado con éxito!`);
    }

    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = (itemId: string, itemName: string) => {
    if (confirm(`¿Estás seguro de eliminar "${itemName}" de la carta?`)) {
      const updated = menuItems.filter((i) => i.id !== itemId);
      onSaveMenuItems(updated);
      if (editingItem?.id === itemId) {
        setEditingItem(null);
        setIsCreatingNew(false);
      }
      showToast(`¡Producto "${itemName}" eliminado!`);
    }
  };

  const handleAddPortion = () => {
    setProdPortions([
      ...prodPortions,
      { label: `${(prodPortions.length + 1) * 12} unid`, units: (prodPortions.length + 1) * 12, price: 20 },
    ]);
  };

  const handleUpdatePortion = (index: number, field: keyof PortionOption, value: any) => {
    const updated = [...prodPortions];
    updated[index] = { ...updated[index], [field]: value };
    setProdPortions(updated);
  };

  const handleRemovePortion = (index: number) => {
    setProdPortions(prodPortions.filter((_, idx) => idx !== index));
  };

  const handleAddDeliveryZone = () => {
    const currentZones = localStoreConfig.deliveryZones || [];
    const newZone = {
      id: `zone-${Date.now()}`,
      name: 'Nuevo Distrito',
      fee: 7.0,
    };
    setLocalStoreConfig({
      ...localStoreConfig,
      deliveryZones: [...currentZones, newZone],
    });
  };

  const handleUpdateDeliveryZone = (index: number, field: string, value: any) => {
    const currentZones = [...(localStoreConfig.deliveryZones || [])];
    currentZones[index] = { ...currentZones[index], [field]: value };
    setLocalStoreConfig({ ...localStoreConfig, deliveryZones: currentZones });
  };

  const handleRemoveDeliveryZone = (index: number) => {
    const currentZones = (localStoreConfig.deliveryZones || []).filter((_, idx) => idx !== index);
    setLocalStoreConfig({ ...localStoreConfig, deliveryZones: currentZones });
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStoreConfig(localStoreConfig);
    showToast('¡Configuración de horario y local guardada con éxito!');
  };

  const handleExportJSON = () => {
    const data = {
      menuItems,
      storeConfig: localStoreConfig,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `piqueos-san-miguel-config-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('¡Configuración descargada en formato JSON!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
          onSaveMenuItems(parsed.menuItems);
        }
        if (parsed.storeConfig) {
          onSaveStoreConfig(parsed.storeConfig);
          setLocalStoreConfig(parsed.storeConfig);
        }
        showToast('¡Configuración restaurada desde archivo JSON con éxito!');
      } catch (err) {
        alert('Error al leer el archivo JSON. Verifica el formato.');
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = filterCategory === 'all'
    ? menuItems
    : menuItems.filter((i) => i.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] shadow-2xl border border-[#E4BEBA]/40 flex flex-col overflow-hidden relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1B1B21] text-white px-4 py-2 rounded-full font-bold text-[13px] shadow-lg flex items-center gap-2 border border-emerald-500 animate-bounce">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F5F2FB] to-white border-b border-[#E4BEBA]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A20513] text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-black text-[#1B1B21]">
                Panel de Configuración & Administración
              </h2>
              <p className="text-[12px] text-[#5B403D]">
                Edita la carta de productos, sube fotos desde tu disco, modifica horarios y datos del negocio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-[#E4BEBA]/40 flex items-center justify-center text-[#5B403D] hover:text-[#1B1B21] transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#E4BEBA]/30 px-4 sm:px-6 bg-[#FAF7FD] gap-1 overflow-x-auto shrink-0 custom-scroll">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#A20513] text-[#A20513]'
                : 'border-transparent text-[#5B403D] hover:text-[#1B1B21]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            Productos & Carta ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'store'
                ? 'border-[#A20513] text-[#A20513]'
                : 'border-transparent text-[#5B403D] hover:text-[#1B1B21]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            Horario & Dark Kitchen
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'border-[#A20513] text-[#A20513]'
                : 'border-transparent text-[#5B403D] hover:text-[#1B1B21]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">image</span>
            Banner Principal & Hero
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'border-[#A20513] text-[#A20513]'
                : 'border-transparent text-[#5B403D] hover:text-[#1B1B21]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Copia de Seguridad (JSON)
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scroll">
          {/* TAB 1: PRODUCTOS & CARTA */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6">
              {/* Product Form (Create or Edit) */}
              {(isCreatingNew || editingItem) ? (
                <div className="bg-[#F5F2FB] p-5 sm:p-6 rounded-3xl border border-[#E4BEBA]/40 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4BEBA]/30 mb-4">
                    <h3 className="text-[17px] font-extrabold text-[#1B1B21] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#A20513]">
                        {isCreatingNew ? 'add_circle' : 'edit_note'}
                      </span>
                      {isCreatingNew ? 'Nuevo Producto para la Carta' : `Editando: ${editingItem?.name}`}
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingItem(null);
                      }}
                      className="text-[12px] font-bold text-[#8F706C] hover:text-[#1B1B21] px-3 py-1 bg-white rounded-full border border-[#E4BEBA]/30"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left Column (Inputs) */}
                    <div className="md:col-span-7 flex flex-col gap-3.5">
                      <div>
                        <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                          Nombre del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="Ej: Tequeños de Lomo Saltado"
                          className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                            Categoría *
                          </label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value as MenuItem['category'])}
                            className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                          >
                            <option value="tradicionales">Tradicionales</option>
                            <option value="especiales">Especiales & Fusión</option>
                            <option value="combos">Mega Boxes & Combos</option>
                            <option value="salsas">Salsas & Cremas</option>
                            <option value="bebidas">Bebidas Heladas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                            Precio Base (S/) *
                          </label>
                          <input
                            type="number"
                            step="0.10"
                            required
                            value={prodPrice}
                            onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                          Descripción Apetitosa *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          placeholder="Describe los ingredientes, crunch de masa wantán, tipo de queso o salsa..."
                          className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                            Etiqueta Destacada (Badge)
                          </label>
                          <input
                            type="text"
                            value={prodBadge}
                            onChange={(e) => setProdBadge(e.target.value)}
                            placeholder="Ej: Top Ventas, Al Wok, Cremoso"
                            className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                          />
                        </div>

                        <div>
                          <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                            Etiqueta de Unidad
                          </label>
                          <input
                            type="text"
                            value={prodUnitLabel}
                            onChange={(e) => setProdUnitLabel(e.target.value)}
                            placeholder="Ej: 12 Unid, 4 oz, Super Box, Desde"
                            className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                          />
                        </div>
                      </div>

                      {/* Portions manager */}
                      <div className="bg-white p-3 rounded-2xl border border-[#E4BEBA]/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px] font-bold text-[#1B1B21]">
                            Opciones de Porciones (Ej: 12 unid, 24 unid, 50 unid)
                          </span>
                          <button
                            type="button"
                            onClick={handleAddPortion}
                            className="text-[11px] font-bold bg-[#EADDFF] text-[#6C45C0] px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            Agregar Porción
                          </button>
                        </div>

                        {prodPortions.length === 0 ? (
                          <p className="text-[11px] text-[#5B403D] italic">
                            Sin opciones adicionales de porción (se usará el precio base).
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {prodPortions.map((portion, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-[#F5F2FB] p-2 rounded-xl text-[12px]">
                                <input
                                  type="text"
                                  value={portion.label}
                                  onChange={(e) => handleUpdatePortion(idx, 'label', e.target.value)}
                                  placeholder="Ej: 24 unid · S/ 32"
                                  className="bg-white p-1.5 rounded-lg border border-[#E4BEBA] flex-1 text-[11px]"
                                />
                                <input
                                  type="number"
                                  value={portion.units}
                                  onChange={(e) => handleUpdatePortion(idx, 'units', parseInt(e.target.value) || 0)}
                                  placeholder="Unidades"
                                  className="bg-white p-1.5 rounded-lg border border-[#E4BEBA] w-16 text-[11px]"
                                />
                                <input
                                  type="number"
                                  step="0.5"
                                  value={portion.price}
                                  onChange={(e) => handleUpdatePortion(idx, 'price', parseFloat(e.target.value) || 0)}
                                  placeholder="Precio S/"
                                  className="bg-white p-1.5 rounded-lg border border-[#E4BEBA] w-20 text-[11px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePortion(idx)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Eliminar opción"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column (Image upload from local or URL) */}
                    <div className="md:col-span-5 flex flex-col gap-3">
                      <label className="block text-[12px] font-bold text-[#1B1B21]">
                        Foto del Producto *
                      </label>

                      {/* Image Preview Box */}
                      <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-dashed border-[#E4BEBA] bg-white flex flex-col items-center justify-center p-2 text-center group">
                        {prodImage ? (
                          <>
                            <img
                              src={prodImage}
                              alt="Previsualización"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setProdImage('')}
                              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full text-[10px] hover:bg-black"
                              title="Quitar imagen"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[#8F706C]">
                            <span className="material-symbols-outlined text-[36px] text-[#A20513]/60">
                              add_photo_alternate
                            </span>
                            <span className="text-[12px] font-bold">Sin foto asignada</span>
                            <span className="text-[10px]">Sube una foto desde tu equipo</span>
                          </div>
                        )}
                      </div>

                      {/* Hidden File Input for Local Image Selection */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUploadFromDisk(e, 'product')}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                      />

                      {/* Button to upload from local drive */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#6C45C0] hover:bg-[#5833AA] text-white py-2.5 px-4 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                        Subir Foto desde mi Computadora
                      </button>

                      {/* Or paste direct URL */}
                      <div>
                        <label className="block text-[11px] text-[#5B403D] font-medium mb-1">
                          O ingresa la URL de la imagen:
                        </label>
                        <input
                          type="text"
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white text-[11px] p-2 rounded-lg border border-[#E4BEBA]"
                        />
                      </div>

                      {/* Save Buttons */}
                      <div className="pt-3 border-t border-[#E4BEBA]/30 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-[#A20513] hover:bg-[#C62828] text-white py-3 rounded-full font-bold text-[13px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                          {isCreatingNew ? 'Guardar Nuevo Producto' : 'Guardar Cambios'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Products List Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#1B1B21]">Filtrar por:</span>
                  <div className="inline-flex bg-[#F5F2FB] p-1 rounded-full border border-[#E4BEBA]/30 text-[11px] font-bold">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'tradicionales', label: 'Tradicionales' },
                      { id: 'especiales', label: 'Especiales' },
                      { id: 'combos', label: 'Combos' },
                      { id: 'salsas', label: 'Salsas' },
                      { id: 'bebidas', label: 'Bebidas' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilterCategory(f.id)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          filterCategory === f.id
                            ? 'bg-[#A20513] text-white shadow-xs'
                            : 'text-[#5B403D] hover:text-[#1B1B21]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!isCreatingNew && !editingItem && (
                  <button
                    onClick={startCreateProduct}
                    className="bg-[#A20513] hover:bg-[#C62828] text-white px-4 py-2 rounded-full font-bold text-[13px] shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    + Agregar Nuevo Producto
                  </button>
                )}
              </div>

              {/* Products Table/Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#E4BEBA]/30 flex gap-3 items-center justify-between shadow-xs hover:border-[#A20513]/40 transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F2FB] shrink-0 border border-[#E4BEBA]/30">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8F706C]">
                          <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#1B1B21] truncate">{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5B403D] truncate mt-0.5">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] font-black text-[#A20513]">
                          S/ {item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 capitalize">
                          ({item.category})
                        </span>
                        {item.portions && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded font-bold">
                            {item.portions.length} porciones
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditProduct(item)}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                        title="Editar producto"
                      >
                        <span className="material-symbols-outlined text-[19px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Eliminar producto"
                      >
                        <span className="material-symbols-outlined text-[19px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HORARIO & DARK KITCHEN */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStore} className="max-w-2xl mx-auto flex flex-col gap-5">
              <div className="bg-[#F5F2FB] p-5 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#1B1B21] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A20513]">schedule</span>
                  Horarios y Disponibilidad
                </h3>

                <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E4BEBA]/30">
                  <div>
                    <span className="text-[13px] font-bold text-[#1B1B21] block">
                      Estado de la Cocina en Vivo:
                    </span>
                    <span className="text-[11px] text-[#5B403D]">
                      {localStoreConfig.isOpen
                        ? 'Actualmente visible como "Abierto Ahora" (Aceptando pedidos)'
                        : 'Actualmente visible como "Cerrado" (Fuera de horario)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLocalStoreConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
                    className={`px-4 py-2 rounded-full font-extrabold text-[12px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                      localStoreConfig.isOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                    {localStoreConfig.isOpen ? 'ABIERTO' : 'CERRADO'}
                  </button>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                    Texto del Horario de Atención:
                  </label>
                  <input
                    type="text"
                    value={localStoreConfig.scheduleText}
                    onChange={(e) =>
                      setLocalStoreConfig({ ...localStoreConfig, scheduleText: e.target.value })
                    }
                    placeholder="Ej: Mar a Dom: 4:30 PM - 11:30 PM"
                    className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Tiempo Estimado de Entrega:
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.deliveryTimeEstimate}
                      onChange={(e) =>
                        setLocalStoreConfig({
                          ...localStoreConfig,
                          deliveryTimeEstimate: e.target.value,
                        })
                      }
                      placeholder="Ej: 25 - 40 min"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Monto para Delivery GRATIS (S/):
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={localStoreConfig.freeDeliveryThreshold ?? 60}
                      onChange={(e) =>
                        setLocalStoreConfig({
                          ...localStoreConfig,
                          freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ej: 60 (0 para desactivar)"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                    <span className="text-[10px] text-[#5B403D] mt-0.5 block">
                      Pedidos iguales o mayores a este monto tendrán envío gratis.
                    </span>
                  </div>
                </div>

                {/* Zonas de Reparto y Tarifas Editor */}
                <div className="bg-white p-4 rounded-2xl border border-[#E4BEBA]/40 mt-1 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-[#A20513]">local_shipping</span>
                        Zonas y Distritos de Reparto (Tarifas Dinámicas)
                      </h4>
                      <p className="text-[11px] text-[#5B403D]">
                        Personaliza los costos de envío según el distrito o zona de Lima y Callao.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddDeliveryZone}
                      className="bg-[#EADDFF] text-[#6C45C0] hover:bg-[#D9C4FF] text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      + Agregar Zona
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {(localStoreConfig.deliveryZones || []).map((zone, idx) => (
                      <div
                        key={zone.id || idx}
                        className="flex items-center gap-2 bg-[#F5F2FB] p-2.5 rounded-xl border border-[#E4BEBA]/30 text-[12px]"
                      >
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => handleUpdateDeliveryZone(idx, 'name', e.target.value)}
                          placeholder="Nombre del distrito / zona"
                          className="bg-white p-2 rounded-lg border border-[#E4BEBA] flex-1 text-[12px] font-medium"
                        />
                        <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-[#E4BEBA] shrink-0">
                          <span className="text-[11px] font-bold text-[#5B403D]">S/</span>
                          <input
                            type="number"
                            step="0.5"
                            value={zone.fee}
                            onChange={(e) =>
                              handleUpdateDeliveryZone(idx, 'fee', parseFloat(e.target.value) || 0)
                            }
                            placeholder="Costo"
                            className="w-16 text-[12px] font-bold text-[#A20513] text-right focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliveryZone(idx)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                          title="Eliminar zona"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Contact info */}
              <div className="bg-[#F5F2FB] p-5 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#1B1B21] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A20513]">location_on</span>
                  Ubicación & Contacto WhatsApp
                </h3>

                <div>
                  <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                    Dirección de la Dark Kitchen:
                  </label>
                  <input
                    type="text"
                    value={localStoreConfig.address}
                    onChange={(e) =>
                      setLocalStoreConfig({ ...localStoreConfig, address: e.target.value })
                    }
                    placeholder="Calle Comandante Guillermo Moore 296, San Miguel, Lima"
                    className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                    Referencia de Dirección:
                  </label>
                  <input
                    type="text"
                    value={localStoreConfig.addressRef}
                    onChange={(e) =>
                      setLocalStoreConfig({ ...localStoreConfig, addressRef: e.target.value })
                    }
                    placeholder="Altura Cdra 2 de Av. La Paz"
                    className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Teléfono WhatsApp (formato internacional):
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.whatsappPhone}
                      onChange={(e) =>
                        setLocalStoreConfig({ ...localStoreConfig, whatsappPhone: e.target.value })
                      }
                      placeholder="51906591037"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Número WhatsApp Visible:
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.whatsappDisplay}
                      onChange={(e) =>
                        setLocalStoreConfig({
                          ...localStoreConfig,
                          whatsappDisplay: e.target.value,
                        })
                      }
                      placeholder="+51 906 591 037"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      RUC SUNAT:
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.ruc}
                      onChange={(e) =>
                        setLocalStoreConfig({ ...localStoreConfig, ruc: e.target.value })
                      }
                      placeholder="20608941201"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Razón Social:
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.razonSocial}
                      onChange={(e) =>
                        setLocalStoreConfig({ ...localStoreConfig, razonSocial: e.target.value })
                      }
                      placeholder="Piqueos San Miguel S.A.C."
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#A20513] hover:bg-[#C62828] text-white py-3.5 rounded-full font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">save</span>
                Guardar Cambios de Horario & Local
              </button>
            </form>
          )}

          {/* TAB 3: BANNER PRINCIPAL & HERO */}
          {activeTab === 'hero' && (
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
              <div className="bg-[#F5F2FB] p-5 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#1B1B21] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A20513]">campaign</span>
                  Textos del Hero Banner
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Título (Prefijo):
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.heroTitle}
                      onChange={(e) =>
                        setLocalStoreConfig({ ...localStoreConfig, heroTitle: e.target.value })
                      }
                      placeholder="Los Mejores"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                      Palabra Destacada:
                    </label>
                    <input
                      type="text"
                      value={localStoreConfig.heroHighlight}
                      onChange={(e) =>
                        setLocalStoreConfig({ ...localStoreConfig, heroHighlight: e.target.value })
                      }
                      placeholder="Tequeños"
                      className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1B1B21] mb-1">
                    Descripción del Banner Principal:
                  </label>
                  <textarea
                    rows={3}
                    value={localStoreConfig.heroDescription}
                    onChange={(e) =>
                      setLocalStoreConfig({ ...localStoreConfig, heroDescription: e.target.value })
                    }
                    placeholder="Masa wantán extra crocante..."
                    className="w-full bg-white text-[13px] p-2.5 rounded-xl border border-[#E4BEBA]"
                  ></textarea>
                </div>
              </div>

              {/* Hero Image Section */}
              <div className="bg-[#F5F2FB] p-5 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#1B1B21] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A20513]">image</span>
                  Imagen Principal del Hero
                </h3>

                <div className="h-52 rounded-2xl overflow-hidden border border-[#E4BEBA] bg-white">
                  <img
                    src={localStoreConfig.heroImage}
                    alt="Banner Hero"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  type="file"
                  ref={heroFileInputRef}
                  onChange={(e) => handleImageUploadFromDisk(e, 'hero')}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="bg-[#6C45C0] hover:bg-[#5833AA] text-white py-2.5 px-4 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[19px]">upload_file</span>
                  Subir Foto de Banner desde mi Computadora
                </button>

                <div>
                  <label className="block text-[11px] text-[#5B403D] font-medium mb-1">
                    O ingresa la URL de la imagen del banner:
                  </label>
                  <input
                    type="text"
                    value={localStoreConfig.heroImage}
                    onChange={(e) =>
                      setLocalStoreConfig({ ...localStoreConfig, heroImage: e.target.value })
                    }
                    className="w-full bg-white text-[11px] p-2 rounded-lg border border-[#E4BEBA]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveStore}
                className="bg-[#A20513] hover:bg-[#C62828] text-white py-3.5 rounded-full font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">save</span>
                Guardar Configuración del Banner
              </button>
            </div>
          )}

          {/* TAB 4: COPIA DE SEGURIDAD (JSON) */}
          {activeTab === 'backup' && (
            <div className="max-w-xl mx-auto flex flex-col gap-6 py-4">
              <div className="bg-[#F5F2FB] p-6 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFDAD6] text-[#A20513] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">file_download</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#1B1B21]">Descargar Respaldo de la Carta</h3>
                <p className="text-[13px] text-[#5B403D]">
                  Exporta todos tus productos, precios, fotos y horarios en un archivo JSON para tener una copia segura o transferirla.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="bg-[#1B1B21] hover:bg-black text-white py-2.5 px-6 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Descargar Archivo JSON
                </button>
              </div>

              <div className="bg-[#F5F2FB] p-6 rounded-3xl border border-[#E4BEBA]/40 flex flex-col gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#EADDFF] text-[#6C45C0] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">upload</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#1B1B21]">Restaurar desde Archivo JSON</h3>
                <p className="text-[13px] text-[#5B403D]">
                  Carga un archivo JSON previamente exportado para restaurar tu carta completa al instante.
                </p>
                <input
                  type="file"
                  ref={jsonImportRef}
                  onChange={handleImportJSON}
                  accept=".json, application/json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => jsonImportRef.current?.click()}
                  className="bg-[#6C45C0] hover:bg-[#5833AA] text-white py-2.5 px-6 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">file_open</span>
                  Seleccionar Archivo JSON
                </button>
              </div>

              <div className="bg-red-50 p-5 rounded-3xl border border-red-200 flex flex-col gap-3 text-center">
                <h4 className="text-[14px] font-bold text-red-900">Restablecer Valores Predeterminados</h4>
                <p className="text-[12px] text-red-700">
                  Esta acción restaurará la carta original de Tequeños Clásicos, Lomo Saltado, Super Box y horarios por defecto.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Estás seguro de restablecer toda la carta a los valores de fábrica? Se perderán las fotos personalizadas no exportadas.')) {
                      onResetToDefaults();
                      onClose();
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-full font-bold text-[12px] mx-auto cursor-pointer"
                >
                  Restablecer a valores de fábrica
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
