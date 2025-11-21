import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import Card from '../components/Card';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, deleteProduct } = useProducts();

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Product not found.</p>
                <Button variant="ghost" onClick={() => navigate('/products')} className="mt-4">
                    Back to Products
                </Button>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(product.id);
            navigate('/products');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/products')} className="p-2">
                        <ArrowLeft size={24} />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                    <Link to={`/products/${product.id}/edit`}>
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Edit size={18} />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="danger" onClick={handleDelete} className="flex items-center gap-2">
                        <Trash2 size={18} />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
                    ) : (
                        <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
                            No Image Available
                        </div>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Buy Price</p>
                                <p className="text-xl font-medium text-gray-900">${product.buyPrice?.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sell Price</p>
                                <p className="text-xl font-bold text-green-600">${product.sellPrice?.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Profit Margin</p>
                            <p className="text-lg font-medium text-blue-600">
                                ${(product.sellPrice - product.buyPrice).toFixed(2)}
                                <span className="text-sm text-gray-400 ml-1">
                                    ({((product.sellPrice - product.buyPrice) / product.sellPrice * 100).toFixed(1)}%)
                                </span>
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 mt-1">
                                {product.category || 'Uncategorized'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-gray-700 mt-1 whitespace-pre-wrap">{product.description || 'No description provided.'}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
