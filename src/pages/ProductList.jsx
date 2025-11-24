import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Trash2, Edit, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import ExportOptionsModal from '../components/ExportOptionsModal';

export default function ProductList() {
    const { products, deleteProduct } = useProducts();
    const [search, setSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [showExportModal, setShowExportModal] = useState(false);

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

    const toggleSelectAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleExportJSON = () => {
        const productsToExport = products.filter(p => selectedProducts.has(p.id));
        if (productsToExport.length === 0) return;

        const dataStr = JSON.stringify(productsToExport, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `products_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = (options) => {
        const productsToExport = products.filter(p => selectedProducts.has(p.id));
        if (productsToExport.length === 0) return;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("Product Catalog Export", 14, 22);
        doc.setFontSize(11);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

        let yPos = 40;
        const pageHeight = doc.internal.pageSize.height;

        productsToExport.forEach((product, index) => {
            // Check if we need a new page (assuming approx 40 units per item)
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            let xOffset = 14;

            // Image
            if (options.image) {
                if (product.image) {
                    try {
                        doc.addImage(product.image, 'JPEG', xOffset, yPos, 30, 20);
                    } catch (e) {
                        console.error("Error adding image to PDF", e);
                        doc.rect(xOffset, yPos, 30, 20); // Placeholder if image fails
                        doc.setFontSize(8);
                        doc.text("No Image", xOffset + 2, yPos + 10);
                    }
                } else {
                    doc.rect(xOffset, yPos, 30, 20); // Placeholder box
                    doc.setFontSize(8);
                    doc.text("No Image", xOffset + 2, yPos + 10);
                }
                xOffset += 35; // Shift text to the right if image is present
            }

            // Text details
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');

            if (options.name) {
                doc.text(`${index + 1}. ${product.name}`, xOffset, yPos + 8);
            }

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');

            let detailsY = yPos + 15;

            if (options.category) {
                doc.text(`Category: ${product.category || 'N/A'}`, xOffset, detailsY);
                xOffset += 50;
            }

            if (options.buyPrice) {
                doc.text(`Buy Price: ${product.buyPrice}`, xOffset, detailsY);
                xOffset += 40;
            }

            if (options.sellPrice) {
                doc.text(`Sell Price: ${product.sellPrice}`, xOffset, detailsY);
                xOffset += 40;
            }

            if (options.description && product.description) {
                detailsY += 7;
                // Reset xOffset for description to align with image or start
                const descX = options.image ? 49 : 14;
                const splitDesc = doc.splitTextToSize(product.description, 180 - (options.image ? 35 : 0));
                doc.text(splitDesc, descX, detailsY);
                yPos += (splitDesc.length * 5);
            }

            yPos += 30; // Move down for next item
        });

        doc.save(`products_export_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="flex gap-2">
                    {selectedProducts.size > 0 && (
                        <>
                            <Button variant="secondary" onClick={handleExportJSON} className="flex items-center gap-2">
                                <Download size={18} />
                                JSON ({selectedProducts.size})
                            </Button>
                            <Button variant="secondary" onClick={() => setShowExportModal(true)} className="flex items-center gap-2">
                                <FileText size={18} />
                                PDF ({selectedProducts.size})
                            </Button>
                        </>
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
                <div className="w-full md:w-64 flex gap-2">
                    <div className="relative flex-1">
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
                    {filteredProducts.length > 0 && (
                        <Button
                            variant="secondary"
                            onClick={toggleSelectAll}
                            className={`whitespace-nowrap ${selectedProducts.size === filteredProducts.length && selectedProducts.size > 0 ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
                        >
                            {selectedProducts.size === filteredProducts.length && selectedProducts.size > 0 ? 'Deselect All' : 'Select All'}
                        </Button>
                    )}
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
                                <div className="text-right">
                                    <span className="font-bold text-green-600 block">₹{product.sellPrice}</span>
                                    {product.profitMargin !== undefined && (
                                        <span className={`text-xs font-medium ${product.profitMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {product.profitMargin}% Markup
                                        </span>
                                    )}
                                </div>
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
            <ExportOptionsModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onConfirm={handleExportPDF}
            />
        </div >
    );
}
