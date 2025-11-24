/**
 * Calculate storage size of data in bytes
 */
export const calculateSize = (data) => {
    if (!data) return 0;
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString]).size;
};

/**
 * Format bytes to human-readable format
 */
export const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculate storage usage for all app data
 */
export const calculateStorageUsage = async () => {
    const { getProducts } = await import('./db');
    const { getBills } = await import('./db');

    try {
        // Get data from IndexedDB
        const products = await getProducts();
        const bills = await getBills();

        // Get sales and logs from localStorage (fallback)
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        const accessLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');

        // Calculate sizes
        const productsSize = calculateSize(products);
        const billsSize = calculateSize(bills);
        const salesSize = calculateSize(sales);
        const logsSize = calculateSize(accessLogs);
        const totalSize = productsSize + billsSize + salesSize + logsSize;

        return {
            products: { size: productsSize, count: products.length },
            bills: { size: billsSize, count: bills.length },
            sales: { size: salesSize, count: sales.length },
            logs: { size: logsSize, count: accessLogs.length },
            total: totalSize
        };
    } catch (error) {
        console.error('Error calculating storage:', error);
        return {
            products: { size: 0, count: 0 },
            bills: { size: 0, count: 0 },
            sales: { size: 0, count: 0 },
            logs: { size: 0, count: 0 },
            total: 0
        };
    }
};
