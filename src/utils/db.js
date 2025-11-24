import localforage from 'localforage';

// Initialize localforage
const db = localforage.createInstance({
    name: 'CatalogApp',
    storeName: 'products'
});

export const getProducts = async () => {
    try {
        const products = await db.getItem('all_products');
        return products || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const saveProducts = async (products) => {
    try {
        await db.setItem('all_products', products);
    } catch (error) {
        console.error('Error saving products:', error);
    }
};

export const clearProducts = async () => {
    try {
        await db.clear();
    } catch (error) {
        console.error('Error clearing products:', error);
    }
};

export const getSales = async () => {
    try {
        const sales = await db.getItem('daily_sales');
        return sales || {};
    } catch (error) {
        console.error('Error fetching sales:', error);
        return {};
    }
};

export const saveSales = async (sales) => {
    try {
        await db.setItem('daily_sales', sales);
    } catch (error) {
        console.error('Error saving sales:', error);
    }
};

export const getSettings = async () => {
    try {
        const settings = await db.getItem('app_settings');
        return settings || { profitMargin: 35, monthlyExpenses: 160000 };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { profitMargin: 35, monthlyExpenses: 160000 };
    }
};

export const saveSettings = async (settings) => {
    try {
        await db.setItem('app_settings', settings);
    } catch (error) {
        console.error('Error saving settings:', error);
    }
};

export const getEvents = async () => {
    try {
        const events = await db.getItem('calendar_events');
        return events || {};
    } catch (error) {
        console.error('Error fetching events:', error);
        return {};
    }
};

export const saveEvents = async (events) => {
    try {
        await db.setItem('calendar_events', events);
    } catch (error) {
        console.error('Error saving events:', error);
    }
};

export const getAccessLogs = async () => {
    try {
        const logs = await db.getItem('access_logs');
        return logs || [];
    } catch (error) {
        console.error('Error fetching access logs:', error);
        return [];
    }
};

export const saveAccessLog = async (log) => {
    try {
        const logs = await getAccessLogs();
        const newLogs = [log, ...logs];
        await db.setItem('access_logs', newLogs);
    } catch (error) {
        console.error('Error saving access log:', error);
    }
};

export const getBills = async () => {
    try {
        const bills = await db.getItem('bills');
        return bills || [];
    } catch (error) {
        console.error('Error fetching bills:', error);
        return [];
    }
};

export const saveBills = async (bills) => {
    try {
        await db.setItem('bills', bills);
    } catch (error) {
        console.error('Error saving bills:', error);
    }
};

export default db;
