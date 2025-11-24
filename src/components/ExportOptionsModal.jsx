import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ExportOptionsModal({ isOpen, onClose, onConfirm }) {
    const [options, setOptions] = useState({
        image: true,
        name: true,
        category: true,
        buyPrice: true,
        sellPrice: false,
        description: false
    });

    const handleChange = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleConfirm = () => {
        onConfirm(options);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Export Options">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Select the fields you want to include in the PDF export.</p>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.image}
                            onChange={() => handleChange('image')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Product Image</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.name}
                            onChange={() => handleChange('name')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Name</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.category}
                            onChange={() => handleChange('category')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Category</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.buyPrice}
                            onChange={() => handleChange('buyPrice')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Buy Price</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.sellPrice}
                            onChange={() => handleChange('sellPrice')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Sell Price</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.description}
                            onChange={() => handleChange('description')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Description</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Export PDF</Button>
                </div>
            </div>
        </Modal>
    );
}
