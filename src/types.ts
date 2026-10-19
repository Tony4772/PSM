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
