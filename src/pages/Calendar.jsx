import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import Button from '../components/Button';

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const { events, addEvent, removeEvent } = useSales();

    useEffect(() => {
        const fetchHolidays = async () => {
            const year = currentMonth.getFullYear();
            try {
                const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`);
                if (response.ok) {
                    const data = await response.json();
                    setHolidays(data);
                }
            } catch (error) {
                console.error("Failed to fetch holidays", error);
            }
        };
        fetchHolidays();
    }, [currentMonth]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getHolidayForDate = (date) => {
        return holidays.find(h => isSameDay(new Date(h.date), date));
    };

    const getEventForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return events[dateStr];
    };

    const handleAddEvent = () => {
        if (!selectedDate) return;
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const currentEvent = events[dateStr];
        const title = window.prompt("Enter event details:", currentEvent || "");
        if (title !== null) {
            if (title.trim() === "") {
                removeEvent(dateStr);
            } else {
                addEvent(dateStr, title);
            }
        }
    };

    const handleDeleteEvent = () => {
        if (!selectedDate) return;
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        if (window.confirm("Delete this event?")) {
            removeEvent(dateStr);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarIcon /> Calendar
                </h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={prevMonth}><ChevronLeft /></Button>
                    <span className="text-lg font-semibold w-32 text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <Button variant="ghost" onClick={nextMonth}><ChevronRight /></Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, dayIdx) => {
                        const holiday = getHolidayForDate(day);
                        const event = getEventForDate(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                  min-h-[100px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors relative
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isSelected ? 'ring-2 ring-inset ring-blue-500' : 'hover:bg-gray-50'}
                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-1 mt-1">
                                    {holiday && (
                                        <div className="text-xs p-1 bg-red-50 text-red-700 rounded border border-red-100 truncate" title={holiday.localName}>
                                            {holiday.localName}
                                        </div>
                                    )}
                                    {event && (
                                        <div className="text-xs p-1 bg-blue-50 text-blue-700 rounded border border-blue-100 truncate" title={event}>
                                            {event}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Selected Date: {format(selectedDate, 'PPPP')}</h3>
                        <div className="mt-1 space-y-1">
                            {getHolidayForDate(selectedDate) && (
                                <p className="text-red-600 text-sm">Holiday: {getHolidayForDate(selectedDate).localName}</p>
                            )}
                            {getEventForDate(selectedDate) ? (
                                <p className="text-blue-600 text-sm">Event: {getEventForDate(selectedDate)}</p>
                            ) : (
                                <p className="text-gray-500 text-sm">No custom events.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleAddEvent} size="sm" className="flex items-center gap-1">
                            <Plus size={16} />
                            {getEventForDate(selectedDate) ? "Edit Event" : "Add Event"}
                        </Button>
                        {getEventForDate(selectedDate) && (
                            <Button onClick={handleDeleteEvent} variant="danger" size="sm" className="flex items-center gap-1">
                                <Trash2 size={16} />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
