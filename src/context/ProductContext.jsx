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

    const addProduct = async (product) => {
        const newProduct = {
            ...product,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            createdAt: new Date().toISOString()
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const updateProduct = async (id, updates) => {
        const updatedProducts = products.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const deleteProduct = async (id) => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const importCatalog = async (newProducts) => {
        // Merge or replace? For now, let's append or replace. 
        // User requirement: "import from JSON".
        // We'll append new ones, maybe check for duplicates by ID if they exist.
        // But for simplicity, let's just append.
        const updatedProducts = [...products, ...newProducts];
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
    };

    const value = {
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        importCatalog,
        refreshProducts: loadProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}
