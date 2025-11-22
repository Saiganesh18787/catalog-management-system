import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Upload } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import Input from '../components/Input';
import CameraCapture from '../components/CameraCapture';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buyPrice: '',
    sellPrice: '',
    category: '',
    image: null
  });

  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(product);
      }
    }
  }, [id, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.buyPrice) newErrors.buyPrice = "Buy price is required";
    if (!formData.sellPrice) newErrors.sellPrice = "Sell price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      ...formData,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: parseFloat(formData.sellPrice)
    };

    if (id) {
      await updateProduct(id, productData);
    } else {
      await addProduct(productData);
    }
    navigate('/products');
  };

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={(image) => {
          setFormData(prev => ({ ...prev, image }));
          setShowCamera(false);
        }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/products')} className="p-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Image Section */}
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          {formData.image ? (
            <div className="relative w-full aspect-video max-w-sm rounded-lg overflow-hidden">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <ArrowLeft size={16} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Camera size={48} className="mb-2" />
              <p>No image selected</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" onClick={() => setShowCamera(true)} className="flex items-center gap-2">
              <Camera size={18} />
              Take Photo
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Upload size={18} />
                Upload
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Wireless Headphones"
            />

            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              list="categories"
            />
            <datalist id="categories">
              {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Buy Price (₹)"
              name="buyPrice"
              type="number"
              step="0.01"
              value={formData.buyPrice}
              onChange={handleChange}
              error={errors.buyPrice}
              placeholder="0.00"
            />

            <Input
              label="Sell Price (₹)"
              name="sellPrice"
              type="number"
              step="0.01"
              value={formData.sellPrice}
              onChange={handleChange}
              error={errors.sellPrice}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter product details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save size={18} />
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
