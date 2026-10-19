export interface PortionOption {
  label: string;
  units: number;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'tradicionales' | 'especiales' | 'combos' | 'salsas' | 'bebidas';
  description: string;
  image?: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'tertiary' | 'emerald';
  includesSauce?: string;
  portions?: PortionOption[];
  price: number; // base price
  unitLabel?: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  portionLabel?: string;
  units?: number;
  sauceNote?: string;
  price: number;
  quantity: number;
}

export type FulfillmentMode = 'delivery' | 'pickup';
export type ComprobanteType = 'boleta' | 'factura';

export interface FacturaDetails {
  ruc: string;
  razonSocial: string;
  direccionFiscal: string;
}

export type OrderStage = 1 | 2 | 3 | 4 | 5; // 1: Pagado, 2: Fritura, 3: Empaque, 4: En Camino, 5: Entregado

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
  dayName: string; // 'Lunes', 'Martes', etc.
  isOpen: boolean; // Si la cocina atiende este día
  openTime: string; // Selector de hora: "16:30" (formato 24h)
  closeTime: string; // Selector de hora: "23:30" (formato 24h)
}

export interface SpecialDateSchedule {
  id: string;
  date: string; // Selector de fecha: "YYYY-MM-DD"
  note: string; // Ej: "Feriado 28 de Julio", "Día de la Madre", "Mantenimiento"
  isClosed: boolean; // Si está cerrado todo el día en esta fecha
  openTime?: string; // Selector de hora si abre con horario especial
  closeTime?: string; // Selector de hora si abre con horario especial
}

export type ScheduleMode = 'auto' | 'manual_open' | 'manual_closed';

export interface StoreConfig {
  scheduleText: string;
  isOpen: boolean;
  scheduleMode?: ScheduleMode; // 'auto' (evalúa según día, hora y excepciones) | 'manual_open' | 'manual_closed'
  weeklySchedule: DaySchedule[]; // Configuración por día independiente con selector de hora
  specialDates?: SpecialDateSchedule[]; // Excepciones por fecha con selector de fecha
  deliveryTimeEstimate: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number; // e.g. 60 (orders >= 60 get free delivery)
  deliveryZones: DeliveryZone[];
  address: string;
  addressRef: string;
  mapsUrl: string;
  whatsappPhone: string;
  whatsappDisplay: string;
  ruc: string;
  razonSocial: string;
  yapePhone: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage: string;
}

export interface SunatComprobanteResult {
  tipoComprobante: string;
  serieCorrelativo: string;
  empresa: string;
  rucEmisor: string;
  direccionEmisor: string;
  xml?: string;
  hash?: string;
  montoTotal?: number;
  mode?: string;
}

export interface CulqiPaymentResult {
  chargeId: string;
  amount: number;
  currency: string;
  referenceCode?: string;
}



