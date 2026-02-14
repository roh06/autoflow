import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Check, ChevronDown, ArrowRight } from 'lucide-react';
import { CAR_DATA, SERVICE_TYPES } from '../data/carData';

export default function AddJobModal({ onClose, onJobCreated }) {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
    const [vehicle, setVehicle] = useState({ make: '', model: '', year: '', plateNumber: '', color: '' });
    const [job, setJob] = useState({ serviceType: [], estimatedCost: '', estimatedCompletion: '', adminNotes: '' });

    const availableModels = useMemo(() => {
        return vehicle.make ? CAR_DATA[vehicle.make] || [] : [];
    }, [vehicle.make]);

    const handleServiceToggle = (service) => {
        setJob(prev => {
            const types = prev.serviceType.includes(service)
                ? prev.serviceType.filter(s => s !== service)
                : [...prev.serviceType, service];
            return { ...prev, serviceType: types };
        });
    };

    // Submits (Logic reused, styling updated)
    // ... [Same logic as before, omitting for brevity in plan but including in file write] ...

    // RE-IMPLEMENTING FULL LOGIC TO ENSURE WORKING FILE
    const [createdCustomerId, setCreatedCustomerId] = useState(null);
    const [createdVehicleId, setCreatedVehicleId] = useState(null);

    const handleCustomerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            let res = await fetch('http://localhost:5001/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(customer)
            });
            let data = await res.json();

            if (!res.ok) {
                // Check if customer exists (handle both old and new messages to be safe)
                if (data.message && data.message.includes('Customer already exists')) {
                    // Quick lookup for existing logic
                    const listRes = await fetch('http://localhost:5001/api/customers', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const customers = await listRes.json();
                    const existing = customers.find(c => c.phone === customer.phone);

                    if (existing) {
                        setCreatedCustomerId(existing._id);
                        setStep(2);
                        setLoading(false);
                        return;
                    }
                }
                throw new Error(data.message);
            }
            setCreatedCustomerId(data._id);
            setStep(2);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('http://localhost:5001/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...vehicle, customerId: createdCustomerId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCreatedVehicleId(data._id);
            setStep(3);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('http://localhost:5001/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...job, customerId: createdCustomerId, vehicleId: createdVehicleId })
            });
            if (!res.ok) { const data = await res.json(); throw new Error(data.message); }
            onJobCreated(); onClose();
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-gray-900">New Work Order</h2>
                        <div className="flex items-center gap-4 mt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-0.5 w-12 transition ${step >= i ? 'bg-black' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition"><X size={20} className="text-gray-400 hover:text-black" /></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-xs font-medium uppercase tracking-wide">{error}</div>}

                    {step === 1 && (
                        <form onSubmit={handleCustomerSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-6">Step 1: Client Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Full Name</label>
                                        <input
                                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                            value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} required
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Phone</label>
                                        <input
                                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                            value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} required
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-black text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex justify-between items-center group">
                                {loading ? 'Processing...' : 'Next Step'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVehicleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-6">Step 2: Vehicle Details</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Make</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition appearance-none bg-transparent"
                                            value={vehicle.make} onChange={e => setVehicle({ ...vehicle, make: e.target.value, model: '' })} required
                                        >
                                            <option value="">Select...</option>
                                            {Object.keys(CAR_DATA).map(make => <option key={make} value={make}>{make}</option>)}
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-3 text-gray-300 pointer-events-none" size={14} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Model</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition appearance-none bg-transparent"
                                            value={vehicle.model} onChange={e => setVehicle({ ...vehicle, model: e.target.value })} required disabled={!vehicle.make}
                                        >
                                            <option value="">Select...</option>
                                            {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-3 text-gray-300 pointer-events-none" size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">License Plate</label>
                                <input
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300 font-mono uppercase"
                                    value={vehicle.plateNumber} onChange={e => setVehicle({ ...vehicle, plateNumber: e.target.value })} required
                                    placeholder="XYZ-123"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Year</label>
                                    <input
                                        type="number" className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                        value={vehicle.year} onChange={e => setVehicle({ ...vehicle, year: e.target.value })} placeholder="202X"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Color</label>
                                    <input
                                        className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                        value={vehicle.model === 'Other' /* Bug fix in logic? No context */ ? vehicle.color : vehicle.color} // Simplified
                                        onChange={e => setVehicle({ ...vehicle, color: e.target.value })} placeholder="Color"
                                    />
                                </div>
                            </div>

                            <button disabled={loading} className="w-full bg-black text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex justify-between items-center group">
                                {loading ? 'Processing...' : 'Next Step'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-6">Step 3: Service Selection</h3>
                            {/* ... existing Step 3 content ... */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-4">Services</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SERVICE_TYPES.map(type => (
                                        <label key={type} className={`flex items-center gap-3 p-3 border cursor-pointer transition ${job.serviceType.includes(type) ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                            <div className={`w-4 h-4 border flex items-center justify-center transition ${job.serviceType.includes(type) ? 'bg-black border-black' : 'bg-white border-gray-300'}`}>
                                                {job.serviceType.includes(type) && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{type}</span>
                                            <input type="checkbox" className="hidden" checked={job.serviceType.includes(type)} onChange={() => handleServiceToggle(type)} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Administrator Notes</label>
                                <textarea
                                    className="w-full border border-gray-200 p-3 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300 h-24 resize-none"
                                    placeholder="Special requests, damage inspection, etc."
                                    value={job.adminNotes}
                                    onChange={e => setJob({ ...job, adminNotes: e.target.value })}
                                />
                            </div>

                            <button onClick={() => {
                                // Pre-fill workflow if empty based on basic logic
                                if (!job.workflow || job.workflow.length === 0) {
                                    setJob(prev => ({ ...prev, workflow: ['Check-in', 'Work In Progress', 'Quality Check', 'Ready', 'Delivered'] }));
                                }
                                setStep(4);
                            }} className="w-full bg-black text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex justify-between items-center group">
                                Next: Workflow <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleJobSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-6">Step 4: Custom Workflow</h3>
                            <p className="text-xs text-gray-500 mb-4">Define the specific steps for this job. These will appear on the status tracker.</p>

                            <div className="space-y-2">
                                {(job.workflow || []).map((stepName, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            value={stepName}
                                            onChange={(e) => {
                                                const newWorkflow = [...job.workflow];
                                                newWorkflow[idx] = e.target.value;
                                                setJob({ ...job, workflow: newWorkflow });
                                            }}
                                            className="flex-1 border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition"
                                            placeholder={`Step ${idx + 1}`}
                                        />
                                        <button type="button" onClick={() => {
                                            const newWorkflow = job.workflow.filter((_, i) => i !== idx);
                                            setJob({ ...job, workflow: newWorkflow });
                                        }} className="text-gray-300 hover:text-red-500 font-bold px-2">×</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setJob({ ...job, workflow: [...(job.workflow || []), 'New Step'] })} className="text-xs font-bold uppercase tracking-widest text-black mt-4 hover:underline">
                                    + Add Step
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mt-8 border-t border-gray-50 pt-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Est. Cost ($)</label>
                                    <input
                                        type="number" className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                        value={job.estimatedCost} onChange={e => setJob({ ...job, estimatedCost: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Completion Date</label>
                                    <input
                                        type="date" className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                        value={job.estimatedCompletion} onChange={e => setJob({ ...job, estimatedCompletion: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button disabled={loading} className="w-full bg-black text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg mt-6">
                                {loading ? 'Creating...' : 'Confirm Order'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
