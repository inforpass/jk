import React, { useState, useEffect } from 'react';
import { ShoppingCart, Upload, Package, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { WooCommerceProduct } from '../types/api';
import { wooCommerceService } from '../services/woocommerceService';
import { FormData } from '../types';

interface WooCommerceIntegrationProps {
  formData: FormData;
  onClose: () => void;
}

const WooCommerceIntegration: React.FC<WooCommerceIntegrationProps> = ({ formData, onClose }) => {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WooCommerceProduct | null>(null);

  useEffect(() => {
    if (wooCommerceService.isConfigured()) {
      loadProducts();
      loadCategories();
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await wooCommerceService.getProducts({ per_page: 10 });
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await wooCommerceService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleCreateLogoProduct = () => {
    setEditingProduct(null);
    setShowCreateForm(true);
  };

  const handleEditProduct = (product: WooCommerceProduct) => {
    setEditingProduct(product);
    setShowCreateForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await wooCommerceService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  if (!wooCommerceService.isConfigured()) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              WooCommerce não configurado
            </h3>
            <p className="text-gray-600 mb-4">
              Configure sua integração com WooCommerce no Dashboard de APIs para usar esta funcionalidade.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Integração WooCommerce</h2>
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
          {!showCreateForm ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Produtos de Logo</h3>
                <button
                  onClick={handleCreateLogoProduct}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Criar Produto de Logo
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Sobre a integração</h4>
                <p className="text-blue-800 text-sm">
                  Crie produtos no WooCommerce baseados nos conceitos de logo gerados. 
                  Você pode vender serviços de design de logo, pacotes de identidade visual ou logos prontos.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando produtos...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{product.short_description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold text-green-600">
                              R$ {product.price}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'publish' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status === 'publish' ? 'Publicado' : 'Rascunho'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProduct(product.id!)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum produto encontrado.</p>
                      <p className="text-sm">Crie seu primeiro produto de logo!</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <ProductForm
              product={editingProduct}
              categories={categories}
              formData={formData}
              onSave={async (productData) => {
                try {
                  if (editingProduct) {
                    await wooCommerceService.updateProduct(editingProduct.id!, productData);
                  } else {
                    await wooCommerceService.createProduct(productData);
                  }
                  loadProducts();
                  setShowCreateForm(false);
                  setEditingProduct(null);
                } catch (error) {
                  console.error('Erro ao salvar produto:', error);
                  alert('Erro ao salvar produto');
                }
              }}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingProduct(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface ProductFormProps {
  product: WooCommerceProduct | null;
  categories: Array<{ id: number; name: string; slug: string }>;
  formData: FormData;
  onSave: (product: WooCommerceProduct) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, formData, onSave, onCancel }) => {
  // Generate images array from uploaded images
  const generateImagesFromUploaded = (): Array<{ src: string; alt: string }> => {
    if (!formData.uploadedImages) return [];
    
    return Object.entries(formData.uploadedImages).map(([conceptIndex, imageUrl]) => ({
      src: imageUrl,
      alt: `Logo ${formData.companyName} - Conceito ${parseInt(conceptIndex) + 1}`
    }));
  };

  const [productData, setProductData] = useState<WooCommerceProduct>({
    name: product?.name || `Logo ${formData.companyName}`,
    description: product?.description || generateProductDescription(formData),
    short_description: product?.short_description || `Logo profissional para ${formData.companyName}`,
    price: product?.price || '299.00',
    regular_price: product?.regular_price || '299.00',
    categories: product?.categories || [],
    images: product?.images || generateImagesFromUploaded(),
    status: product?.status || 'draft',
    type: 'simple',
    downloadable: true,
    virtual: true
  });

  // Update images when uploaded images change
  React.useEffect(() => {
    if (!product && formData.uploadedImages) {
      setProductData(prev => ({
        ...prev,
        images: generateImagesFromUploaded()
      }));
    }
  }, [formData.uploadedImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {product ? 'Editar' : 'Criar'} Produto de Logo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Produto
          </label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={productData.price}
            onChange={(e) => setProductData({ 
              ...productData, 
              price: e.target.value,
              regular_price: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição Curta
        </label>
        <textarea
          value={productData.short_description}
          onChange={(e) => setProductData({ ...productData, short_description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição Completa
        </label>
        <textarea
          value={productData.description}
          onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={productData.status}
            onChange={(e) => setProductData({ ...productData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="draft">Rascunho</option>
            <option value="publish">Publicado</option>
            <option value="private">Privado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            onChange={(e) => {
              const categoryId = parseInt(e.target.value);
              const category = categories.find(c => c.id === categoryId);
              if (category) {
                setProductData({
                  ...productData,
                  categories: [{ id: category.id, name: category.name }]
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {productData.images && productData.images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagens do Produto ({productData.images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setProductData({
                      ...productData,
                      images: productData.images.filter((_, i) => i !== index)
                    });
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Imagens geradas automaticamente dos conceitos de logo
          </p>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
        >
          {product ? 'Atualizar' : 'Criar'} Produto
        </button>
      </div>
    </form>
  );
};

function generateProductDescription(formData: FormData): string {
  return `
<h2>Logo Profissional para ${formData.companyName}</h2>

<p><strong>Setor:</strong> ${formData.sector}</p>
<p><strong>Valores transmitidos:</strong> ${formData.values}</p>
<p><strong>Público-alvo:</strong> ${formData.targetAudience}</p>

<h3>O que você recebe:</h3>
<ul>
  <li>3 conceitos únicos de logo</li>
  <li>Arquivos em alta resolução (PNG, JPG, SVG)</li>
  <li>Versões em cores e monocromática</li>
  <li>Manual básico de aplicação</li>
  <li>Suporte pós-venda por 30 dias</li>
</ul>

<h3>Especificações técnicas:</h3>
<ul>
  <li><strong>Cores:</strong> ${formData.preferredColors}</li>
  <li><strong>Estilo:</strong> ${formData.designStyle?.join(', ')}</li>
  <li><strong>Elementos:</strong> ${formData.graphicElements}</li>
</ul>

<p><em>Logo criada especialmente para seu negócio com base em suas preferências e necessidades específicas.</em></p>
  `.trim();
}

export default WooCommerceIntegration;