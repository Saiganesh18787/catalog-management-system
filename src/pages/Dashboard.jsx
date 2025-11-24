import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, TrendingUp, AlertCircle, Download, Database, HardDrive } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { calculateStorageUsage, formatBytes } from '../utils/storageCalculator';
import { StatCard, StorageItem } from '../components/DashboardComponents';

export default function Dashboard() {
    const { products } = useProducts();
    const { getMonthlyStats } = useSales();
    const [storageData, setStorageData] = useState(null);

    useEffect(() => {
        const loadStorage = async () => {
            const data = await calculateStorageUsage();
            setStorageData(data);
        };
        loadStorage();
    }, [products]); // Recalculate when products change

    const monthlyStats = useMemo(() => {
        const now = new Date();
        return getMonthlyStats(now.getMonth(), now.getFullYear());
    }, [getMonthlyStats]);

    const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const avgMargin = useMemo(() => {
        if (products.length === 0) return 0;
        const totalMargin = products.reduce((sum, p) => sum + (p.profitMargin || 0), 0);
        return (totalMargin / products.length).toFixed(1);
    }, [products]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales (This Month)"
                    value={`₹${monthlyStats.totalSales.toLocaleString()}`}
                    icon={DollarSign}
                    color="blue"
                />
                <StatCard
                    title="Profits (35%)"
                    value={`₹${monthlyStats.profit.toLocaleString()}`}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Expenses (Fixed)"
                    value={`₹${monthlyStats.expenses.toLocaleString()}`}
                    icon={AlertCircle}
                    color="orange"
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${monthlyStats.netProfit.toLocaleString()}`}
                    subValue={monthlyStats.netProfit > 0 ? "Profitable" : "Loss"}
                    icon={DollarSign}
                    color={monthlyStats.netProfit > 0 ? "green" : "red"}
                />
                <StatCard
                    title="Avg Markup"
                    value={`${avgMargin}%`}
                    subValue="Across all products"
                    icon={TrendingUp}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                        <Link to="/products">
                            <Button variant="ghost" className="text-sm">View All</Button>
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentProducts.length > 0 ? (
                            recentProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{product.sellPrice}</p>
                                        <p className="text-xs text-green-600">
                                            +₹{(product.sellPrice - product.buyPrice).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No products yet.
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Link to="/sales">
                            <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="secondary">
                                <TrendingUp size={24} className="text-purple-600" />
                                <span>Daily Sales</span>
                            </Button>
                        </Link>
                        <Link to="/products/new">
                            <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="secondary">
                                <Package size={24} className="text-blue-600" />
                                <span>Add Product</span>
                            </Button>
                        </Link>
                        <Link to="/settings">
                            <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="secondary">
                                <Download size={24} className="text-green-600" />
                                <span>Export Data</span>
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Storage Usage */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <HardDrive size={20} className="text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Storage Usage</h2>
                    </div>
                    {storageData && (
                        <span className="text-sm font-medium text-gray-600">
                            Total: {formatBytes(storageData.total)}
                        </span>
                    )}
                </div>
                {storageData ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StorageItem
                            label="Products"
                            size={formatBytes(storageData.products.size)}
                            count={storageData.products.count}
                            color="blue"
                        />
                        <StorageItem
                            label="Bills"
                            size={formatBytes(storageData.bills.size)}
                            count={storageData.bills.count}
                            color="green"
                        />
                        <StorageItem
                            label="Sales"
                            size={formatBytes(storageData.sales.size)}
                            count={storageData.sales.count}
                            color="purple"
                        />
                        <StorageItem
                            label="Access Logs"
                            size={formatBytes(storageData.logs.size)}
                            count={storageData.logs.count}
                            color="orange"
                        />
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        Calculating storage...
                    </div>
                )}
            </Card>
        </div>
    );
}
