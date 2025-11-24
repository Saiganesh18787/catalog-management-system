function StatCard({ title, value, subValue, icon: Icon, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
        red: "bg-red-50 text-red-600",
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

function StorageItem({ label, size, count, color }) {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200",
        green: "bg-green-50 border-green-200",
        purple: "bg-purple-50 border-purple-200",
        orange: "bg-orange-50 border-orange-200",
    };

    const textColorClasses = {
        blue: "text-blue-700",
        green: "text-green-700",
        purple: "text-purple-700",
        orange: "text-orange-700",
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-1">
                <Database size={16} className={textColorClasses[color]} />
                <p className="text-sm font-medium text-gray-700">{label}</p>
            </div>
            <p className={`text-lg font-bold ${textColorClasses[color]}`}>{size}</p>
            <p className="text-xs text-gray-500">{count} items</p>
        </div>
    );
}

export { StatCard, StorageItem };
