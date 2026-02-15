import { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, CheckCircle, FileText, Smartphone, Mail, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VehicleDetailModal({ vehicle, onClose }) {
    const [activeTab, setActiveTab] = useState('history'); // 'overview' or 'history'
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/jobs/vehicle/${vehicle._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Error fetching vehicle history:", err);
            } finally {
                setLoading(false);
            }
        };

        if (vehicle) fetchHistory();
    }, [vehicle, token]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white px-6 py-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-light text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                                {vehicle.plateNumber}
                            </span>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide px-2 border-l border-gray-200">
                                {vehicle.color}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition p-2 hover:bg-gray-50 rounded-full">
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 text-xs font-bold uppercase tracking-widest mr-8 transition border-b-2 ${activeTab === 'history' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Service History
                    </button>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 text-xs font-bold uppercase tracking-widest transition border-b-2 ${activeTab === 'overview' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Vehicle Details
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {activeTab === 'overview' ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Owner Card */}
                            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <User size={14} /> Owner Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                            {vehicle.owner?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{vehicle.owner?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">Customer ID: {vehicle.owner?._id || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Smartphone size={14} className="text-gray-400" />
                                            {vehicle.owner?.phone || 'No Phone'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            {vehicle.owner?.email || 'No Email'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Specs */}
                            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <FileText size={14} /> Technical Specs
                                </h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">VIN / Chassis</p>
                                        <p className="font-mono text-sm text-gray-900">{vehicle.vin || 'Not Recorded'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Color</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: vehicle.color || '#fff' }}></span>
                                            <span className="text-sm text-gray-900 capitalize">{vehicle.color || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Registered Date</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(vehicle.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Total Visits</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Hash size={14} className="text-gray-400" />
                                            {jobs.length} Service Records
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            {loading ? (
                                <div className="text-center py-12 text-xs font-bold uppercase tracking-widest text-gray-400">Loading History...</div>
                            ) : jobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Clock size={32} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 text-sm italic">No service history found for this vehicle.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {jobs.map((job) => (
                                        <div key={job._id} className="bg-white rounded-lg p-5 border border-gray-100 hover:border-black transition group shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                                            {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.serviceType.map(tag => (
                                                            <span key={tag} className="bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${job.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </div>

                                            {job.adminNotes && (
                                                <p className="text-sm text-gray-500 font-light leading-relaxed mb-4 border-t border-gray-50 pt-3">
                                                    "{job.adminNotes}"
                                                </p>
                                            )}

                                            <div className="flex justify-between items-center text-xs text-gray-400 font-mono pt-2 border-t border-gray-50 mt-2">
                                                <span>REF: {job._id.slice(-6).toUpperCase()}</span>
                                                {job.estimatedCost && (
                                                    <span className="font-bold text-gray-900 text-sm">${job.estimatedCost.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
