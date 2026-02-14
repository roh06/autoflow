import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Phone } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* Top Bar - Minimal */}
            <div className="bg-gray-100 text-gray-500 py-2 px-6 text-[10px] font-medium tracking-widest uppercase flex justify-between items-center border-b border-gray-200">
                <span>Premium Auto Care Solutions</span>
                <div className="flex items-center gap-4">
                    <span className="hover:text-black cursor-pointer transition">Support</span>
                    <span className="hover:text-black cursor-pointer transition">Locations</span>
                </div>
            </div>

            {/* Header - Clean & Centered */}
            <header className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif font-bold text-xl">
                            A
                        </div>
                        <span className="text-xl font-medium tracking-wide uppercase text-gray-900">
                            Auto<span className="font-light text-gray-400">flow</span>
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-12 font-medium text-xs uppercase tracking-widest text-gray-500">
                        <a href="#services" className="hover:text-black transition">Services</a>
                        <a href="#process" className="hover:text-black transition">Process</a>
                        <a href="#reviews" className="hover:text-black transition">Reviews</a>
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

            {/* Hero Section - Minimalist Split */}
            <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 space-y-8">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-2">
                            Est. 2026 • Premium Garage
                        </span>
                        <h1 className="text-5xl md:text-7xl font-light leading-tight text-gray-900">
                            Precision <br />
                            <span className="font-serif italic font-medium">Performance</span> <br />
                            Perfection.
                        </h1>
                        <p className="text-gray-500 text-sm leading-loose max-w-md font-light">
                            We believe in transparency and craftsmanship. Track every step of your vehicle's journey with our digital workshop integration.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/track-login" className="border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition flex items-center gap-2 group">
                                Track Vehicle <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                            {/* Placeholder for High-End Garage Image */}
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                <span className="font-serif italic text-4xl opacity-20">Image</span>
                            </div>
                            {/* Overlay Stats */}
                            <div className="absolute bottom-8 left-8 bg-white p-6 shadow-sm border border-gray-100 max-w-xs">
                                <div className="flex items-center gap-2 mb-2 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    "The transparency is unmatched. I knew exactly when my car was being polished."
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 text-gray-900">— Alex Morgan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features - Icon Grid */}
            <section className="py-24 bg-gray-50" id="services">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Shield, title: 'Certified Care', desc: 'Authorized service center for premium brands.' },
                            { icon: Truck, title: 'Digital Tracking', desc: 'Real-time status updates directly to your phone.' },
                            { icon: Star, title: 'Master Technicians', desc: 'Expertise honed over decades of experience.' }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed font-light max-w-xs mx-auto">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer - Minimal */}
            <footer className="bg-white text-gray-900 border-t border-gray-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-serif font-bold text-sm">A</div>
                            <span className="text-lg font-medium tracking-wide uppercase">Autoflow</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-light">
                            Redefining the auto service experience through design and technology.
                        </p>
                        <div className="flex gap-4">
                            {/* Socials placeholders */}
                            <div className="w-8 h-8 rounded-full border border-gray-200 hover:border-black transition cursor-pointer"></div>
                            <div className="w-8 h-8 rounded-full border border-gray-200 hover:border-black transition cursor-pointer"></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Menu</h4>
                        <ul className="space-y-4 text-gray-500 text-xs font-medium">
                            <li><a href="#" className="hover:text-black transition">Services</a></li>
                            <li><a href="#" className="hover:text-black transition">About</a></li>
                            <li><Link to="/track-login" className="hover:text-black transition">Order Status</Link></li>
                            <li><Link to="/login" className="hover:text-black transition">Staff</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-500 text-xs font-medium">
                            <li>123 Service Lane, Auto City</li>
                            <li>hello@autoflow.com</li>
                            <li>(555) 123-4567</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    <p>&copy; 2026 Autoflow Systems.</p>
                    <div className="flex gap-6">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
