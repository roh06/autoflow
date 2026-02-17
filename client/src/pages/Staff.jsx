import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, Shield, Trash2 } from 'lucide-react';

export default function Staff() {
    const { token } = useAuth();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStaff, setNewStaff] = useState({ username: '', password: '' });

    const fetchStaff = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/garages/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setStaff(data);
            } else {
                console.error("Staff data is not an array:", data);
                setStaff([]);
            }
        } catch (err) {
            console.error("Error fetching staff:", err);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [token]);

    const [selectedStaff, setSelectedStaff] = useState(null);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/garages/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newStaff)
            });
            const data = await res.json();

            if (res.ok) {
                setStaff([...staff, data.user]);
                setNewStaff({ username: '', password: '', name: '', specialization: '', phone: '' });
                setShowAddForm(false);
            } else {
                alert(data.message || 'Failed to add staff');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
    };

    if (loading) return <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading Team...</div>;

    return (
        <div className="p-8 h-full flex flex-col bg-white relative">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-1">Team & Staff</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Manage Technician Access</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2"
                >
                    <Plus size={14} /> {showAddForm ? 'Cancel' : 'Add Technician'}
                </button>
            </div>

            {/* Add Form */}
            {/* Add Form */}
            {showAddForm && (
                <div className="mb-12 bg-gray-50 p-6 rounded-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-200">New Staff Member</h4>
                    <form onSubmit={handleAddStaff}>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. David Miller"
                                    value={newStaff.name || ''}
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Specialization</label>
                                <select
                                    value={newStaff.specialization || ''}
                                    onChange={e => setNewStaff({ ...newStaff, specialization: e.target.value })}
                                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
                                >
                                    <option value="">Select Role...</option>
                                    <option value="General Mechanic">General Mechanic</option>
                                    <option value="Body Work">Body Work & Paint</option>
                                    <option value="Detailing & PPF">Detailing & PPF</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Service Advisor">Service Advisor</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. +91 98765 43210"
                                    value={newStaff.phone || ''}
                                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8 bg-white p-6 border border-gray-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">App Username</label>
                                <input
                                    type="text"
                                    placeholder="e.g. tech_dave"
                                    value={newStaff.username}
                                    onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition font-mono"
                                    required
                                />
                                <p className="text-[10px] text-gray-400">Used for login</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">App Password / PIN</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1234"
                                    value={newStaff.password}
                                    onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition font-mono"
                                    required
                                />
                                <p className="text-[10px] text-gray-400">Share this with them</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-100 transition text-gray-500"
                            >
                                Cancel
                            </button>
                            <button className="bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-gray-800 transition">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Staff List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400 italic font-light">
                        No staff members found. Add your first technician.
                    </div>
                ) : (
                    staff.map((s) => (
                        <div
                            key={s._id}
                            onClick={() => setSelectedStaff(s)}
                            className="p-6 border border-gray-100 rounded-sm hover:shadow-md transition bg-white group flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">View <Shield size={10} /></span>
                            </div>

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                        <Users size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm">
                                        {s.specialization || 'General'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-1">{s.name || s.username}</h3>
                                <p className="text-xs text-gray-400 mb-6 font-mono">@{s.username}</p>

                                {s.phone && (
                                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        {s.phone}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 mt-4">
                                <span>Joined {new Date(s.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Staff Detail Modal */}
            {selectedStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md shadow-2xl rounded-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-4">
                                    <Users size={32} strokeWidth={1.5} />
                                </div>
                                <button onClick={() => setSelectedStaff(null)} className="text-gray-400 hover:text-black">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <h3 className="text-2xl font-light text-gray-900">{selectedStaff.name || selectedStaff.username}</h3>
                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-white bg-black px-2 py-1 rounded-sm">
                                {selectedStaff.specialization || 'Technician'}
                            </span>

                            <div className="mt-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Username</p>
                                        <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded-sm border border-gray-100">@{selectedStaff.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 p-2">{selectedStaff.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Account Role</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Shield size={16} className="text-green-500" />
                                        {selectedStaff.role}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Joined</p>
                                    <p className="text-sm text-gray-600">{new Date(selectedStaff.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setSelectedStaff(null)} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
