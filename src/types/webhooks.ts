export interface WebhookEvent {
  id: string;
  event: string;
  created_at: string;
  resource: string;
  event_id: number;
  topic: string;
  payload: any;
}

export interface WebhookConfig {
  id?: number;
  name: string;
  status: 'active' | 'paused' | 'disabled';
  topic: WebhookTopic;
  delivery_url: string;
  secret?: string;
  date_created?: string;
  date_modified?: string;
}

export type WebhookTopic = 
  | 'order.created'
  | 'order.updated' 
  | 'order.deleted'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'coupon.created'
  | 'coupon.updated'
  | 'coupon.deleted';

export interface WebhookLog {
  id: string;
  webhook_id: number;
  topic: string;
  resource: string;
  event: string;
  delivery_id: string;
  delivery_url: string;
  date_created: string;
  status: 'success' | 'failed' | 'pending';
  response_code?: number;
  response_message?: string;
  payload: any;
}

export interface WebhookStats {
  total_webhooks: number;
  active_webhooks: number;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  success_rate: number;
}