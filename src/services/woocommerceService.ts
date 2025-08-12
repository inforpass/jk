import { WooCommerceConfig, WooCommerceProduct } from '../types/api';
import { apiManager } from './apiManager';

class WooCommerceService {
  private getActiveConfig(): WooCommerceConfig | null {
    const config = apiManager.getActiveConfiguration('woocommerce') as WooCommerceConfig;
    return config || null;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const config = this.getActiveConfig();
    if (!config) {
      throw new Error('WooCommerce não está configurado');
    }

    const auth = btoa(`${config.consumerKey}:${config.consumerSecret}`);
    const url = `${config.storeUrl}/wp-json/wc/${config.version}/${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`WooCommerce API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async createProduct(product: WooCommerceProduct): Promise<WooCommerceProduct> {
    return await this.makeRequest('products', 'POST', product);
  }

  async updateProduct(id: number, product: Partial<WooCommerceProduct>): Promise<WooCommerceProduct> {
    return await this.makeRequest(`products/${id}`, 'PUT', product);
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    return await this.makeRequest(`products/${id}`);
  }

  async getProducts(params?: { per_page?: number; page?: number; search?: string }): Promise<WooCommerceProduct[]> {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.makeRequest(`products/${id}`, 'DELETE');
  }

  async getCategories(): Promise<Array<{ id: number; name: string; slug: string }>> {
    return await this.makeRequest('products/categories');
  }

  async uploadMedia(file: File): Promise<{ id: number; source_url: string }> {
    const config = this.getActiveConfig();
    if (!config) {
      throw new Error('WooCommerce não está configurado');
    }

    const formData = new FormData();
    formData.append('file', file);

    const auth = btoa(`${config.consumerKey}:${config.consumerSecret}`);
    const response = await fetch(`${config.storeUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    return response.json();
  }

  async uploadBase64Image(base64Data: string, filename: string): Promise<{ id: number; source_url: string }> {
    const config = this.getActiveConfig();
    if (!config) {
      throw new Error('WooCommerce não está configurado');
    }

    // Convert base64 to blob
    const base64Response = await fetch(`data:image/png;base64,${base64Data}`);
    const blob = await base64Response.blob();
    
    const formData = new FormData();
    formData.append('file', blob, filename);

    const auth = btoa(`${config.consumerKey}:${config.consumerSecret}`);
    const response = await fetch(`${config.storeUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro ao fazer upload da imagem: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  }

  isConfigured(): boolean {
    return this.getActiveConfig() !== null;
  }
}

export const wooCommerceService = new WooCommerceService();