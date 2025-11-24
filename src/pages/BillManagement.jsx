import React, { useState, useRef } from 'react';
import { useBills } from '../context/BillContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Camera, Upload, Trash2, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import CameraCapture from '../components/CameraCapture';

export default function BillManagement() {
    const { bills, addBill, deleteBill, updateBill } = useBills();
    const [storeName, setStoreName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState(null);
    const [filterStore, setFilterStore] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddBill = async (e) => {
        e.preventDefault();
        if (!storeName || !date || !amount) {
            alert("Please fill in all required fields");
            return;
        }

        await addBill({
            storeName,
            date,
            amount: parseFloat(amount),
            image,
            status: 'Pending'
        });

        setStoreName('');
        setAmount('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleStatusToggle = async (bill) => {
        const newStatus = bill.status === 'Paid' ? 'Pending' : 'Paid';
        await updateBill(bill.id, { status: newStatus });
    };

    const filteredBills = bills.filter(bill => {
        const matchesStore = bill.storeName.toLowerCase().includes(filterStore.toLowerCase());
        const matchesDate = filterDate ? bill.date === filterDate : true;
        return matchesStore && matchesDate;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Bill Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        let yPos = 40;

        filteredBills.forEach((bill, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${bill.storeName}`, 14, yPos);

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Date: ${bill.date}`, 14, yPos + 7);
            doc.text(`Amount: ₹${bill.amount}`, 60, yPos + 7);
            doc.text(`Status: ${bill.status}`, 100, yPos + 7);

            if (bill.image) {
                try {
                    doc.addImage(bill.image, 'JPEG', 14, yPos + 12, 40, 30);
                    yPos += 50;
                } catch (e) {
                    yPos += 20;
                }
            } else {
                yPos += 20;
            }

            yPos += 10;
        });

        doc.save('bills_report.pdf');
    };

    const exportJSON = () => {
        const dataStr = JSON.stringify(filteredBills, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'bills_export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (showCamera) {
        return (
            <CameraCapture
                onCapture={(img) => {
                    setImage(img);
                    setShowCamera(false);
                }}
                onCancel={() => setShowCamera(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText /> Bill Management
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Add Bill Form */}
                <div className="xl:col-span-1 h-fit">
                    <h2 className="text-lg font-semibold mb-3">Add New Bill</h2>
                    <form onSubmit={handleAddBill} className="space-y-3">
                        <Input
                            label="Store Name"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="e.g. Walmart, Supplier A"
                            required
                            className="py-1.5 text-sm"
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="py-1.5 text-sm"
                        />
                        <Input
                            label="Amount (₹)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="py-1.5 text-sm"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Image</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    className="hidden"
                                    id="bill-image-upload"
                                />
                                <label
                                    htmlFor="bill-image-upload"
                                    className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-xs text-gray-700 w-full justify-center"
                                >
                                    <Upload size={16} />
                                    Upload Image
                                </label>
                            </div>
                            <div className="mt-2">
                                <Button type="button" onClick={() => setShowCamera(true)} variant="secondary" className="w-full flex items-center justify-center gap-2 py-1.5 text-xs">
                                    <Camera size={16} />
                                    Take Photo
                                </Button>
                            </div>
                            {image && (
                                <div className="mt-2 relative">
                                    <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full">Save Bill</Button>
                    </form>
                </div>

                {/* Bill List & Reports */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Filters & Actions */}
                    <div>
                        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                            <div className="flex gap-4 w-full md:w-auto flex-1">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Store</label>
                                    <input
                                        type="text"
                                        value={filterStore}
                                        onChange={(e) => setFilterStore(e.target.value)}
                                        placeholder="Search store..."
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Date</label>
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={exportJSON} className="flex items-center gap-2 text-xs h-[34px]">
                                    <Download size={14} /> JSON
                                </Button>
                                <Button variant="secondary" onClick={generatePDF} className="flex items-center gap-2 text-xs h-[34px]">
                                    <FileText size={14} /> PDF Report
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {filteredBills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 min-h-[400px] text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                    <FileText size={32} className="text-gray-400" />
                                </div>
                                <p className="text-lg font-medium text-gray-900">No bills found</p>
                                <p className="text-sm text-gray-500">Add a new bill to get started</p>
                            </div>
                        ) : (
                            filteredBills.map(bill => (
                                <div key={bill.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        {bill.image ? (
                                            <img src={bill.image} alt={bill.storeName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FileText size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{bill.storeName}</h3>
                                        <p className="text-sm text-gray-500">{bill.date}</p>
                                        <p className="font-medium text-gray-900 mt-1">₹{bill.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                        <button
                                            onClick={() => handleStatusToggle(bill)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${bill.status === 'Paid'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                }`}
                                        >
                                            {bill.status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            {bill.status}
                                        </button>
                                        <button
                                            onClick={() => deleteBill(bill.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
