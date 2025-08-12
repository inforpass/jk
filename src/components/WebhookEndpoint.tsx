import React, { useState, useEffect } from 'react';
import { Server, Copy, CheckCircle, AlertCircle, Code, Eye } from 'lucide-react';

interface WebhookEndpointProps {
  onClose: () => void;
}

const WebhookEndpoint: React.FC<WebhookEndpointProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState<'node' | 'php' | 'python'>('node');

  // Simular URL do endpoint local (em produção seria uma URL real)
  const endpointUrl = `${window.location.origin}/api/webhooks/woocommerce`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExamples = {
    node: `// Exemplo de endpoint Node.js/Express
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.post('/api/webhooks/woocommerce', (req, res) => {
  const signature = req.headers['x-wc-webhook-signature'];
  const payload = JSON.stringify(req.body);
  const secret = 'seu_webhook_secret';
  
  // Verificar assinatura
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Unauthorized');
  }
  
  // Processar webhook
  const { topic, resource, event } = req.headers;
  const data = req.body;
  
  console.log(\`Webhook recebido: \${topic}\`, data);
  
  // Sua lógica aqui
  switch (topic) {
    case 'order.created':
      handleNewOrder(data);
      break;
    case 'product.updated':
      handleProductUpdate(data);
      break;
    default:
      console.log('Evento não tratado:', topic);
  }
  
  res.status(200).send('OK');
});

function handleNewOrder(order) {
  // Processar novo pedido
  console.log('Novo pedido:', order.id);
}

function handleProductUpdate(product) {
  // Processar atualização de produto
  console.log('Produto atualizado:', product.id);
}

app.listen(3000, () => {
  console.log('Servidor webhook rodando na porta 3000');
});`,

    php: `<?php
// Exemplo de endpoint PHP
header('Content-Type: application/json');

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Obter dados
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

// Verificar assinatura
$signature = $_SERVER['HTTP_X_WC_WEBHOOK_SIGNATURE'] ?? '';
$secret = 'seu_webhook_secret';
$expected_signature = base64_encode(hash_hmac('sha256', $payload, $secret, true));

if ($signature !== $expected_signature) {
    http_response_code(401);
    exit('Unauthorized');
}

// Obter headers do webhook
$topic = $_SERVER['HTTP_X_WC_WEBHOOK_TOPIC'] ?? '';
$resource = $_SERVER['HTTP_X_WC_WEBHOOK_RESOURCE'] ?? '';
$event = $_SERVER['HTTP_X_WC_WEBHOOK_EVENT'] ?? '';

// Log do webhook
error_log("Webhook recebido: $topic");

// Processar webhook
switch ($topic) {
    case 'order.created':
        handleNewOrder($data);
        break;
    case 'product.updated':
        handleProductUpdate($data);
        break;
    default:
        error_log("Evento não tratado: $topic");
}

function handleNewOrder($order) {
    // Processar novo pedido
    error_log("Novo pedido: " . $order['id']);
    
    // Sua lógica aqui
    // Exemplo: enviar email, atualizar sistema externo, etc.
}

function handleProductUpdate($product) {
    // Processar atualização de produto
    error_log("Produto atualizado: " . $product['id']);
    
    // Sua lógica aqui
}

// Responder com sucesso
http_response_code(200);
echo json_encode(['status' => 'success']);
?>`,

    python: `# Exemplo de endpoint Python/Flask
from flask import Flask, request, jsonify
import hmac
import hashlib
import base64
import json

app = Flask(__name__)

@app.route('/api/webhooks/woocommerce', methods=['POST'])
def webhook_handler():
    # Verificar assinatura
    signature = request.headers.get('X-WC-Webhook-Signature', '')
    payload = request.get_data()
    secret = 'seu_webhook_secret'
    
    expected_signature = base64.b64encode(
        hmac.new(
            secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).digest()
    ).decode('utf-8')
    
    if signature != expected_signature:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Obter dados do webhook
    data = request.get_json()
    topic = request.headers.get('X-WC-Webhook-Topic', '')
    resource = request.headers.get('X-WC-Webhook-Resource', '')
    event = request.headers.get('X-WC-Webhook-Event', '')
    
    print(f"Webhook recebido: {topic}")
    
    # Processar webhook
    if topic == 'order.created':
        handle_new_order(data)
    elif topic == 'product.updated':
        handle_product_update(data)
    else:
        print(f"Evento não tratado: {topic}")
    
    return jsonify({'status': 'success'}), 200

def handle_new_order(order):
    """Processar novo pedido"""
    print(f"Novo pedido: {order['id']}")
    
    # Sua lógica aqui
    # Exemplo: enviar notificação, atualizar estoque, etc.

def handle_product_update(product):
    """Processar atualização de produto"""
    print(f"Produto atualizado: {product['id']}")
    
    # Sua lógica aqui

if __name__ == '__main__':
    app.run(debug=True, port=3000)`
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Endpoint para Webhooks</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* URL do Endpoint */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">URL do Endpoint</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-800">{endpointUrl}</code>
                  <button
                    onClick={() => copyToClipboard(endpointUrl)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Use esta URL ao configurar webhooks no WooCommerce
              </p>
            </div>

            {/* Headers Importantes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Headers do Webhook</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>X-WC-Webhook-Topic:</strong> Tópico do evento (ex: order.created)</div>
                  <div><strong>X-WC-Webhook-Resource:</strong> Recurso afetado (ex: order)</div>
                  <div><strong>X-WC-Webhook-Event:</strong> Tipo de evento (ex: created)</div>
                  <div><strong>X-WC-Webhook-Signature:</strong> Assinatura HMAC-SHA256</div>
                  <div><strong>X-WC-Webhook-ID:</strong> ID do webhook</div>
                  <div><strong>X-WC-Webhook-Delivery-ID:</strong> ID único da entrega</div>
                </div>
              </div>
            </div>

            {/* Exemplos de Código */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Exemplos de Implementação</h3>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {Object.keys(codeExamples).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedExample(lang as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedExample === lang
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Código */}
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedExample]}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedExample])}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Copiar código"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Dicas de Segurança */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Dicas de Segurança
              </h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Sempre verifique a assinatura HMAC-SHA256 para validar a autenticidade</li>
                <li>• Use HTTPS para proteger os dados em trânsito</li>
                <li>• Implemente rate limiting para evitar spam</li>
                <li>• Registre todos os webhooks recebidos para auditoria</li>
                <li>• Responda rapidamente (dentro de 5 segundos) para evitar reenvios</li>
                <li>• Implemente idempotência para lidar com webhooks duplicados</li>
              </ul>
            </div>

            {/* Testando Webhooks */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Testando Webhooks
              </h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Use ferramentas como ngrok para expor seu servidor local</li>
                <li>• Teste com diferentes tipos de eventos (criar, atualizar, excluir)</li>
                <li>• Verifique os logs do WooCommerce em Sistema → Status → Logs</li>
                <li>• Use o botão "Testar" no gerenciador de webhooks</li>
                <li>• Monitore as entregas na aba "Logs" do gerenciador</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookEndpoint;