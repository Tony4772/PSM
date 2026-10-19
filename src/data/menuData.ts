import { MenuItem } from '../types';

export const ASSETS = {
  logoFull: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk48oJRJB-ScnP0X-F73roM1smdLpcQDpiJVbMty42N5FxaJoiWT-NzAO8oVbAFG-5k-pCYoQygKmBzvZL8QRz3jGgNvRLFjzdBjHBcJlwVT6nXTVa7hQ8kt5Xsnh59IaFOAlUYX2fKUXt3ctA6GAwjw8QuHSrxC-MxRSw5VYJzVWBuiUMb4xaY8KeKXHi3cimgloFqJ0chmc-PXIqHmWLOsuF_GPzA8RkDVKs5JiIFNTd6GnkIaUx_j3csgf_no7wXmc',
  emblem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvK15LbS8CVchnQt8_A3Jt5oBx1vurYNhopLWnzY8M2_w4tCCLElYFM4PlYforxU7JMb969-JQDMYmDQzA5K0NZKZ_Umcci_eo16b-_vOG6WULXDaxx-qGyZEl3a6Hj1xjmZm-dgLVNNUerBv6nikTTNQQdqHfHGxLIxRhEQu8znwIrj1kflMH33n4hpmHq5MUKUjyBRkiKI8eVHZBDiBD7huXPr72vf8Jme9GPtANCLb_UJwY5bYzjLGbNMxiGfEVvRU',
  emblemWatermark: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW0slOc4n42M13xCX9reeek4GCo7SBvyk6s3IZZFCGRrJyYoE6nBAkCKSzXFyRq6eeOx_QYj0OL7_yrVJFC6_k9nLncOgqi5JK5EPGi1FW5yOfTQfmY_awG51aung7NDdX2vwBcfnz5CGHtBOBEs9D1ChD20E73h-pxA8W2iwOpd2aAtTRLs4addp1pAsDsSFsqIN1dd-tTWjxiHyBKQ5obVR2RLvk4E9UjmW4cvPp06u00gemNc86LhJiNZ3k0fclAQ4',
  heroTequenos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdt9D-QRBNLYj4vvPOY6-8kCojZrrfzeFFCelMLq9AhnmoP9nmEhkaXwf5QyM9O1E6iiROKbMhWoSWaGIXz69BKGfl_C9PkYeqVpz-PolwxYMIBy8yAVBrVYkXm-hCiy8-YcZRkQLJC0hBsh1-bfzOresJMHo0Qx230f1lqJykT-PkAJkjViX31RL8jUMoC8bkEZ-NyaNPt8wDGh3xfYHSFF5MA1qQBh-_Y38VujICGJG_-UYwDx8o-w',
  tequenosQueso: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1E7BW-cXTOEenbsRz1ksRvZimPBlHbU2nsg9fDTSU-zjrrm4Ali3WYdsz-bH7Tk850svfqYk5w8xtM_DOJcTyBFuu6gxBsBhhqfwIWHY8jYcBR00DqIypNQDWi0g_fe2ruaiHdFEU8ZdR7bXStWQhK0CUtdhh88KsUCjPS1wUHljbOS2VdixE-M07dayr8msC6t_YSXfOC2DMXwv6CpE_YmTv0isNJWLEyAp2xjUQoEiM5me3evgmIA',
  tequenosMixtos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqdTj_7WNIJB8Gc6E6DOGYUJJFoTAtrHZfrn5egEvaXI8QUEUhzJ_adwPiM0EeyaZ7mbY_09RBxE1ljHkbNfbkjByz8zW_T5myp8Fn5Py75VE5Qz6wtFN2Xx_gLy1TzKaPzngBiySE9i7BSU403-nQzYT4GN0sVJ-tYKqDJ7qIdsRE9loHL6tVdidiyioRuKXcPPFu1w4bKb-l9JkpwnnV9r7EjCMCLPWb1v_7QhqufI34ssijPMj5Fw',
  lomoSaltado: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEu2zbrYeWzShJLx4nDFc9zovaaOmgj4nrYphdd2HqcEZ9Jh0fLhFl4LYo46IVNb4IuWDbJnry2GqMimRU3uAiQhbxsG_5NoQgHveaWp0og23IoRY68ST8EtHPFGxAu0Feghp4xWSVaGyvZ17iQOwLceIoCDU4-wenv3byMHaPjFlNTWo07-RGKdOYkl39j5WyM0eqUGvgZaEYhff-v15BKi7MTvsxd_dDTe2Qpb_O2u9G90vd8cKbTA',
  ajiGallina: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdwNsGLajTrb8KB7eHPNZ2vqbUGz9DCLo_0yFa9A1ZObJhUHdExhmkCPmx5bHdtTWa7n59mkhfGmgtadLTRU-sL4qEG2gaMxLAE0fii7iCE92mLLXJWSfxnbZR_vPhuCfYapP5bqP33vLg7w5ykHzupgjGr0miUGZZo-rvjco3jy_fNFsHXLwAnlBfsvkCJnlhmdeBDATgPXo7q1dMj2YMg7rsk54pSNICwhPg-UApgDPtdqESQcGwYQ',
  polloBrasa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp7uHGp12RPLUHWT7Y3l207P8ORbs-0va5-C39IGI-VzQH573GlvD3C6-PeUhdLEUnaZEhFfTKs_Jbvuf2DgMYPhiHameOnT9iRXWw6qp56UfbYcj7VA7dmKKEOI8hq9CXRsap7mjge8I5m28IyWARO9EWx_VXjANBrngU7_Y8mqs_Ziv0o0WV3avB8Xx5ATZKqhL12wqKR53wouxL763dbGMiEb0jRfpv9YUKeGqDZk5WN0gzhUN0rQ',
  superBoxPromo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-S4FV05vY08NJJwzt9wmwR7Av_cXXmMXLbj8gr1sr5mPiG4y3_Ls76djWlSTU--mFquwNYA_4o26Ok4BhXJ14JmL4KXtenDMGuRbNu51k8lx7HUaD_94W-mxaSiQFFNJvuP9jfQKI5zESJMgkoRPJhWb9W2oif3j7bTQ6E5hoPJeIHX0vyJL_pheuxAFb3QXaxL0ovgic-1QqQoBOC3MPAJ-8PFtLZ6iXS2MBpdaeRbExdYOCzhx3aw',
  superBoxTracking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl0Bcyl2Awz93jZtO0EMAf-m-_QA2CP2lbjnPTAamP8flg9VqlMgOKNnGbzcwtGu0GaEJiyx9PJXhNnZbwYjG343Myj4uQOw2OqRI8xIshKPf4c_Y4P0GzcV2NTFVapZgO6jWIhzFDOKnW5-hE1qEL7fOt8p7v8bmm9Krd3JUGmKaDR7aZWqHSZE91atgmLGHnRFFuaidE4kqVLcrepRGE8QF1QhSil91w1LMIUPp2VXSGQj29DuZwyg',
  chichaMorada: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdHBtPTOZDHy4j6Z7JFxsBOsPbVYnCkGNqg6FOC9w9s4ke-DBcrepTgSlJ1HybFApNQm-uS1pHeLM6Ote-ahaz0UhCqH2pozMlY7E6RyWsBaifK-8IaEYN0fb-TCj4-QoZWqFtT8Uf77f_zfaGc4YdIuQy95DnO3KKjm_adgJjTM1PY3mMc9mfhVwMD4av0wtUi8j4wyEZ8UK1wulj_Jb_BFeQ3nWWcBSIccqj93wOj3YpZ9YI1ldkEg',
  driverCarlos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebrLivWBJolX7aIsuDbaowvoThx2BcORLFh9stl0zU_zzZtA-Y_IYPgp0I9iPhipb58eeXFK59cauALHtKjPI7z8qgM2acdyHBCM9WR38lbOxW2VHluwHiLZgvORTWWoLM2uv59WQMVJ8M2VLpSr3ovGABClSr9rVYBRJpFDo7ObG7oFy3-XltEuOu6OjwqKj5tBvk-suuukPdD3rf9_b38_FZWKYl8d745QEJ2qZ-HSDhJAlPpbhKw',
};

