import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, PlusCircle, Calendar, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ className }) {
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/calendar', icon: Calendar, label: 'Calendar' },
        { to: '/sales', icon: TrendingUp, label: 'Sales Entry' },
        { to: '/products', icon: Package, label: 'Products' },
        { to: '/products/new', icon: PlusCircle, label: 'Add Product' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className={clsx("bg-gray-900 text-white w-64 min-h-screen flex-shrink-0", className)}>
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">Catalog App</h1>
            </div>
            <nav className="p-4 space-y-2">
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
        </aside>
    );
}
