import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, PlusCircle, Calendar, TrendingUp, Shield, LogOut, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar({ className }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/calendar', icon: Calendar, label: 'Calendar' },
        { to: '/sales', icon: TrendingUp, label: 'Sales Entry' },
        { to: '/bills', icon: Receipt, label: 'Bills' },
        { to: '/products', icon: Package, label: 'Products' },
        { to: '/products/new', icon: PlusCircle, label: 'Add Product' },
        { to: '/access-logs', icon: Shield, label: 'Access Logs' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={clsx("bg-gray-900 text-white w-64 min-h-screen flex-shrink-0 flex flex-col", className)}>
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">Catalog App</h1>
                {user && <div className="text-xs text-gray-400 mt-1">Logged in as: {user.username}</div>}
            </div>
            <nav className="p-4 space-y-2 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-red-400 hover:bg-gray-800 hover:text-red-300"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
