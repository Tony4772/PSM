import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AdminConfigModal } from './components/AdminConfigModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CategoryTabs } from './components/CategoryTabs';
import { DarkKitchenSection } from './components/DarkKitchenSection';
import { HeroBanner } from './components/HeroBanner';
import { MenuCatalog } from './components/MenuCatalog';
import { Navbar } from './components/Navbar';
import { OrderTray } from './components/OrderTray';
import { ScheduleModal } from './components/ScheduleModal';
import { TopAnnouncement } from './components/TopAnnouncement';
import { TrackingView } from './components/TrackingView';
import { ASSETS, DEFAULT_STORE_CONFIG, INITIAL_CART_ITEMS, MENU_ITEMS } from './data/menuData';
import {
  CartItem,
  ComprobanteType,
  CulqiPaymentResult,
  FacturaDetails,
  FulfillmentMode,
  MenuItem,
  OrderStage,
  PortionOption,
  StoreConfig,
  SunatComprobanteResult,
} from './types';
import {
  DEFAULT_SPECIAL_DATES,
  DEFAULT_WEEKLY_SCHEDULE,
  getStoreStatusInfo,
} from './utils/scheduleUtils';

export default function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'tracking'>('menu');
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('san-miguel');
  const [activeCategory, setActiveCategory] = useState<string>('tradicionales');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [comprobante, setComprobante] = useState<ComprobanteType>('boleta');
  const [facturaDetails, setFacturaDetails] = useState<FacturaDetails>({
    ruc: '',
    razonSocial: '',
    direccionFiscal: '',
  });

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState<string>('Carlos Mendoza');
  const [customerPhone, setCustomerPhone] = useState<string>('987654321');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    'Av. La Paz 1420, Dpto 402, San Miguel'
  );
  const [deliveryReference, setDeliveryReference] = useState<string>('Edificio Las Torres, frente al parque');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [culqiResult, setCulqiResult] = useState<CulqiPaymentResult | null>(null);
  const [sunatResult, setSunatResult] = useState<SunatComprobanteResult | null>(null);
  const [isIssuingInvoice, setIsIssuingInvoice] = useState<boolean>(false);

  // Owner Authentication & Admin Controls
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('psm_admin_authenticated') === 'true' ||
        sessionStorage.getItem('psm_admin_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminConfigModalOpen, setIsAdminConfigModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('psm_owner_password') || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  // Active Order State
  const [orderNumber, setOrderNumber] = useState<string>('PSM-8492');
  const [orderStage, setOrderStage] = useState<OrderStage>(1);
  const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(false);

  // Configurable dynamic state initialized with localStorage persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('psm_menu_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load menu items from storage', e);
    }
    return MENU_ITEMS;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('psm_store_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_CONFIG,
          ...parsed,
          weeklySchedule:
            parsed.weeklySchedule && parsed.weeklySchedule.length === 7
              ? parsed.weeklySchedule
              : DEFAULT_WEEKLY_SCHEDULE,
          specialDates: parsed.specialDates || DEFAULT_SPECIAL_DATES,
          scheduleMode: parsed.scheduleMode || 'auto',
        };
      }
    } catch (e) {
      console.warn('Failed to load store config from storage', e);
    }
    return DEFAULT_STORE_CONFIG;
  });

  // Clock to evaluate real-time schedule every 30 seconds
  const [clock, setClock] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const liveStoreStatus = getStoreStatusInfo(storeConfig, clock);
  const effectiveStoreConfig: StoreConfig = {
    ...storeConfig,
    isOpen: liveStoreStatus.isOpen,
  };

  // Owner shortcut listener (Alt + A) to open admin login quickly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminConfigModalOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setIsAdminConfigModalOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('psm_admin_authenticated');
      sessionStorage.removeItem('psm_admin_authenticated');
    } catch (e) {
      console.warn('Could not clear auth storage', e);
    }
    setIsAdminConfigModalOpen(false);
  };

  const handleUpdatePassword = (newPw: string) => {
    setAdminPassword(newPw);
    try {
      localStorage.setItem('psm_owner_password', newPw);
    } catch (e) {
      console.warn('Could not save password to storage', e);
    }
  };

  const handleSaveMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    try {
      localStorage.setItem('psm_menu_items', JSON.stringify(newItems));
    } catch (e) {
      console.warn('Could not save menu items to storage', e);
    }
  };

  const handleSaveStoreConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    try {
      localStorage.setItem('psm_store_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Could not save store config to storage', e);
    }
  };

  const handleResetToDefaults = () => {
    setMenuItems(MENU_ITEMS);
    setStoreConfig(DEFAULT_STORE_CONFIG);
    try {
      localStorage.removeItem('psm_menu_items');
      localStorage.removeItem('psm_store_config');
    } catch (e) {
      console.warn('Could not clear storage', e);
    }
  };

  // Dynamic delivery calculations with zones and free delivery threshold
  const deliveryZones = storeConfig.deliveryZones || [
    { id: 'san-miguel', name: 'San Miguel (Zona Base / Cercana)', fee: 5.00 },
    { id: 'magdalena', name: 'Magdalena del Mar', fee: 6.50 },
    { id: 'pueblo-libre', name: 'Pueblo Libre', fee: 6.50 },
    { id: 'bellavista-laperla', name: 'Bellavista / La Perla (Callao)', fee: 7.50 },
    { id: 'jesus-maria', name: 'Jesús María / Breña', fee: 8.50 },
  ];

  const currentZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeThreshold = storeConfig.freeDeliveryThreshold ?? 60.0;
  const isFreeDelivery = freeThreshold > 0 && cartSubtotal >= freeThreshold;

  const baseZoneFee = currentZone ? currentZone.fee : (storeConfig.deliveryFee ?? 5.00);
  const deliveryFee = fulfillmentMode === 'delivery' ? (isFreeDelivery ? 0.0 : baseZoneFee) : 0.0;
  const cartTotal = cartSubtotal + deliveryFee;
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
          sauceNote: customNote || item.includesSauce,
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
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('carta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddSuperBox = () => {
    const combo = menuItems.find((i) => i.id === 'super-box-50') || menuItems.find((i) => i.category === 'combos');
    if (combo) {
      handleAddToCart(combo);
      setIsCartDrawerOpen(true);
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
    setCheckoutError(null);
    setSunatResult(null);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmProductionOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setCheckoutError('Por favor completa tu nombre y celular de contacto.');
      return;
    }

    if (fulfillmentMode === 'delivery' && !deliveryAddress.trim()) {
      setCheckoutError('Por favor ingresa tu dirección de entrega en San Miguel o distritos de reparto.');
      return;
    }

    if (
      comprobante === 'factura' &&
      (!/^\d{11}$/.test(facturaDetails.ruc) || !facturaDetails.razonSocial.trim() || !facturaDetails.direccionFiscal.trim())
    ) {
      setCheckoutError('Para emitir factura, completa un RUC de 11 dígitos, la razón social y la dirección fiscal.');
      return;
    }

    if (cartTotal <= 0) {
      setCheckoutError('El monto del pedido debe ser mayor que cero.');
      return;
    }

    const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;
    const CulqiCheckout = (window as any).CulqiCheckout;
    if (!publicKey || !CulqiCheckout) {
      setCheckoutError('No se pudo iniciar Culqi. Verifica la llave pública y el script del checkout.');
      return;
    }

    const generatedNumber = `PSM-${Math.floor(1000 + Math.random() * 9000)}`;
    const canPayWithYape = cartTotal <= 2000;
    const options = {
      lang: 'es',
      installments: false,
      modal: true,
      paymentMethods: {
        tarjeta: true,
        yape: canPayWithYape,
        billetera: false,
        bancaMovil: false,
        agente: false,
        cuotealo: false,
      },
      paymentMethodsSort: canPayWithYape ? ['tarjeta', 'yape'] : ['tarjeta'],
    };
    const appearance = {
      buttonCardPayText: `Pagar S/ ${cartTotal.toFixed(2)}`,
      defaultStyle: {
        buttonBackground: '#A20513',
        bannerColor: '#A20513',
      },
    };

    try {
      setIsProcessingPayment(true);
      const orderResponse = await fetch('/api/culqi-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          orderNumber: generatedNumber,
          customerName,
          customerPhone,
        }),
      });
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.orderId) {
        throw new Error(orderResult.error || 'No se pudo preparar la orden de pago con Culqi.');
      }

      const settings = {
        title: 'Piqueos San Miguel',
        currency: 'PEN',
        amount: Math.round(cartTotal * 100),
        order: orderResult.orderId,
      };
      const checkout = new CulqiCheckout(publicKey, { settings, options, appearance });
      checkout.culqi = async () => {
        if (checkout.token?.id) {
          const token = checkout.token;
          checkout.close();
          setIsProcessingPayment(true);
          try {
            const response = await fetch('/api/culqi-charge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: token.id,
                amount: cartTotal,
                email: token.email,
                orderNumber: generatedNumber,
                customerName,
                customerPhone,
              }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
              throw new Error(result.error || 'Culqi no pudo procesar el pago.');
            }

            setCulqiResult(result);
            setOrderNumber(generatedNumber);
            setOrderStage(1);
            setHasActiveOrder(true);
            setIsCheckoutModalOpen(false);
            setIsCartDrawerOpen(false);
            setIsIssuingInvoice(true);
            setCurrentView('tracking');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            try {
              const invoiceResponse = await fetch('/api/emitir-comprobante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderNumber: generatedNumber,
                  comprobante,
                  customerName,
                  customerPhone,
                  customerEmail: token.email || '',
                  facturaDetails,
                  cartItems,
                  total: cartTotal,
                  deliveryFee,
                }),
              });
              const invoiceData = await invoiceResponse.json();
              if (!invoiceResponse.ok || !invoiceData.success) {
                throw new Error(invoiceData.error || invoiceData.warning || 'SUNAT no confirmó la emisión del comprobante.');
              }
              setSunatResult(invoiceData);
            } catch (invoiceError) {
              setSunatResult({
                success: false,
                tipoComprobante: comprobante === 'factura' ? 'Factura Electrónica' : 'Boleta Electrónica',
                serieCorrelativo: '',
                empresa: 'EBYZOM E.I.R.L.',
                rucEmisor: '20614121042',
                direccionEmisor: 'JR. COMANDANTE JUAN GUILLERMO MOORE 296, SAN MIGUEL, LIMA',
                error: invoiceError instanceof Error ? invoiceError.message : 'No se pudo emitir el comprobante.',
              });
            } finally {
              setIsIssuingInvoice(false);
            }
          } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : 'Error al procesar el pago con Culqi.');
          } finally {
            setIsProcessingPayment(false);
          }
        } else if (checkout.error) {
          setCheckoutError(
            checkout.error.user_message || checkout.error.message || 'Culqi no pudo generar el token de pago.'
          );
        }
      };
      checkout.open();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'No se pudo abrir el checkout de Culqi.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (!isCheckoutModalOpen && !isCartDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCheckoutModalOpen, isCartDrawerOpen]);

  const featuredItem = menuItems.find((i) => i.category === 'combos') || menuItems[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8FF] text-[#1B1B21]">
      {/* Top Announcement Bar with Horario and Admin Trigger */}
      <TopAnnouncement
        currentView={currentView}
        setCurrentView={setCurrentView}
        orderNumber={orderNumber}
        hasActiveOrder={hasActiveOrder}
        storeConfig={effectiveStoreConfig}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdmin={handleOpenAdmin}
        onOpenSchedule={() => setIsScheduleModalOpen(true)}
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
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdmin={handleOpenAdmin}
        storeConfig={effectiveStoreConfig}
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
            deliveryFee={deliveryFee}
            deliveryAddress={deliveryAddress}
            customerName={customerName}
            customerPhone={customerPhone}
            paymentMethod="culqi"
            culqiResult={culqiResult}
            sunatResult={sunatResult}
            isIssuingInvoice={isIssuingInvoice}
            comprobante={comprobante}
            facturaDetails={facturaDetails}
            onBackToMenu={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            storeConfig={effectiveStoreConfig}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <HeroBanner
            storeConfig={effectiveStoreConfig}
            onScrollToMenu={handleScrollToMenu}
            onQuickOrder={() => setIsCartDrawerOpen(true)}
            onAddSuperBox={handleAddSuperBox}
            featuredItem={featuredItem}
            onOpenSchedule={() => setIsScheduleModalOpen(true)}
          />

          {/* Sticky Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Main Menu Catalog; the cart is opened only from the cart button */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-12">
            <div className="w-full">
              <MenuCatalog menuItems={menuItems} onAddToCart={handleAddToCart} />
            </div>
          </div>

          {/* Dark Kitchen Details Section */}
          <DarkKitchenSection storeConfig={storeConfig} />
        </main>
      )}

      {/* Mobile Floating Bottom Cart Bar */}
      {currentView === 'menu' && cartCount > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-[#A20513] hover:bg-[#C62828] text-white py-3.5 px-5 rounded-full font-extrabold text-[15px] shadow-2xl flex items-center justify-between active:scale-98 transition-all cursor-pointer"
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

      {/* Tu Pedido Actual: diálogo modal, abierto desde el botón del carrito */}
      {isCartDrawerOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tu Pedido Actual"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCartDrawerOpen(false);
          }}
          className="fixed inset-0 z-[1000] flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        >
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-4 sm:p-6 overflow-y-auto custom-scroll relative rounded-l-3xl">
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="absolute top-4 right-4 text-[#5B403D] hover:text-[#1B1B21] p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
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
                  handleStartCheckout();
                }}
                storeConfig={storeConfig}
                selectedZoneId={selectedZoneId}
                onSelectZone={setSelectedZoneId}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Production Checkout Modal */}
      {isCheckoutModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCheckoutModalOpen(false);
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#E4BEBA]/40 relative flex flex-col gap-4 custom-scroll">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#5B403D] hover:text-[#1B1B21] p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Cerrar pedido"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFDAD6] text-[#A20513] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">shopping_cart_checkout</span>
              </div>
              <div>
                <h3 id="checkout-modal-title" className="text-[18px] font-extrabold text-[#1B1B21]">
                  Confirmar Pedido de Tequeños
                </h3>
                <span className="text-[12px] text-[#5B403D] font-medium">
                  {fulfillmentMode === 'delivery'
                    ? `Entrega Express a Domicilio (${currentZone?.name})`
                    : `Recojo en Dark Kitchen San Miguel`}
                </span>
              </div>
            </div>

            {/* Error Message if any */}
            {checkoutError && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-[12px] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600">error</span>
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Resumen express de productos */}
            <div className="bg-[#F5F2FB] p-3 rounded-2xl border border-[#E4BEBA]/30 text-[12px] flex flex-col gap-1.5">
              <div className="flex justify-between text-[#5B403D] font-bold">
                <span>Subtotal ({cartCount} ítems):</span>
                <span>S/ {cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5B403D]">
                <span>
                  {fulfillmentMode === 'delivery'
                    ? `Envío (${currentZone?.name}):`
                    : 'Modalidad:'}
                </span>
                <span className={isFreeDelivery ? 'text-emerald-700 font-extrabold' : 'font-medium'}>
                  {fulfillmentMode === 'delivery'
                    ? isFreeDelivery
                      ? '¡GRATIS!'
                      : `S/ ${deliveryFee.toFixed(2)}`
                    : 'Recojo en Local (S/ 0.00)'}
                </span>
              </div>
              <div className="flex justify-between text-[#1B1B21] font-black pt-1 border-t border-[#E4BEBA]/40 text-[13px]">
                <span>Total a Pagar:</span>
                <span className="text-[#A20513] text-[15px]">S/ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmProductionOrder} className="flex flex-col gap-4">
              {/* Sección 1: Datos de Contacto y Entrega */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#A20513]">person</span>
                  Tus Datos de Contacto
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5B403D] mb-1">
                      Nombre y Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Carlos Mendoza"
                      className="w-full text-[12px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5B403D] mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej: 987 654 321"
                      className="w-full text-[12px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                    />
                  </div>
                </div>

                {fulfillmentMode === 'delivery' && (
                  <div className="flex flex-col gap-2">
                    {/* District / Zone Selector inside Checkout */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#5B403D] mb-1">
                        Distrito / Zona de Entrega (Tarifa de Envío)
                      </label>
                      <select
                        value={selectedZoneId}
                        onChange={(e) => setSelectedZoneId(e.target.value)}
                        className="w-full text-[12px] p-2.5 rounded-xl border border-[#E4BEBA] bg-white font-medium"
                      >
                        {deliveryZones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} — {isFreeDelivery ? 'Envío GRATIS' : `S/ ${zone.fee.toFixed(2)}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5B403D] mb-1">
                        Dirección de Entrega Exacta *
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ej: Av. Costanera 1100, Dpto 301, San Miguel"
                        className="w-full text-[12px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5B403D] mb-1">
                        Referencia de la vivienda:
                      </label>
                      <input
                        type="text"
                        value={deliveryReference}
                        onChange={(e) => setDeliveryReference(e.target.value)}
                        placeholder="Ej: Portón blanco, frente al parque San Juan"
                        className="w-full text-[12px] p-2 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 2: Pasarela de pago exclusiva */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E4BEBA]/30">
                <h4 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#A20513]">payments</span>
                  Pasarela de Pago
                </h4>
                <div className="flex items-center gap-3 rounded-2xl border border-[#A20513]/25 bg-red-50 p-3">
                  <span className="material-symbols-outlined text-[24px] text-[#A20513]">verified_user</span>
                  <div>
                    <span className="block text-[13px] font-black text-[#A20513]">Pago seguro con Culqi</span>
                    <span className="text-[11px] text-[#5B403D]">
                      Elige tarjeta o Yape dentro del checkout de Culqi (Yape hasta S/ 2,000). El pedido se confirma cuando el pago sea aprobado.
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección 3: Comprobante SUNAT */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E4BEBA]/30">
                <h4 className="text-[13px] font-bold text-[#1B1B21] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#A20513]">receipt_long</span>
                  Comprobante de Pago SUNAT
                </h4>

                <div className="flex gap-4 text-[12px]">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="comprobante"
                      value="boleta"
                      checked={comprobante === 'boleta'}
                      onChange={() => setComprobante('boleta')}
                      className="text-[#A20513] focus:ring-[#A20513]"
                    />
                    <span>Boleta Electrónica</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="comprobante"
                      value="factura"
                      checked={comprobante === 'factura'}
                      onChange={() => setComprobante('factura')}
                      className="text-[#A20513] focus:ring-[#A20513]"
                    />
                    <span>Factura con RUC</span>
                  </label>
                </div>

                {comprobante === 'factura' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F5F2FB] p-3 rounded-xl border border-[#E4BEBA]/40">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5B403D] mb-1">
                        RUC de la Empresa (11 dígitos):
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{11}"
                        required
                        maxLength={11}
                        value={facturaDetails.ruc}
                        onChange={(e) =>
                          setFacturaDetails({ ...facturaDetails, ruc: e.target.value })
                        }
                        placeholder="20123456789"
                        className="w-full text-[11px] p-2 bg-white rounded-lg border border-[#E4BEBA]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#5B403D] mb-1">
                        Razón Social:
                      </label>
                      <input
                        type="text"
                        required
                        value={facturaDetails.razonSocial}
                        onChange={(e) =>
                          setFacturaDetails({ ...facturaDetails, razonSocial: e.target.value })
                        }
                        placeholder="Mi Empresa S.A.C."
                        className="w-full text-[11px] p-2 bg-white rounded-lg border border-[#E4BEBA]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#5B403D] mb-1">
                        Dirección Fiscal:
                      </label>
                      <input
                        type="text"
                        required
                        value={facturaDetails.direccionFiscal}
                        onChange={(e) =>
                          setFacturaDetails({ ...facturaDetails, direccionFiscal: e.target.value })
                        }
                        placeholder="Dirección registrada de la empresa"
                        className="w-full text-[11px] p-2 bg-white rounded-lg border border-[#E4BEBA]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* El pedido se registra únicamente después de que Culqi apruebe el pago */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full mt-2 bg-[#A20513] hover:bg-[#C62828] text-white py-3.5 px-6 rounded-full font-black text-[14px] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    Procesando pago con Culqi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    Pagar con Culqi (S/ {cartTotal.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Admin Login Modal (Restricted to Owner) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentPassword={adminPassword}
      />

      {/* Admin / Config Modal */}
      <AdminConfigModal
        isOpen={isAdminConfigModalOpen}
        onClose={() => setIsAdminConfigModalOpen(false)}
        onLogout={handleAdminLogout}
        menuItems={menuItems}
        onSaveMenuItems={handleSaveMenuItems}
        storeConfig={storeConfig}
        onSaveStoreConfig={handleSaveStoreConfig}
        onResetToDefaults={handleResetToDefaults}
        currentPassword={adminPassword}
        onUpdatePassword={handleUpdatePassword}
      />

      {/* Schedule & Calendar Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        storeConfig={effectiveStoreConfig}
      />

      {/* Footer */}
      <footer className="bg-[#1B1B21] text-white py-12 border-t border-[#303036] mt-auto print:hidden">
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
            <span
              className={`text-[12px] font-bold flex items-center gap-1 ${
                storeConfig.isOpen ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  storeConfig.isOpen ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              ></span>
              {storeConfig.isOpen ? 'Abierto Ahora' : 'Cerrado Actualmente'} ({storeConfig.scheduleText})
            </span>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Ubicación Dark Kitchen
            </h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              {storeConfig.address}
            </p>
            <p className="text-[12px] text-gray-400 mt-2">
              Ref: {storeConfig.addressRef}
            </p>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Horario & Atención
            </h4>
            <ul className="text-[13px] text-gray-400 space-y-1.5">
              <li>{storeConfig.scheduleText}</li>
              <li className="pt-2 text-white font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">chat</span>
                WhatsApp: {storeConfig.whatsappDisplay}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wider mb-3">
              Legal & Administración
            </h4>
            <ul className="text-[12px] text-gray-400 space-y-1">
              <li>RUC: {storeConfig.ruc}</li>
              <li>Razón Social: {storeConfig.razonSocial}</li>
              <li>Emisión de Boleta y Factura Electrónica SUNAT</li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenAdmin}
                  className="text-gray-400 hover:text-white font-medium cursor-pointer flex items-center gap-1.5 transition-colors text-[12px]"
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  {isAdminAuthenticated ? '👑 Panel del Dueño (Activo)' : 'Acceso Restringido para el Dueño'}
                </button>
              </li>
              {isAdminAuthenticated && (
                <li>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="text-red-400 hover:text-red-300 font-medium cursor-pointer text-[11px] underline"
                  >
                    Cerrar Sesión de Administrador
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pt-6 border-t border-[#303036] flex flex-wrap items-center justify-between gap-4 text-[12px] text-gray-400">
          <span>© {new Date().getFullYear()} Piqueos San Miguel. Todos los derechos reservados.</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleOpenAdmin}
              className="text-gray-400 hover:text-white cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Dueño
            </button>
            <span className="hover:text-white cursor-pointer">Términos del Servicio</span>
            <span className="hover:text-white cursor-pointer">Privacidad de Datos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
