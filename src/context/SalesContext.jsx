import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSales, saveSales, getSettings, saveSettings, getEvents, saveEvents } from '../utils/db';

const SalesContext = createContext();

export function useSales() {
    return useContext(SalesContext);
}

export function SalesProvider({ children }) {
    const [salesData, setSalesData] = useState({});
    const [settings, setSettings] = useState({ profitMargin: 35, monthlyExpenses: 160000 });
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [sales, appSettings, calendarEvents] = await Promise.all([getSales(), getSettings(), getEvents()]);
            setSalesData(sales || {});
            setSettings(appSettings);
            setEvents(calendarEvents || {});
            setLoading(false);
        };
        loadData();
    }, []);

    const updateDailySales = async (date, amount) => {
        const updatedSales = {
            ...salesData,
            [date]: { ...salesData[date], sales: parseFloat(amount) || 0 }
        };
        setSalesData(updatedSales);
        await saveSales(updatedSales);
    };

    const updateSettings = async (newSettings) => {
        setSettings(newSettings);
        await saveSettings(newSettings);
    };

    const addEvent = async (date, title) => {
        const updatedEvents = {
            ...events,
            [date]: title
        };
        setEvents(updatedEvents);
        await saveEvents(updatedEvents);
    };

    const removeEvent = async (date) => {
        const updatedEvents = { ...events };
        delete updatedEvents[date];
        setEvents(updatedEvents);
        await saveEvents(updatedEvents);
    };

    const getMonthlyStats = (month, year) => {
        let totalSales = 0;
        Object.entries(salesData).forEach(([date, data]) => {
            const d = new Date(date);
            if (d.getMonth() === month && d.getFullYear() === year) {
                totalSales += data.sales || 0;
            }
        });

        const profit = totalSales * (settings.profitMargin / 100);
        const expenses = parseFloat(settings.monthlyExpenses);
        const netProfit = profit - expenses;

        return { totalSales, profit, expenses, netProfit };
    };

    const getAllTimeStats = () => {
        let totalSales = 0;
        Object.values(salesData).forEach(data => {
            totalSales += data.sales || 0;
        });
        const profit = totalSales * (settings.profitMargin / 100);
        return { totalSales, profit };
    };

    return (
        <SalesContext.Provider value={{
            salesData,
            loading,
            settings,
            events,
            updateDailySales,
            updateSettings,
            addEvent,
            removeEvent,
            getMonthlyStats,
            getAllTimeStats
        }}>
            {children}
        </SalesContext.Provider>
    );
}
