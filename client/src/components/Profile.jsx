import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Phone, CreditCard, Calendar, Shield, Building2 } from 'lucide-react';

export default function Profile() {
    const { token, logout } = useAuth();
    const [garage, setGarage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/garages/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setGarage(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    if (loading) return <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading Profile...</div>;
    if (!garage) return <div className="p-12 text-center text-red-500 text-xs font-bold uppercase tracking-widest">Profile Not Found</div>;

    return (
        <div className="p-8 md:p-12 h-full flex flex-col bg-white overflow-y-auto">
            <div className="max-w-3xl">
                {/* Header */}
                <div className="mb-12 border-b border-gray-100 pb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">My Profile</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Account & Garage Settings</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition border border-red-100 hover:border-red-200 px-4 py-2 rounded-sm"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Profile Card */}
                <div className="grid gap-8">
                    {/* Garage Details */}
                    <section className="bg-gray-50/50 rounded-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Building2 size={18} className="text-black" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Garage Information</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Garage Name</label>
                                <p className="text-lg text-gray-900 font-light">{garage.name}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Garage ID</label>
                                <p className="text-sm font-mono text-gray-500">{garage._id}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</label>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-300" />
                                    <p className="text-sm text-gray-900">{garage.phone || 'Not set'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Address</label>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-300" />
                                    <p className="text-sm text-gray-900">{garage.address || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Subscription Status */}
                    <section className="bg-black text-white rounded-lg p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-gray-300" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Subscription</h3>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${garage.subscriptionStatus === 'active' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                                }`}>
                                {garage.subscriptionStatus}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm font-light mb-4">
                            Your garage is currently running on the <strong>{garage.subscriptionStatus}</strong> plan.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>Member since {new Date(garage.createdAt).toLocaleDateString()}</span>
                        </div>
                    </section>

                    {/* Owner Account */}
                    <section className="bg-white rounded-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Shield size={18} className="text-black" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Account Details</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Username</label>
                                    <p className="text-lg text-gray-900 font-light">{garage.owner?.username}</p>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">Role: {garage.owner?.role}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
