import React, { useState, useEffect } from 'react';
import { getAccessLogs } from '../utils/db';
import { Shield, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';

const AccessLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const data = await getAccessLogs();
            setLogs(data);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Shield className="h-8 w-8 mr-3 text-indigo-600" />
                    Access Logs
                </h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Security Audit Log
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Record of all authentication and sensitive access events.
                    </p>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No access logs found.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {logs.map((log, index) => (
                            <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${log.type === 'LOGIN' ? 'bg-green-100 text-green-600' :
                                                log.type === 'LOGOUT' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {log.type === 'LOGIN' ? <User className="h-5 w-5" /> :
                                                log.type === 'LOGOUT' ? <User className="h-5 w-5" /> :
                                                    <Activity className="h-5 w-5" />}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {log.user}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {log.details}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {format(new Date(log.timestamp), 'PPpp')}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AccessLogs;
