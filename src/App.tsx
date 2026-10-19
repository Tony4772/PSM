import React, { useState } from 'react';
import { CategoryTabs } from './components/CategoryTabs';
import { DarkKitchenSection } from './components/DarkKitchenSection';
import { HeroBanner } from './components/HeroBanner';
import { MenuCatalog } from './components/MenuCatalog';
import { Navbar } from './components/Navbar';
import { OrderTray } from './components/OrderTray';
import { TopAnnouncement } from './components/TopAnnouncement';
import { TrackingView } from './components/TrackingView';
import { ASSETS, INITIAL_CART_ITEMS, MENU_ITEMS } from './data/menuData';
import {
  CartItem,
  ComprobanteType,
  FacturaDetails,
  FulfillmentMode,
  MenuItem,
  OrderStage,
  PortionOption,
} from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'tracking'>('menu');
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('delivery');
  const [activeCategory, setActiveCategory] = useState<string>('tradicionales');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [comprobante, setComprobante] = useState<ComprobanteType>('boleta');
  const [facturaDetails, setFacturaDetails] = useState<FacturaDetails>({
    ruc: '',
    razonSocial: '',
    direccionFiscal: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    'Av. La Paz 1420, Dpto 402, San Miguel'
  );
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'yape' | 'plin'>('yape');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('PSM-8492');
  const [orderStage, setOrderStage] = useState<OrderStage>(2); // Default to stage 2 (Fritura al instante)

  const cartTotal =
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
    (fulfillmentMode === 'delivery' ? 6.5 : 0.0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    selectedPortion?: PortionOption,
    customNote?: string
  ) => {
    const portionLabel = selectedPortion ? selectedPortion.label : item.unitLabel;
    const price = selectedPortion ? selectedPortion.price : item.price;
    const units = selectedPortion ? selectedPortion.units : undefined;
    const uniqueCartId = `${item.id}-${portionLabel || 'default'}`;

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === uniqueCartId);
      if (existing) {
        return prev.map((ci) =>
          ci.id === uniqueCartId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          id: uniqueCartId,
          menuItemId: item.id,
          name: item.name,
          portionLabel,
          units,
          sauceNote: customNote,
          price,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSuperBox = () => {
    const superBox = MENU_ITEMS.find((i) => i.id === 'super-box-50');
    if (superBox) {
      handleAddToCart(superBox);
      setIsCartDrawerOpen(true);
    }
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('carta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleProcessCulqiPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Simulate instant Culqi gateway payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsCheckoutModalOpen(false);
      setIsCartDrawerOpen(false);
      const newOrderNum = `PSM-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderNumber(newOrderNum);
      setOrderStage(1);
      setCurrentView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const AppContent = (
    <div className="min-h-screen flex flex-col bg-[#FBF8FF] text-[#1B1B21]">
      {/* Top Announcement Bar */}
      <TopAnnouncement
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        orderNumber={orderNumber}
      />

      {/* Main Sticky Navbar */}
      <Navbar
        fulfillmentMode={fulfillmentMode}
        setFulfillmentMode={setFulfillmentMode}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onNavigateSection={handleNavigateSection}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {currentView === 'tracking' ? (
        <main className="flex-1">
          <TrackingView
            orderNumber={orderNumber}
            orderStage={orderStage}
            setOrderStage={setOrderStage}
            fulfillmentMode={fulfillmentMode}
            cartItems={cartItems}
            cartTotal={cartTotal}
            deliveryAddress={deliveryAddress}
            onBackToMenu={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <HeroBanner
            onScrollToMenu={handleScrollToMenu}
            onQuickOrder={() => setIsCartDrawerOpen(true)}
            onAddSuperBox={handleAddSuperBox}
          />

          {/* Sticky Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Catalog & Cart Desktop Grid */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Menu Catalog (8 Cols) */}
              <div className="lg:col-span-8">
                <MenuCatalog onAddToCart={handleAddToCart} />
              </div>

              {/* Order Tray Desktop Sidebar (4 Cols) */}
              <div className="hidden lg:block lg:col-span-4">
                <OrderTray
                  cartItems={cartItems}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveItem}
                  fulfillmentMode={fulfillmentMode}
                  setFulfillmentMode={setFulfillmentMode}
                  comprobante={comprobante}
                  setComprobante={setComprobante}
                  facturaDetails={facturaDetails}
                  setFacturaDetails={setFacturaDetails}
                  onConfirmOrder={handleStartCheckout}
                />
              </div>
            </div>
          </div>

          {/* Dark Kitchen Details Section */}
          <DarkKitchenSection />
        </main>
      )}

      {/* Mobile Floating Bottom Cart Bar */}
      {currentView === 'menu' && cartCount > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-[#A20513] hover:bg-[#C62828] text-white py-3.5 px-5 rounded-full font-extrabold text-[15px] shadow-2xl flex items-center justify-between active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span>Ver Pedido ({cartCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-normal opacity-90">Total:</span>
              <span className="text-[16px] font-black">S/ {cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}

      {/* Mobile & Drawer Cart Modal */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-4 sm:p-6 overflow-y-auto custom-scroll relative">
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="absolute top-4 right-4 text-[#5B403D] hover:text-[#1B1B21] p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Cerrar Carrito"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="mt-6">
              <OrderTray
                cartItems={cartItems}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                fulfillmentMode={fulfillmentMode}
                setFulfillmentMode={setFulfillmentMode}
                comprobante={comprobante}
                setComprobante={setComprobante}
                facturaDetails={facturaDetails}
                setFacturaDetails={setFacturaDetails}
                onConfirmOrder={() => {
                  setIsCartDrawerOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Culqi Checkout Simulation Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4BEBA]/40 relative flex flex-col gap-4">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#5B403D] hover:text-[#1B1B21] p-1.5 rounded-full hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFDAD6] text-[#A20513] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#1B1B21]">
                  Pasarela de Pago Segura
                </h3>
                <span className="text-[12px] text-[#5B403D] font-medium">
                  Integración Culqi Checkout 3D Secure
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F5F2FB] rounded-2xl border border-[#E4BEBA]/30 flex justify-between items-center text-[13px]">
              <span className="text-[#5B403D]">Monto a Cobrar:</span>
              <span className="text-[18px] font-black text-[#A20513]">
                S/ {cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('yape')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'yape'
                    ? 'border-[#6C45C0] bg-[#EADDFF]/40 text-[#6C45C0]'
                    : 'border-[#E4BEBA]/40 text-[#5B403D]'
                }`}
              >
                <span className="block text-[14px]">🟣 Yape</span>
                <span className="text-[10px] text-[#5B403D]">Inmediato</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('plin')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'plin'
                    ? 'border-[#00bfa5] bg-[#e0f7f4] text-[#00897b]'
                    : 'border-[#E4BEBA]/40 text-[#5B403D]'
                }`}
              >
                <span className="block text-[14px]">🟢 Plin</span>
                <span className="text-[10px] text-[#5B403D]">Sin comisión</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('tarjeta')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'tarjeta'
                    ? 'border-[#A20513] bg-[#FFDAD6]/40 text-[#A20513]'
                    : 'border-[#E4BEBA]/40 text-[#5B403D]'
                }`}
              >
                <span className="block text-[14px]">💳 Tarjeta</span>
                <span className="text-[10px] text-[#5B403D]">Débito/Crédito</span>
              </button>
            </div>

            {/* Mock Payment Details */}
            <form onSubmit={handleProcessCulqiPayment} className="flex flex-col gap-3">
              {paymentMethod === 'yape' || paymentMethod === 'plin' ? (
                <div className="p-3 bg-white rounded-xl border border-[#E4BEBA]/40 text-center flex flex-col items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#1B1B21]">
                    Número receptor de {paymentMethod === 'yape' ? 'Yape' : 'Plin'}:
                  </span>
                  <span className="text-[17px] font-black text-[#A20513] tracking-wider">
                    906 591 037
                  </span>
                  <span className="text-[11px] text-[#5B403D]">Titular: Piqueos San Miguel S.A.C.</span>
                  <input
                    type="text"
                    required
                    placeholder="Código de aprobación / Celular emisor"
                    className="w-full text-[12px] p-2 mt-1 border rounded-lg border-[#E4BEBA] text-center"
                    defaultValue="987654321"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-[12px]">
                  <input
                    type="text"
                    placeholder="Número de Tarjeta (16 dígitos)"
                    defaultValue="4557 **** **** 9104"
                    required
                    className="p-2 border rounded-lg border-[#E4BEBA]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      defaultValue="08/29"
                      required
                      className="p-2 border rounded-lg border-[#E4BEBA]"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="724"
                      required
                      className="p-2 border rounded-lg border-[#E4BEBA]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full mt-2 bg-[#A20513] hover:bg-[#C62828] text-white py-3 rounded-full font-extrabold text-[14px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    Procesando con Culqi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Pagar S/ {cartTotal.toFixed(2)} y Enviar a Cocina
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1B1B21] text-white py-12 border-t border-[#303036] mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={ASSETS.emblem}
                alt="Piqueos San Miguel"
                className="w-9 h-9 object-contain"
              />
              <span className="text-[18px] font-extrabold text-white">Piqueos San Miguel</span>
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              Dark kitchen especializada en tequeños artesanales recién fritos y piqueos criollos
              crujientes. El sabor a otro nivel en San Miguel, Lima.
            </p>
            <span className="text-[12px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Abierto Hoy hasta las 11:30 PM
            </span>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Ubicación Dark Kitchen
            </h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              Calle Comandante Guillermo Moore 296, San Miguel, Lima, Perú.
            </p>
            <p className="text-[12px] text-gray-400 mt-2">
              Ref: Altura de la cuadra 2 de Av. La Paz.
            </p>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Horario & Atención
            </h4>
            <ul className="text-[13px] text-gray-400 space-y-1.5">
              <li>Martes a Domingo: 4:30 PM - 11:30 PM</li>
              <li>Lunes: Cerrado por mantenimiento</li>
              <li className="pt-2 text-white font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">chat</span>
                WhatsApp: +51 906 591 037
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Legal & Facturación
            </h4>
            <ul className="text-[12px] text-gray-400 space-y-1">
              <li>RUC: 20608941201</li>
              <li>Razón Social: Piqueos San Miguel S.A.C.</li>
              <li>Emisión de Boleta y Factura Electrónica SUNAT</li>
              <li>Libro de Reclamaciones Virtual</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pt-6 border-t border-[#303036] flex flex-wrap items-center justify-between gap-4 text-[12px] text-gray-400">
          <span>© {new Date().getFullYear()} Piqueos San Miguel. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Términos del Servicio</span>
            <span className="hover:text-white cursor-pointer">Privacidad de Datos</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // If simulate mobile frame is toggled on, wrap inside phone frame bezel
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-[#2A2A32] flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="mb-3 flex items-center gap-3 text-white text-[13px]">
          <span className="font-bold">Vista Previa Móvil (Simulador de Smartphone)</span>
          <button
            onClick={() => setIsMobileFrame(false)}
            className="bg-[#A20513] hover:bg-[#C62828] text-white px-3 py-1 rounded-full text-[12px] font-bold"
          >
            Volver a Pantalla Completa
          </button>
        </div>
        <div className="w-full max-w-[420px] h-[860px] bg-white rounded-[45px] shadow-2xl border-[10px] border-[#18181B] overflow-hidden flex flex-col relative">
          {/* Phone speaker notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#18181B] rounded-full z-50"></div>
          <div className="flex-1 overflow-y-auto custom-scroll pt-2">{AppContent}</div>
        </div>
      </div>
    );
  }

  return AppContent;
}
