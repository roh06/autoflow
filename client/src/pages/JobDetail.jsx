import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Calendar, Clock, CheckCircle, Car, Receipt } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

import QRCode from 'react-qr-code';

export default function JobDetail() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobRes = await fetch(`http://localhost:5001/api/jobs/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const jobData = await jobRes.json();
                setJob(jobData);

                if (jobData.vehicle) {
                    const historyRes = await fetch(`http://localhost:5001/api/jobs/vehicle/${jobData.vehicle._id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const historyData = await historyRes.json();
                    setHistory(historyData.filter(j => j._id !== id));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    if (loading) return <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Details...</div>;
    if (!job) return <div className="p-12 text-center text-red-500 text-xs font-bold uppercase tracking-widest">Job Not Found</div>;

    const qrValue = `${window.location.origin}/mobile/dashboard?jobId=${job._id}`;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 p-8 md:p-12 relative">
            <div className="flex justify-between items-center mb-12">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-black text-[10px] font-bold uppercase tracking-widest transition group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowQR(true)}
                        className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
                    >
                        <User size={14} /> Job QR
                    </button>
                    <button
                        onClick={() => setShowInvoice(true)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                    >
                        <Receipt size={14} /> Generate Invoice
                    </button>
                </div>
            </div>

            {/* Main Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-gray-100 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">Active Order</span>
                        <span className="text-gray-400 font-mono text-xs tracking-wider">#{job._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-2">
                        {job.vehicle.year} {job.vehicle.make}
                    </h1>
                    <p className="text-xl text-gray-400 font-light">{job.vehicle.model}</p>
                </div>
                <div className="text-left md:text-right flex flex-col md:items-end">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Current Status</p>
                    <div className="relative inline-block group">
                        <select
                            value={job.status}
                            onChange={async (e) => {
                                const newStatus = e.target.value;
                                setJob(prev => ({ ...prev, status: newStatus }));
                                try {
                                    await fetch(`http://localhost:5001/api/jobs/${id}/status`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify({ status: newStatus })
                                    });
                                } catch (err) {
                                    console.error("Failed to update status", err);
                                }
                            }}
                            className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-widest py-3 pl-4 pr-10 rounded-sm cursor-pointer outline-none focus:border-black transition-all min-w-[160px]"
                        >
                            {['Pending', 'Washing', 'Polishing', 'PPF', 'Coating', 'Ready', 'Delivered'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-x-1 transition-transform">
                            <span className="text-[10px] text-gray-400">▼</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-16 mb-20">
                {/* Column 1: Client & Vehicle */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">Client Details</h3>
                        <div className="flex items-start gap-4 mb-6">
                            <User size={16} strokeWidth={1.5} className="text-gray-400 mt-1" />
                            <div>
                                <p className="font-medium text-sm text-gray-900">{job.customer.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{job.customer.phone}</p>
                                <p className="text-xs text-gray-500">{job.customer.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Car size={16} strokeWidth={1.5} className="text-gray-400 mt-1" />
                            <div>
                                <p className="font-medium text-sm text-gray-900 font-mono">{job.vehicle.plateNumber}</p>
                                <p className="text-xs text-gray-500 mt-1 uppercase">{job.vehicle.color}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Services */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">Service Package</h3>
                    <ul className="space-y-4">
                        {job.serviceType.map((service, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                <CheckCircle size={14} className="text-black" strokeWidth={2} /> {service}
                            </li>
                        ))}
                    </ul>

                    {job.adminNotes && (
                        <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3">Technician Notes</p>
                            <p className="text-sm font-light text-gray-600 leading-relaxed italic">"{job.adminNotes}"</p>
                        </div>
                    )}
                </div>

                {/* Column 3: Timeline */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">Schedule</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Created</p>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-300" strokeWidth={1.5} />
                                <span className="font-medium text-sm text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Due Date</p>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-300" strokeWidth={1.5} />
                                <span className="font-medium text-sm text-gray-900">
                                    {job.estimatedCompletion ? new Date(job.estimatedCompletion).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                        {job.estimatedCost && (
                            <div className="pt-6">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Estimated Cost</p>
                                <p className="text-2xl font-light text-gray-900">${job.estimatedCost}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vehicle History */}
            <div className="border-t border-gray-100 pt-16">
                <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-8">Service History</h2>

                {history.length === 0 ? (
                    <p className="text-gray-400 text-sm font-light italic">No previous service records found for this vehicle.</p>
                ) : (
                    <div className="w-full">
                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 mb-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 col-span-2">Services performed</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</div>
                        </div>
                        <div className="space-y-4">
                            {history.map(hJob => (
                                <div key={hJob._id} className="grid grid-cols-4 gap-4 py-4 hover:bg-gray-50 transition items-center border-b border-gray-50">
                                    <div className="text-xs font-mono text-gray-500">
                                        {new Date(hJob.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 col-span-2">
                                        {hJob.serviceType.join(', ')}
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${hJob.status === 'Delivered' ? 'bg-gray-100 text-gray-600' : 'text-gray-400'}`}>
                                            {hJob.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white p-8 max-w-sm w-full shadow-2xl rounded-sm text-center">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Job QR Code</h2>
                        <div className="flex justify-center mb-6">
                            <QRCode value={qrValue} size={256} />
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-6 word-break-all">{qrValue}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                            >
                                Print
                            </button>
                            <button
                                onClick={() => setShowQR(false)}
                                className="flex-1 border border-gray-200 text-gray-900 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInvoice && <InvoiceModal job={job} onClose={() => setShowInvoice(false)} />}
        </div>
    );
}