export const MENU_ITEMS: MenuItem[] = [
  // 1. Tequeños Tradicionales
  {
    id: 'tequenos-queso',
    name: 'Tequeños Clásicos de Queso',
    category: 'tradicionales',
    description: 'Masa wantán artesanal frita al punto dorado crocante, generosamente rellena de queso andino fresco fundente.',
    image: ASSETS.tequenosQueso,
    badge: 'Incluye Guacamole',
    badgeType: 'tertiary',
    portions: [
      { label: '12 unid · S/ 18', units: 12, price: 18.00 },
      { label: '24 unid · S/ 32', units: 24, price: 32.00 },
      { label: '50 unid · S/ 58', units: 50, price: 58.00 }
    ],
    price: 18.00,
    unitLabel: 'Desde'
  },
  {
    id: 'tequenos-mixtos',
    name: 'Tequeños Mixtos San Miguel',
    category: 'tradicionales',
    description: '12 clásicos de queso fundente + 12 lomo saltado criollo. Acompañado de doble porción de cremas de la casa.',
    image: ASSETS.tequenosMixtos,
    badge: 'Combo Dúo',
    badgeType: 'secondary',
    price: 44.00,
    unitLabel: 'Precio Combo'
  },

  // 2. Tequeños Especiales & Fusión
  {
    id: 'tequenos-lomo-saltado',
    name: 'Tequeños de Lomo Saltado',
    category: 'especiales',
    description: 'Salteado al wok al estilo criollo peruano, jugoso y aromático envuelto en masa wantán crujiente.',
    image: ASSETS.lomoSaltado,
    badge: 'Al Wok',
    badgeType: 'primary',
    portions: [
      { label: '12 unid · S/ 26', units: 12, price: 26.00 },
      { label: '24 unid · S/ 48', units: 24, price: 48.00 }
    ],
    price: 26.00,
    unitLabel: '12 Unid'
  },
  {
    id: 'tequenos-aji-gallina',
    name: 'Tequeños Ají de Gallina',
    category: 'especiales',
    description: 'Relleno cremoso tradicional con pechuga deshilachada, leche evaporada y crema de ají amarillo.',
    image: ASSETS.ajiGallina,
    badge: 'Cremoso',
    badgeType: 'tertiary',
    portions: [
      { label: '12 unid · S/ 24', units: 12, price: 24.00 },
      { label: '24 unid · S/ 44', units: 24, price: 44.00 }
    ],
    price: 24.00,
    unitLabel: '12 Unid'
  },
  {
    id: 'tequenos-pollo-brasa',
    name: 'Tequeños Pollo a la Brasa',
    category: 'especiales',
    description: 'El auténtico sabor brasa deshilachado con toques de chimichurri y queso mozzarella fundente.',
    image: ASSETS.polloBrasa,
    badge: 'Sabor Brasa',
    badgeType: 'secondary',
    portions: [
      { label: '12 unid · S/ 25', units: 12, price: 25.00 },
      { label: '24 unid · S/ 46', units: 24, price: 46.00 }
    ],
    price: 25.00,
    unitLabel: '12 Unid'
  },

  // 3. Mega Boxes & Combos Fiesta
  {
    id: 'super-box-50',
    name: 'Super Box San Miguel (50 Tequeños)',
    category: 'combos',
    description: 'La combinación estelar de la casa: 25 Tequeños de Queso + 15 de Lomo Saltado + 10 de Pollo a la Brasa. Viene acompañado de 3 salsas grandes a elección en potes de 4oz.',
    image: ASSETS.superBoxPromo,
    badge: 'Caja Gigante',
    badgeType: 'primary',
    price: 79.90,
    unitLabel: 'Super Box'
  },

  // 4. Salsas Artesanales & Cremas Extra
  {
    id: 'salsa-guacamole',
    name: 'Guacamole Clásico',
    category: 'salsas',
    description: 'Palta fuerte con limón sutil',
    price: 3.50,
    unitLabel: '4 oz'
  },
  {
    id: 'salsa-huancaina',
    name: 'Huancaína Criolla',
    category: 'salsas',
    description: 'Ají amarillo y queso andino',
    price: 3.50,
    unitLabel: '4 oz'
  },
  {
    id: 'salsa-aji-pollero',
    name: 'Ají Pollero San Miguel',
    category: 'salsas',
    description: 'Picantito con huacatay',
    price: 3.50,
    unitLabel: '4 oz'
  },
  {
    id: 'salsa-rocoto',
    name: 'Crema de Rocoto',
    category: 'salsas',
    description: 'Rocoto ahumado a la leña',
    price: 3.50,
    unitLabel: '4 oz'
  },

  // 5. Bebidas Heladas
  {
    id: 'bebida-chicha',
    name: 'Chicha Morada Casera (1L)',
    category: 'bebidas',
    description: 'Maíz morado, piña, membrillo y canela',
    price: 10.00,
    unitLabel: '1 Litro'
  },
  {
    id: 'bebida-inca-kola',
    name: 'Inca Kola 1.5L Helada',
    category: 'bebidas',
    description: 'Botella pet no retornable',
    price: 8.50,
    unitLabel: '1.5 Litros'
  },
  {
    id: 'bebida-cusquena',
    name: 'Cerveza Cusqueña Trigo',
    category: 'bebidas',
    description: 'Botella 310ml para mayores de 18',
    price: 7.00,
    unitLabel: '310 ml'
  }
];

export const INITIAL_CART_ITEMS = [
  {
    id: 'cart-1',
    menuItemId: 'tequenos-lomo-saltado',
    name: 'Tequeños de Lomo Saltado',
    portionLabel: 'Porción 12 unid + Ají Pollero',
    units: 12,
    price: 26.00,
    quantity: 1
  },
  {
    id: 'cart-2',
    menuItemId: 'tequenos-queso',
    name: 'Tequeños Clásicos de Queso',
    portionLabel: 'Porción 12 unid + Guacamole',
    units: 12,
    price: 18.00,
    quantity: 1
  }
];
