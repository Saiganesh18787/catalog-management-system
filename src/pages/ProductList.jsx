import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Trash2, Edit } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function ProductList() {
    const { products, deleteProduct } = useProducts();
    const [search, setSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    const [categoryFilter, setCategoryFilter] = useState('');

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (p.category || '').toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const toggleSelect = (id) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedProducts(newSelected);
    };

    const handleExport = () => {
        const productsToExport = products.filter(p => selectedProducts.has(p.id));
        if (productsToExport.length === 0) return;

        const dataStr = JSON.stringify(productsToExport, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "catalog_export.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="flex gap-2">
                    {selectedProducts.size > 0 && (
                        <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
                            <Download size={18} />
                            Export ({selectedProducts.size})
                        </Button>
                    )}
                    <Link to="/products/new">
                        <Button className="flex items-center gap-2">
                            <Plus size={18} />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="Search products by name..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="flex flex-col">
                        <div className="relative aspect-video bg-gray-100">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <input
                                type="checkbox"
                                checked={selectedProducts.has(product.id)}
                                onChange={() => toggleSelect(product.id)}
                                className="absolute top-2 left-2 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                                    <span className="text-sm text-gray-500">{product.category}</span>
                                </div>
                                <span className="font-bold text-green-600">${product.sellPrice}</span>
                            </div>
                            <div className="mt-auto pt-4 flex justify-end gap-2">
                                <Link to={`/products/${product.id}/edit`}>
                                    <Button variant="ghost" className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        <Edit size={18} />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        if (window.confirm('Delete this product?')) deleteProduct(product.id);
                                    }}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No products found. Add one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
