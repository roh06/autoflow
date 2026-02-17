import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif font-bold text-xl">
                        A
                    </div>
                    <span className="text-xl font-medium tracking-wide uppercase text-gray-900">
                        Auto<span className="font-light text-gray-400">flow</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-12 font-medium text-xs uppercase tracking-widest text-gray-500">
                    <Link to="/#services" className="hover:text-black transition">Services</Link>
                    <Link to="/#process" className="hover:text-black transition">Process</Link>
                    <Link to="/#reviews" className="hover:text-black transition">Reviews</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/track-login" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition">
                        Track Order
                    </Link>
                    <Link to="/register" className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
