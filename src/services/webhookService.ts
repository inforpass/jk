import { WebhookConfig, WebhookLog, WebhookStats, WebhookTopic } from '../types/webhooks';
import { wooCommerceService } from './woocommerceService';

class WebhookService {
  private logs: WebhookLog[] = [];
  private storageKey = 'webhook_logs';

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading webhook logs:', error);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving webhook logs:', error);
    }
  }

  async createWebhook(webhook: Omit<WebhookConfig, 'id'>): Promise<WebhookConfig> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      const response = await this.makeRequest('webhooks', 'POST', webhook);
      return response;
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw error;
    }
  }

  async updateWebhook(id: number, webhook: Partial<WebhookConfig>): Promise<WebhookConfig> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      const response = await this.makeRequest(`webhooks/${id}`, 'PUT', webhook);
      return response;
    } catch (error) {
      console.error('Error updating webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(id: number): Promise<void> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      await this.makeRequest(`webhooks/${id}`, 'DELETE');
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw error;
    }
  }

  async getWebhooks(): Promise<WebhookConfig[]> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      const response = await this.makeRequest('webhooks');
      return response;
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      throw error;
    }
  }

  async getWebhook(id: number): Promise<WebhookConfig> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      const response = await this.makeRequest(`webhooks/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching webhook:', error);
      throw error;
    }
  }

  async getWebhookDeliveries(webhookId: number): Promise<any[]> {
    if (!wooCommerceService.isConfigured()) {
      throw new Error('WooCommerce não está configurado');
    }

    try {
      const response = await this.makeRequest(`webhooks/${webhookId}/deliveries`);
      return response;
    } catch (error) {
      console.error('Error fetching webhook deliveries:', error);
      throw error;
    }
  }

  async testWebhook(webhook: WebhookConfig): Promise<boolean> {
    try {
      // Simular um payload de teste
      const testPayload = {
        id: 'test',
        event: 'test',
        created_at: new Date().toISOString(),
        resource: 'test',
        event_id: 0,
        topic: webhook.topic,
        payload: { test: true }
      };

      const response = await fetch(webhook.delivery_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WC-Webhook-Topic': webhook.topic,
          'X-WC-Webhook-Resource': 'test',
          'X-WC-Webhook-Event': 'test',
          'X-WC-Webhook-Signature': webhook.secret ? this.generateSignature(JSON.stringify(testPayload), webhook.secret) : '',
          'X-WC-Webhook-ID': webhook.id?.toString() || '0',
          'X-WC-Webhook-Delivery-ID': Date.now().toString()
        },
        body: JSON.stringify(testPayload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing webhook:', error);
      return false;
    }
  }

  private generateSignature(payload: string, secret: string): string {
    // Simular geração de assinatura HMAC-SHA256
    // Em produção, usar uma biblioteca crypto adequada
    return btoa(`${secret}:${payload.length}`);
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    // Usar o serviço WooCommerce existente para fazer requisições
    const config = (wooCommerceService as any).getActiveConfig();
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

  logWebhookEvent(log: Omit<WebhookLog, 'id'>): void {
    const newLog: WebhookLog = {
      ...log,
      id: Date.now().toString()
    };

    this.logs.unshift(newLog);
    
    // Manter apenas os últimos 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    this.saveLogs();
  }

  getWebhookLogs(webhookId?: number): WebhookLog[] {
    if (webhookId) {
      return this.logs.filter(log => log.webhook_id === webhookId);
    }
    return this.logs;
  }

  clearWebhookLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  async getWebhookStats(): Promise<WebhookStats> {
    try {
      const webhooks = await this.getWebhooks();
      const activeWebhooks = webhooks.filter(w => w.status === 'active').length;
      
      const totalDeliveries = this.logs.length;
      const successfulDeliveries = this.logs.filter(log => log.status === 'success').length;
      const failedDeliveries = this.logs.filter(log => log.status === 'failed').length;
      
      return {
        total_webhooks: webhooks.length,
        active_webhooks: activeWebhooks,
        total_deliveries: totalDeliveries,
        successful_deliveries: successfulDeliveries,
        failed_deliveries: failedDeliveries,
        success_rate: totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting webhook stats:', error);
      return {
        total_webhooks: 0,
        active_webhooks: 0,
        total_deliveries: 0,
        successful_deliveries: 0,
        failed_deliveries: 0,
        success_rate: 0
      };
    }
  }

  getAvailableTopics(): { value: WebhookTopic; label: string; description: string }[] {
    return [
      { value: 'order.created', label: 'Pedido Criado', description: 'Disparado quando um novo pedido é criado' },
      { value: 'order.updated', label: 'Pedido Atualizado', description: 'Disparado quando um pedido é atualizado' },
      { value: 'order.deleted', label: 'Pedido Excluído', description: 'Disparado quando um pedido é excluído' },
      { value: 'product.created', label: 'Produto Criado', description: 'Disparado quando um novo produto é criado' },
      { value: 'product.updated', label: 'Produto Atualizado', description: 'Disparado quando um produto é atualizado' },
      { value: 'product.deleted', label: 'Produto Excluído', description: 'Disparado quando um produto é excluído' },
      { value: 'customer.created', label: 'Cliente Criado', description: 'Disparado quando um novo cliente se registra' },
      { value: 'customer.updated', label: 'Cliente Atualizado', description: 'Disparado quando dados do cliente são atualizados' },
      { value: 'customer.deleted', label: 'Cliente Excluído', description: 'Disparado quando um cliente é excluído' },
      { value: 'coupon.created', label: 'Cupom Criado', description: 'Disparado quando um novo cupom é criado' },
      { value: 'coupon.updated', label: 'Cupom Atualizado', description: 'Disparado quando um cupom é atualizado' },
      { value: 'coupon.deleted', label: 'Cupom Excluído', description: 'Disparado quando um cupom é excluído' }
    ];
  }

  isConfigured(): boolean {
    return wooCommerceService.isConfigured();
  }
}

export const webhookService = new WebhookService();