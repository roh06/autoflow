import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, CheckCircle, Home, LogOut, QrCode } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

export default function TechnicianDashboard() {
    const { token, user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [activeJob, setActiveJob] = useState(null);
    const [tab, setTab] = useState('jobs'); // jobs, scan
    const [searchParams, setSearchParams] = useSearchParams();

    // Poll for jobs every 5 seconds
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch ALL active jobs from the garage (Technicians see everything for now)
                const res = await fetch('http://localhost:5001/api/jobs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    const activeJobs = data.filter(j => j.status !== 'Delivered');
                    setJobs(activeJobs);

                    // Check for URL Param on load
                    const jobIdParam = searchParams.get('jobId');
                    if (jobIdParam && !activeJob) {
                        const targetJob = activeJobs.find(j => j._id === jobIdParam);
                        if (targetJob) {
                            setActiveJob(targetJob);
                            setTab('jobs'); // Switch to jobs tab to show detail
                        }
                    }
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        };

        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, [token, searchParams, activeJob]);

    const handleNextStage = async () => {
        if (!activeJob) return;
        const currentActiveJob = jobs.find(j => j._id === activeJob._id) || activeJob;

        // Normalize workflow
        const workflow = currentActiveJob.workflow && currentActiveJob.workflow.length > 0
            ? currentActiveJob.workflow
            : ['Pending', 'In Progress', 'Ready', 'Delivered'];

        let currentStageIndex = currentActiveJob.currentStageIndex;
        if (currentStageIndex === undefined) {
            if (currentActiveJob.status === 'Pending') currentStageIndex = 0;
            else if (currentActiveJob.status === 'In Progress') currentStageIndex = 1;
            else if (currentActiveJob.status === 'Ready') currentStageIndex = workflow.length - 2;
            else currentStageIndex = 0;
        }

        const nextStageIndex = currentStageIndex + 1;

        if (nextStageIndex >= workflow.length) return; // Already at end

        try {
            const res = await fetch(`http://localhost:5001/api/jobs/${currentActiveJob._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ stageIndex: nextStageIndex })
            });

            if (res.ok) {
                const updatedJob = await res.json();
                setJobs(prevJobs => prevJobs.map(j => j._id === updatedJob._id ? updatedJob : j));
                setActiveJob(updatedJob);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleScan = (data) => {
        if (data) {
            // Data text is likely a URL: http://.../mobile/dashboard?jobId=123
            // We need to extract jobId
            try {
                // Try to parse as URL
                const url = new URL(data.text);
                const jobId = url.searchParams.get('jobId');

                if (jobId) {
                    const foundJob = jobs.find(j => j._id === jobId);
                    if (foundJob) {
                        setActiveJob(foundJob);
                        setTab('jobs');
                        setSearchParams({ jobId }); // Update URL to match
                    } else {
                        alert("Job not found in active list.");
                    }
                }
            } catch (e) {
                console.error("Scan parse error", e);
                // Fallback: maybe it's just the ID
                const foundJob = jobs.find(j => j._id === data.text);
                if (foundJob) {
                    setActiveJob(foundJob);
                    setTab('jobs');
                }
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    // Render Logic
    const renderContent = () => {
        if (activeJob) {
            // Find the latest version of activeJob from jobs list to ensure it's up to date
            const currentActiveJob = jobs.find(j => j._id === activeJob._id) || activeJob;
            // Helper to safely get workflow data
            const workflow = currentActiveJob.workflow && currentActiveJob.workflow.length > 0
                ? currentActiveJob.workflow
                : ['Pending', 'In Progress', 'Ready', 'Delivered'];

            let currentStageIndex = currentActiveJob.currentStageIndex;
            if (currentStageIndex === undefined) {
                // Fallback inference if index is missing
                if (currentActiveJob.status === 'Pending') currentStageIndex = 0;
                else if (currentActiveJob.status === 'In Progress') currentStageIndex = 1;
                else if (currentActiveJob.status === 'Ready') currentStageIndex = workflow.length - 2; // Usually 2nd to last
                else currentStageIndex = 0;
            }

            const displayStatus = workflow[currentStageIndex] || currentActiveJob.status;
            const nextStage = currentStageIndex < workflow.length - 1 ? workflow[currentStageIndex + 1] : null;

            return (
                <div className="pb-24 animate-in fade-in slide-in-from-bottom-2">
                    {/* Header */}
                    <div className="bg-black text-white p-6 rounded-b-3xl shadow-xl mb-6">
                        <button onClick={() => { setActiveJob(null); setSearchParams({}); }} className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                            ← Back to List
                        </button>
                        <h1 className="text-3xl font-light mb-1">{currentActiveJob.vehicle.make} {currentActiveJob.vehicle.model}</h1>
                        <p className="text-white/50 font-mono text-sm tracking-widest">{currentActiveJob.vehicle.plateNumber}</p>
                    </div>

                    <div className="px-6 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Current Status</p>
                            <div className="text-2xl font-bold">{displayStatus}</div>
                        </div>

                        {/* Action Button */}
                        {nextStage && currentActiveJob.status !== 'Delivered' && (
                            <section className="bg-black text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CheckCircle size={100} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current Stage</h3>
                                <div className="text-2xl font-light mb-6">{displayStatus}</div>

                                <button
                                    onClick={handleNextStage}
                                    className="w-full bg-white text-black py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-100 active:scale-[0.98] transition flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Complete {displayStatus}
                                </button>
                                <p className="text-[10px] text-center text-gray-500 mt-3 uppercase tracking-widest">Next: {nextStage}</p>
                            </section>
                        )}

                        {/* Service List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-50 pb-2">Services</h3>
                            <ul className="space-y-3">
                                {currentActiveJob.serviceType.map(s => (
                                    <li key={s} className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-black rounded-full"></div>
                                        </div>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Notes */}
                        {currentActiveJob.adminNotes && (
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 mb-2">Notes</h3>
                                <p className="text-sm text-yellow-800 italic">"{currentActiveJob.adminNotes}"</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (tab === 'scan') {
            return (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white">
                        <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            constraints={{ video: { facingMode: 'environment' } }}
                        />
                        <div className="absolute inset-0 border-2 border-white/20 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-0.5 bg-red-500 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                        </div>
                    </div>
                    <p className="mt-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Align QR Code within the frame
                    </p>
                </div>
            );
        }

        // Default: List
        return (
            <div className="p-6 pb-24 space-y-4">
                <h1 className="text-2xl font-light tracking-tight mb-6">My Queue <span className="text-gray-300">({jobs.length})</span></h1>
                {jobs.map(job => (
                    <div
                        key={job._id}
                        onClick={() => setActiveJob(job)}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold">{job.vehicle.plateNumber}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-sm text-gray-500">{job.vehicle.make}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${job.status === 'Ready' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            <span className="text-xs text-gray-500 font-medium">{job.status}</span>
                        </div>
                        <div className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                            {job.serviceType.join(', ')}
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-sm">No active jobs found.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-safe">
            {/* Conditional Header handled in detail view */}

            {renderContent()}

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 py-4 px-8 flex justify-between items-center z-50 pb-safe-bottom">
                <button
                    onClick={() => { setTab('jobs'); setActiveJob(null); }}
                    className={`flex flex-col items-center gap-1 transition-colors ${tab === 'jobs' && !activeJob ? 'text-black' : 'text-gray-300'}`}
                >
                    <Home size={20} strokeWidth={tab === 'jobs' && !activeJob ? 2.5 : 2} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
                </button>

                <button
                    onClick={() => { setTab('scan'); setActiveJob(null); }}
                    className="flex flex-col items-center justify-center -mt-8"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${tab === 'scan' ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>
                        <QrCode size={24} />
                    </div>
                </button>

                <button
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-red-500 transition-colors"
                >
                    <LogOut size={20} strokeWidth={2} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Exit</span>
                </button>
            </div>
        </div>
    );
}
