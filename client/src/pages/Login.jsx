import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            if (result.user.role === 'technician' || result.user.role === 'staff') {
                navigate('/mobile/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError('Invalid credentials');
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
                    <h1 className="text-2xl font-light text-gray-900 tracking-wide mb-2">Staff Access</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Enter your credentials</p>
                </div>

                {error && <div className="text-red-500 text-xs text-center mb-6 font-medium bg-red-50 py-2">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Username</label>
                        <input
                            type="text"
                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ADMIN"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Password</label>
                        <input
                            type="password"
                            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition mt-4">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        New Garage? <Link to="/register" className="text-black font-bold hover:underline">Register Here</Link>
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Protected System • Authorized Use Only</p>
                </div>
            </div>
        </div>
    );
}
