import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Phone, CheckCircle, XCircle, Zap, Smartphone, Users, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';

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

            <Navbar />

            {/* Hero Section */}
            <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 space-y-8">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-2">
                            The Modern Workshop OS
                        </span>
                        <h1 className="text-5xl md:text-7xl font-light leading-tight text-gray-900">
                            Chaos to <br />
                            <span className="font-serif italic font-medium">Clarity.</span>
                        </h1>
                        <p className="text-gray-500 text-sm leading-loose max-w-md font-light">
                            Stop managing your garage with scribbled text messages and lost paper job cards. Autoflow connects your team, your customers, and your workflow in one beautiful system.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/track-login" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2 group shadow-lg">
                                Track My Vehicle <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="border border-gray-200 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition flex items-center gap-2">
                                Staff Login
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                            <img
                                src="/hero-car.png"
                                alt="Premium Auto Service"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] contrast-125"
                            />
                            {/* Overlay Stats */}
                            <div className="absolute bottom-8 left-8 bg-white p-6 shadow-2xl border border-gray-100 max-w-xs animate-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center gap-2 mb-2 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    "I didn't have to call the shop once. I watched my car move from 'Washing' to 'Ready' on my phone."
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 text-gray-900">— Satisfied Customer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-light">The Old Way is <span className="font-serif italic text-red-500">Broken.</span></h2>
                            <p className="text-gray-500 text-sm leading-relaxed font-light">
                                Running a premium workshop requires premium communication. Paper job cards get oily and lost. WhatsApp messages get buried. Customers get anxious.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    'Phone ringing non-stop for status updates',
                                    'Manual invoices created in Excel',
                                    'Technicians unsure of what to do next',
                                    'No history of previous repairs'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <XCircle size={16} className="text-red-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-8 shadow-sm">
                                <Phone size={32} className="text-gray-300 mb-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Endless Calls</h3>
                                <p className="text-[10px] text-gray-400">"Is my car ready yet?"</p>
                            </div>
                            <div className="bg-white p-8 shadow-sm mt-8">
                                <FileText size={32} className="text-gray-300 mb-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Paper Chaos</h3>
                                <p className="text-[10px] text-gray-400">Lost sticky notes & bills</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution / Features */}
            <section className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2 block">The Multiflow Ecosystem</span>
                    <h2 className="text-4xl font-light">Built for Everyone.</h2>
                </div>

                {/* VISUAL SHOWCASE SECTION - NEW */}
                <div className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="relative grid md:grid-cols-12 gap-8 items-center">
                        {/* Owner Dashboard - Desktop View */}
                        <div className="md:col-span-7 relative z-10">
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white transform hover:scale-[1.02] transition duration-700">
                                <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <img src="/assets/dashboard-ui.png" alt="Owner Dashboard" className="w-full h-auto" />
                            </div>
                            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Command Center (Owner View)</p>
                        </div>

                        {/* Mobile Apps - Tech & Customer */}
                        <div className="md:col-span-5 flex justify-center items-center gap-4 relative">
                            {/* Tech App */}
                            <div className="w-48 relative transform translate-y-8 hover:-translate-y-2 transition duration-500 z-20">
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-800 bg-black">
                                    <img src="/assets/technician-ui.png" alt="Technician App" className="w-full h-auto" />
                                </div>
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Technician App</p>
                            </div>

                            {/* Customer App */}
                            <div className="w-48 relative transform -translate-y-8 hover:translate-y-2 transition duration-500 z-30">
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-200 bg-white">
                                    <img src="/assets/customer-ui.png" alt="Customer Portal" className="w-full h-auto" />
                                </div>
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Customer Portal</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    {/* Owner Card */}
                    <div className="border border-gray-100 p-8 hover:shadow-xl transition duration-500 group">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">For Owners</h3>
                        <p className="text-gray-400 text-xs mb-6 h-10">Total control over your shop floor. Manage jobs, inventory, and billing in one place.</p>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> Kanban Dashboard</li>
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> GST Invoicing</li>
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> Fleet Management</li>
                        </ul>
                    </div>

                    {/* Technician Card */}
                    <div className="bg-black text-white p-8 shadow-2xl scale-105 relative transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Smartphone size={64} />
                        </div>
                        <div className="w-12 h-12 bg-white text-black flex items-center justify-center mb-6">
                            <Users size={20} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">For Technicians</h3>
                        <p className="text-gray-400 text-xs mb-6 h-10">A mobile-first app designed for greasy hands. Simple, fast, and efficient.</p>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-xs text-gray-300"><CheckCircle size={14} className="text-white" /> QR Code Scanning</li>
                            <li className="flex gap-2 text-xs text-gray-300"><CheckCircle size={14} className="text-white" /> One-Tap Status Updates</li>
                            <li className="flex gap-2 text-xs text-gray-300"><CheckCircle size={14} className="text-white" /> Photo Uploads</li>
                        </ul>
                    </div>

                    {/* Customer Card */}
                    <div className="border border-gray-100 p-8 hover:shadow-xl transition duration-500 group">
                        <div className="w-12 h-12 bg-gray-100 text-black flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                            <Star size={20} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">For Customers</h3>
                        <p className="text-gray-400 text-xs mb-6 h-10">Peace of mind. Trust that your premium vehicle is in good hands.</p>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> Real-time Tracking</li>
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> Digital Service History</li>
                            <li className="flex gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-green-500" /> Transparent Billing</li>
                        </ul>
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
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-500 text-xs font-medium">
                            <li><Link to="/login" className="hover:text-black transition">Owner Login</Link></li>
                            <li><Link to="/register" className="hover:text-black transition">Partner with Us</Link></li>
                            <li><Link to="/track-login" className="hover:text-black transition">Customer Portal</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-500 text-xs font-medium">
                            <li>hello@autoflow.com</li>
                            <li>(555) 123-4567</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    <p>&copy; 2026 Autoflow Systems.</p>
                </div>
            </footer>
        </div>
    );
}
