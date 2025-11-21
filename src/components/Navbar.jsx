import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between md:justify-end">
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
                {/* Add user profile or other actions here if needed */}
                <span className="text-sm text-gray-500">Admin</span>
            </div>
        </header>
    );
}
