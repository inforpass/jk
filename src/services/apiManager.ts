import { ApiConfig, WooCommerceConfig, StabilityConfig, OpenAIConfig } from '../types/api';

class ApiManager {
  private configs: Map<string, ApiConfig> = new Map();
  private storageKey = 'api_configurations';

  constructor() {
    this.loadConfigurations();
  }

  private loadConfigurations() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const configs = JSON.parse(stored);
        configs.forEach((config: ApiConfig) => {
          this.configs.set(config.id, config);
        });
      }
    } catch (error) {
      console.error('Error loading API configurations:', error);
    }
  }

  private saveConfigurations() {
    try {
      const configs = Array.from(this.configs.values());
      localStorage.setItem(this.storageKey, JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving API configurations:', error);
    }
  }

  addConfiguration(config: ApiConfig): void {
    this.configs.set(config.id, config);
    this.saveConfigurations();
  }

  updateConfiguration(id: string, updates: Partial<ApiConfig>): void {
    const existing = this.configs.get(id);
    if (existing) {
      this.configs.set(id, { ...existing, ...updates });
      this.saveConfigurations();
    }
  }

  removeConfiguration(id: string): void {
    this.configs.delete(id);
    this.saveConfigurations();
  }

  getConfiguration(id: string): ApiConfig | undefined {
    return this.configs.get(id);
  }

  getAllConfigurations(): ApiConfig[] {
    return Array.from(this.configs.values());
  }

  getConfigurationsByType(type: ApiConfig['type']): ApiConfig[] {
    return Array.from(this.configs.values()).filter(config => config.type === type);
  }

  getActiveConfiguration(type: ApiConfig['type']): ApiConfig | undefined {
    return Array.from(this.configs.values()).find(config => config.type === type && config.isActive);
  }

  async testConnection(config: ApiConfig): Promise<boolean> {
    try {
      switch (config.type) {
        case 'stability':
          return await this.testStabilityConnection(config as StabilityConfig);
        case 'woocommerce':
          return await this.testWooCommerceConnection(config as WooCommerceConfig);
        case 'openai':
          return await this.testOpenAIConnection(config as OpenAIConfig);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error testing ${config.type} connection:`, error);
      return false;
    }
  }

  private async testStabilityConnection(config: StabilityConfig): Promise<boolean> {
    try {
      const response = await fetch('https://api.stability.ai/v1/user/account', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testWooCommerceConnection(config: WooCommerceConfig): Promise<boolean> {
    try {
      const auth = btoa(`${config.consumerKey}:${config.consumerSecret}`);
      const response = await fetch(`${config.storeUrl}/wp-json/wc/${config.version}/system_status`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testOpenAIConnection(config: OpenAIConfig): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiManager = new ApiManager();