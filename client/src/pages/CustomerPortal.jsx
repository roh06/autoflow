import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Camera, Check } from 'lucide-react';

export default function CustomerPortal() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('customerToken');
            if (!token) {
                navigate('/track-login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5001/api/jobs/my-jobs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setJobs(data);
                    if (data.length > 0) setSelectedJob(data[0]);
                } else {
                    localStorage.removeItem('customerToken');
                    navigate('/track-login');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customer');
        navigate('/track-login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-400 text-xs font-bold uppercase tracking-widest">Loading...</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
            {/* Mobile Header - White */}
            <nav className="p-6 sticky top-0 bg-white/90 backdrop-blur-sm z-50 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-serif font-bold text-xs">A</div>
                    <span className="text-sm font-medium tracking-wide uppercase">Autoflow</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-black text-[10px] font-bold uppercase tracking-widest">Sign Out</button>
            </nav>

            <main className="flex-1 p-6 max-w-lg mx-auto w-full pb-20">
                {jobs.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-gray-400 text-sm font-light">No active orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Vehicle Selector - Text Tabs */}
                        {jobs.length > 1 && (
                            <div className="flex gap-6 overflow-x-auto pb-2 border-b border-gray-100">
                                {jobs.map(job => (
                                    <button
                                        key={job._id}
                                        onClick={() => setSelectedJob(job)}
                                        className={`pb-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition ${selectedJob._id === job._id ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {job.vehicle.make}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Status */}
                        {selectedJob && (
                            <div className="space-y-10">
                                {/* Status Header - Clean Typography */}
                                <div className="text-center space-y-2 mt-8">
                                    <h2 className="text-5xl font-light tracking-tight">{selectedJob.status}</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Current Stage</p>
                                </div>

                                {/* Vehicle Info - Minimal Grid */}
                                <div className="grid grid-cols-2 gap-8 border-y border-gray-100 py-8">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Vehicle</p>
                                        <p className="text-sm font-medium">{selectedJob.vehicle.year} {selectedJob.vehicle.make} {selectedJob.vehicle.model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Plate</p>
                                        <p className="text-sm font-mono">{selectedJob.vehicle.plateNumber}</p>
                                    </div>
                                </div>

                                {/* Timeline - Vertical Line */}
                                <div className="relative pl-8 border-l border-gray-100 space-y-10">
                                    {[...selectedJob.updates].reverse().map((update, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Dot */}
                                            <div className={`absolute -left-[37px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-black' : 'bg-gray-200'}`}></div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-baseline">
                                                    <span className={`text-sm font-bold uppercase tracking-wide ${idx === 0 ? 'text-black' : 'text-gray-400'}`}>
                                                        {update.status}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                {update.note && (
                                                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                                                        {update.note}
                                                    </p>
                                                )}

                                                {update.photos && update.photos.length > 0 && (
                                                    <div className="flex gap-3 pt-2">
                                                        {update.photos.map((photo, pIdx) => (
                                                            <div key={pIdx} className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300 hover:text-black hover:bg-gray-100 transition cursor-pointer border border-gray-100">
                                                                <Camera size={16} strokeWidth={1.5} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center pt-8">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Estimated Completion</p>
                                    <p className="text-xl font-light">
                                        {selectedJob.estimatedCompletion ? new Date(selectedJob.estimatedCompletion).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'TBD'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
