import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from './JobCard';

const COLUMNS = ['Pending', 'In Progress', 'Ready', 'Delivered'];

export default function KanbanBoard() {
    const [jobs, setJobs] = useState([]);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchJobs = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setJobs(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (jobId, newStatus, newStageIndex) => {
        // Optimistic Update
        setJobs(prevJobs => prevJobs.map(job => {
            if (job._id === jobId) {
                // If stage index provided, update it and potentially status
                if (newStageIndex !== undefined) {
                    return { ...job, currentStageIndex: newStageIndex, status: job.workflow ? deriveStatus(job.workflow, newStageIndex) : newStatus };
                }
                return { ...job, status: newStatus };
            }
            return job;
        }));

        const payload = newStageIndex !== undefined ? { stageIndex: newStageIndex } : { status: newStatus };

        try {
            await fetch(`http://localhost:5001/api/jobs/${jobId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            fetchJobs(); // Refresh to ensure sync
        } catch (err) {
            console.error("Failed to update status", err);
            fetchJobs(); // Revert on error
        }
    };

    // Helper to mirror backend logic for hopeful UI updates
    const deriveStatus = (workflow, index) => {
        if (index === 0) return 'Pending';
        if (index === workflow.length - 1) return 'Delivered';
        if (index === workflow.length - 2) return 'Ready';
        return 'In Progress';
    };

    if (loading) return <div className="text-center p-10 text-xs font-bold uppercase tracking-widest text-gray-400">Loading Workflow...</div>;

    return (
        <div className="flex gap-6 h-full pb-8 min-w-max">
            {COLUMNS.map(status => (
                <div key={status} className="w-80 flex-shrink-0 flex flex-col h-full">
                    {/* Column Header - Minimal */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">{status}</h3>
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {jobs.filter(j => j.status === status).length}
                        </span>
                    </div>

                    {/* Lane */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {jobs.filter(job => job.status === status).map(job => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                        {jobs.filter(j => j.status === status).length === 0 && (
                            <div className="h-24 border border-dashed border-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-[10px] text-gray-300 uppercase tracking-widest">Empty</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
