import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBills, saveBills } from '../utils/db';

const BillContext = createContext();

export function useBills() {
    return useContext(BillContext);
}

export function BillProvider({ children }) {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setLoading(true);
        const data = await getBills();
        // Sort by date descending by default
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBills(sortedData);
        setLoading(false);
    };

    const addBill = async (bill) => {
        const newBill = {
            ...bill,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            createdAt: new Date().toISOString()
        };
        const updatedBills = [newBill, ...bills];
        setBills(updatedBills);
        await saveBills(updatedBills);
    };

    const deleteBill = async (id) => {
        const updatedBills = bills.filter(b => b.id !== id);
        setBills(updatedBills);
        await saveBills(updatedBills);
    };

    const updateBill = async (id, updates) => {
        const updatedBills = bills.map(b => b.id === id ? { ...b, ...updates } : b);
        setBills(updatedBills);
        await saveBills(updatedBills);
    };

    const value = {
        bills,
        loading,
        addBill,
        deleteBill,
        updateBill,
        refreshBills: loadBills
    };

    return (
        <BillContext.Provider value={value}>
            {children}
        </BillContext.Provider>
    );
}
