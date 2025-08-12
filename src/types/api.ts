export interface ApiConfig {
  id: string;
  name: string;
  type: 'stability' | 'openai' | 'woocommerce';
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
  lastTested?: Date;
  status: 'connected' | 'disconnected' | 'error';
}

export interface WooCommerceConfig extends ApiConfig {
  type: 'woocommerce';
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}

export interface StabilityConfig extends ApiConfig {
  type: 'stability';
  model: string;
}

export interface OpenAIConfig extends ApiConfig {
  type: 'openai';
  model: string;
  organization?: string;
}

export interface WooCommerceProduct {
  id?: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  categories: Array<{ id: number; name: string }>;
  images: Array<{ src: string; alt: string }>;
  status: 'draft' | 'pending' | 'private' | 'publish';
  type: 'simple' | 'grouped' | 'external' | 'variable';
  downloadable: boolean;
  virtual: boolean;
  meta_data?: Array<{ key: string; value: any }>;
}