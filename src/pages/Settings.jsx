import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function Settings() {
    const { exportCatalog, importCatalog, clearCatalog } = useProducts();
    const { settings, updateSettings } = useSales();
    const [jsonInput, setJsonInput] = useState('');
    const [localSettings, setLocalSettings] = useState({ profitMargin: 35, monthlyExpenses: 160000 });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveFinancialSettings = async () => {
        await updateSettings({
            profitMargin: parseFloat(localSettings.profitMargin),
            monthlyExpenses: parseFloat(localSettings.monthlyExpenses)
        });
        alert('Settings saved!');
    };

    const handleExport = () => {
        const data = exportCatalog();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catalog-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = async () => {
        try {
            const result = await importCatalog(JSON.parse(jsonInput));
            setJsonInput('');
            alert(`Import successful!\nAdded: ${result.added}\nUpdated: ${result.updated}\nSkipped (Duplicate Name): ${result.skipped}`);
        } catch (error) {
            alert('Error importing catalog: ' + error.message);
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    if (window.confirm(`Import ${data.length} products? This will add new products and update existing ones.`)) {
                        const result = await importCatalog(data);
                        alert(`Import successful!\nAdded: ${result.added}\nUpdated: ${result.updated}\nSkipped (Duplicate Name): ${result.skipped}`);
                    }
                } else {
                    alert('Invalid file format. Expected an array of products.');
                }
            } catch (err) {
                console.error(err);
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const handleClear = async () => {
        if (window.confirm('Are you sure you want to delete ALL products? This cannot be undone.')) {
            await clearCatalog();
            alert('Catalog cleared.');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Profit Margin (%)"
                        name="profitMargin"
                        type="number"
                        value={localSettings.profitMargin}
                        onChange={handleSettingsChange}
                        placeholder="35"
                    />
                    <Input
                        label="Monthly Fixed Expenses (₹)"
                        name="monthlyExpenses"
                        type="number"
                        value={localSettings.monthlyExpenses}
                        onChange={handleSettingsChange}
                        placeholder="160000"
                    />
                </div>
                <Button onClick={saveFinancialSettings} className="flex items-center gap-2">
                    <Save size={20} />
                    Save Settings
                </Button>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Export Catalog</h3>
                        <p className="text-sm text-gray-500 mb-3">Download your entire product catalog as a JSON file.</p>
                        <Button onClick={handleExport} variant="secondary" className="flex items-center gap-2">
                            <Download size={20} />
                            Export JSON
                        </Button>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Import Catalog</h3>
                        <p className="text-sm text-gray-500 mb-1">Upload a JSON file or paste data below.</p>
                        <p className="text-xs text-blue-600 mb-3">📱 Mobile tip: Make sure the JSON file is in your Downloads or Files app</p>

                        <div className="flex gap-4 mb-4">
                            <input
                                type="file"
                                accept="application/json,.json,text/json"
                                ref={fileInputRef}
                                onChange={handleFileImport}
                                className="hidden"
                                id="json-file-input"
                            />
                            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                                <Upload size={20} />
                                Choose JSON File
                            </Button>
                        </div>

                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm font-mono mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder='Or paste JSON here...'
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />
                        <Button onClick={handleImport} variant="secondary" className="flex items-center gap-2">
                            <Upload size={20} />
                            Import from Text
                        </Button>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
                        <Button onClick={handleClear} variant="danger" className="flex items-center gap-2">
                            <Trash2 size={20} />
                            Clear All Data
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
