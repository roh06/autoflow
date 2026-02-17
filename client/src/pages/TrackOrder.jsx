import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Loader } from 'lucide-react';

import Navbar from '../components/Navbar';

export default function TrackOrder() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Find job by customer phone
            // We need a backend endpoint for this: GET /api/customers/track/:phone
            // For now, let's assume we search for the MOST RECENT active job
            const res = await fetch(`http://localhost:5001/api/customers/track/${phone}`);
            const data = await res.json();

            if (res.ok) {
                // Navigate to the portal with the Job ID
                navigate(`/track/${data.jobId}`);
            } else {
                setError(data.message || 'No active orders found for this number.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="flex flex-col items-center justify-center p-6 text-center min-h-[calc(100vh-96px)]">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-500 to-black"></div>

                    <div className="mt-8 mb-6">
                        <div className="w-16 h-16 bg-gray-100 text-gray-900 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-sm">
                            <Search size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Track Your Vehicle</h1>
                        <p className="text-gray-500 text-sm leading-relaxed">Enter your registered phone number to see real-time status updates.</p>
                    </div>

                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="e.g. 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg px-4 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition placeholder-gray-300 font-mono"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold uppercase tracking-widest text-xs py-4 rounded-lg hover:bg-gray-900 active:scale-[0.98] transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                        >
                            {loading ? <Loader className="animate-spin" size={16} /> : 'Track Order'}
                        </button>
                    </form>
                </div>
                <p className="mt-8 text-xs text-gray-400 font-medium">
                    Having trouble? <a href="#" className="underline hover:text-gray-600">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
