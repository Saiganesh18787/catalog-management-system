import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Dashboard() {
    const { products } = useProducts();
    const { getMonthlyStats } = useSales();

    const monthlyStats = useMemo(() => {
        const now = new Date();
        return getMonthlyStats(now.getMonth(), now.getFullYear());
    }, [getMonthlyStats]);

    const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

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
                                        <p className="font-medium text-gray-900">${product.sellPrice}</p>
                                        <p className="text-xs text-green-600">
                                            +${(product.sellPrice - product.buyPrice).toFixed(2)}
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
        </div>
    );
}

function StatCard({ title, value, subValue, icon: Icon, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <Card className="p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                {subValue && <p className="text-sm text-green-600 mt-1">{subValue}</p>}
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
        </Card>
    );
}
