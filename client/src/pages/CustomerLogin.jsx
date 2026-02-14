import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CustomerLogin() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/auth/customer-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('customerToken', data.token);
            localStorage.setItem('customer', JSON.stringify(data.customer));
            navigate('/track');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans px-6">
            <div className="w-full max-w-sm">
                <Link to="/" className="inline-block mb-12 text-gray-400 hover:text-black transition">
                    <ArrowLeft size={20} strokeWidth={1.5} />
                </Link>

                <div className="mb-12">
                    <h2 className="text-3xl font-light text-gray-900 mb-3">Track Order</h2>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Enter your phone number and pass code to view real-time status updates for your vehicle.
                    </p>
                </div>

                {error && <div className="text-red-500 text-xs mb-6 font-medium">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div>
                        <input
                            type="tel"
                            className="w-full border-b border-gray-200 py-3 text-lg text-gray-900 outline-none focus:border-black transition placeholder-gray-300 font-light"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone Number"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex-1 border-b border-gray-200 py-3 text-center">
                                    <span className="text-lg text-gray-900 font-light">
                                        {otp[i] || '•'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="w-full absolute opacity-0"
                        // Making the input invisible but focusable for simplicity in this demo style
                        // In production, better OTP input handling is needed.
                        // For now, let's revert to a standard input but styled cleanly.
                        />
                        <input
                            type="text"
                            className="w-full border-b border-gray-200 py-3 text-lg text-center tracking-[1em] text-gray-900 outline-none focus:border-black transition placeholder-gray-300 font-light mt-4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="CODE"
                            maxLength={4}
                            required
                        />
                        <p className="text-[10px] text-gray-400 mt-4 text-center uppercase tracking-widest font-medium">Demo: 1234</p>
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center justify-center gap-4 group">
                        View Updates <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}
