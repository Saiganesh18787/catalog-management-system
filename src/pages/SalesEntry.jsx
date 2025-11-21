import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import Button from '../components/Button';

export default function SalesEntry() {
    const { salesData, updateDailySales } = useSales();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState([]);

    useEffect(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        setDays(eachDayOfInterval({ start, end }));
    }, [currentMonth]);

    const handleSalesChange = (date, value) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        updateDailySales(dateStr, value);
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleExport = () => {
        // Convert sales data to CSV
        const headers = ['Date', 'Day', 'Sales Amount'];
        const rows = days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const sales = salesData[dateStr]?.sales || 0;
            return [
                format(day, 'yyyy-MM-dd'),
                format(day, 'EEEE'),
                sales
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `sales_report_${format(currentMonth, 'yyyy_MM')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Daily Sales Entry</h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={prevMonth}><ChevronLeft /></Button>
                    <span className="text-lg font-semibold w-32 text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <Button variant="ghost" onClick={nextMonth}><ChevronRight /></Button>
                </div>
                <Button onClick={handleExport} variant="secondary" className="flex items-center gap-2">
                    <Download size={20} />
                    Export Report
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Day</th>
                                <th className="p-4 font-semibold text-gray-600">Daily Sales (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const sales = salesData[dateStr]?.sales || '';
                                return (
                                    <tr key={dateStr} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 text-gray-900">{format(day, 'dd MMM yyyy')}</td>
                                        <td className="p-4 text-gray-500">{format(day, 'EEEE')}</td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                                value={sales}
                                                onChange={(e) => handleSalesChange(day, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
