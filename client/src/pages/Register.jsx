import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ username: '', password: '', garageName: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.password, formData.garageName);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
            <div className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-black transition">
                    <ArrowLeft size={20} strokeWidth={1.5} />
                </Link>

                <div className="text-center mb-10">
                    <div className="w-10 h-10 bg-black text-white font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4">G</div>
                    <h1 className="text-2xl font-light text-gray-900 tracking-wide mb-2">Create Account</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Start your digital garage</p>

                    <div className="flex justify-center gap-2 mt-6">
                        <div className={`h-1 w-8 rounded-full transition ${step >= 1 ? 'bg-black' : 'bg-gray-100'}`} />
                        <div className={`h-1 w-8 rounded-full transition ${step >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
                    </div>
                </div>

                {error && <div className="text-red-500 text-xs text-center mb-6 font-medium bg-red-50 py-2">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Admin Username</label>
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Choose a username"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Password</label>
                                <input
                                    type="password"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Create a strong password"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => { if (formData.username && formData.password) setStep(2); else setError('Please fill all fields'); }}
                                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition mt-4 flex items-center justify-center gap-2 group"
                            >
                                Next Step <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Garage Name</label>
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={formData.garageName}
                                    onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
                                    required
                                    placeholder="e.g. Prestige Auto Works"
                                    autoFocus
                                />
                            </div>
                            <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Free Trial Includes</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-600"><Check size={12} className="text-black" /> Unlimited Jobs</li>
                                    <li className="flex items-center gap-2 text-xs text-gray-600"><Check size={12} className="text-black" /> Inventory Tracking</li>
                                    <li className="flex items-center gap-2 text-xs text-gray-600"><Check size={12} className="text-black" /> Customer Portal</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition mt-4"
                            >
                                {loading ? 'Creating Garage...' : 'Complete Setup'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-400 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-black transition"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
