import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Card({ children, className, ...props }) {
    return (
        <div className={twMerge("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}
