export type Brand = {
  id: string;
  name: string;
  domains: string[];
  defaultLocale: "en" | "zh";
  locales: ("en" | "zh")[];
  paymentProviders: ("creem")[];
};

export const brands: Brand[] = [
  { id: 'default', name: 'Your Brand', domains: ['localhost:3000','127.0.0.1:3000'], defaultLocale: 'en', locales: ['en','zh'], paymentProviders: ['creem'] },
  { id: 'sora2', name: 'Sora 2 AI', domains: ['sora2.com','sora2.video','aisora2.video','www.aisora2.com'], defaultLocale: 'en', locales: ['en','zh'], paymentProviders: ['creem'] },
  { id: 'nanobanana', name: 'Nano Banana', domains: ['nanobanana.ai','nanobanana.app','nanobanana.io','nanobanana.art'], defaultLocale: 'en', locales: ['en','zh'], paymentProviders: ['creem'] },
  { id: 'bananaimage', name: 'Banana image', domains: ['bananaimage.site','www.bananaimage.site'], defaultLocale: 'en', locales: ['en','zh'], paymentProviders: ['creem'] }
];

export type Plan = { id: string; name: string; priceDisplay: string; credits?: number; productId: string; description?: string; popular?: boolean };
export type BrandPricing = { creditPacks: Plan[]; subscriptions?: Plan[] };

export const brandPricing: Record<string, BrandPricing> = {
  default: { creditPacks: [ { id: 'pack-1000', name: 'Credit Pack', priceDisplay: '$5', credits: 1000, productId: 'prod_default_1000', description: 'Good for starters', popular: true } ] },
  sora2:   { creditPacks: [ { id: 'pack-3000', name: '3,000 Credits', priceDisplay: '$49.90', credits: 3000, productId: 'prod_sora2_3000', description: 'Pay as you go', popular: true } ] },
  nanobanana: { creditPacks: [ { id: 'pack-3000', name: '3,000 Credits', priceDisplay: '.90', credits: 3000, productId: 'prod_nb_3000', description: 'Pay as you go', popular: true } ] },
  bananaimage: { creditPacks: [ { id: 'pack-3000', name: '3,000 Credits', priceDisplay: '.90', credits: 3000, productId: 'prod_bananaimage_3000', description: 'Pay as you go', popular: true } ] }
};





