import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, saveProducts } from '../utils/db';

const ProductContext = createContext();

export function useProducts() {
    return useContext(ProductContext);
}

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    const calculateMargin = (sell, buy) => {
        if (!buy || parseFloat(buy) === 0) return 0;
        const markup = ((parseFloat(sell) - parseFloat(buy)) / parseFloat(buy)) * 100;
        return parseFloat(markup.toFixed(2));
    };

    const addProduct = async (product) => {
        const margin = calculateMargin(product.sellPrice, product.buyPrice);
        const newProduct = {
            ...product,
            profitMargin: margin,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            createdAt: new Date().toISOString()
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const updateProduct = async (id, updates) => {
        const updatedProducts = products.map(p => {
            if (p.id === id) {
                const updatedP = { ...p, ...updates, updatedAt: new Date().toISOString() };
                // Recalculate margin if price changes
                if (updates.sellPrice !== undefined || updates.buyPrice !== undefined) {
                    updatedP.profitMargin = calculateMargin(updatedP.sellPrice, updatedP.buyPrice);
                }
                return updatedP;
            }
            return p;
        });
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const deleteProduct = async (id) => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const importCatalog = async (newProducts) => {
        let added = 0;
        let updated = 0;
        let skipped = 0;

        const productMap = new Map(products.map(p => [p.id, p]));
        const productNames = new Set(products.map(p => p.name.toLowerCase()));

        const finalProducts = [...products];

        for (const newP of newProducts) {
            // Calculate margin for new/updated product
            const margin = calculateMargin(newP.sellPrice, newP.buyPrice);
            const productWithMargin = { ...newP, profitMargin: margin };

            // 1. Check by ID (Update)
            if (productMap.has(newP.id)) {
                const index = finalProducts.findIndex(p => p.id === newP.id);
                if (index !== -1) {
                    finalProducts[index] = { ...finalProducts[index], ...productWithMargin, updatedAt: new Date().toISOString() };
                    updated++;
                }
            }
            // 2. Check by Name (Skip if ID is different but name exists)
            else if (productNames.has(newP.name.toLowerCase())) {
                console.warn(`Skipping duplicate product name: ${newP.name}`);
                skipped++;
            }
            // 3. Add New
            else {
                // Ensure ID exists
                const productToAdd = {
                    ...productWithMargin,
                    id: newP.id || Date.now().toString(36) + Math.random().toString(36).substr(2),
                    createdAt: newP.createdAt || new Date().toISOString()
                };
                finalProducts.push(productToAdd);
                productNames.add(productToAdd.name.toLowerCase()); // Add to set to prevent internal duplicates in the same import
                added++;
            }
        }

        setProducts(finalProducts);
        await saveProducts(finalProducts);

        return { added, updated, skipped };
    };

    const exportCatalog = () => {
        return JSON.stringify(products, null, 2);
    };

    const clearCatalog = async () => {
        setProducts([]);
        await saveProducts([]);
    };

    const value = {
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        importCatalog,
        exportCatalog,
        clearCatalog,
        refreshProducts: loadProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}
