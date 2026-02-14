import { ExternalLink, Calendar, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, onStatusUpdate }) {
    const { vehicle, customer, workflow, currentStageIndex, status, serviceType, estimatedCompletion } = job;
    const navigate = useNavigate();

    // Determine current stage name (fallback to status if workflow missing)
    const currentStageName = workflow && workflow[currentStageIndex] ? workflow[currentStageIndex] : status;

    const nextStatus = () => {
        if (workflow && currentStageIndex < workflow.length - 1) {
            // Update by Index
            onStatusUpdate(job._id, null, currentStageIndex + 1);
        }
    };

    const prevStatus = () => {
        if (workflow && currentStageIndex > 0) {
            onStatusUpdate(job._id, null, currentStageIndex - 1);
        }
    };

    return (
        <div
            className="bg-white border border-gray-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 group cursor-pointer relative"
            onClick={() => navigate(`/dashboard/jobs/${job._id}`)}
        >
            {/* Top Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {/* Show Current Stage as a Badge if In Progress */}
                <span className="bg-black text-white border border-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                    {currentStageName}
                </span>

                {job.serviceType.slice(0, 1).map((s, i) => (
                    <span key={i} className="bg-gray-50 text-gray-600 border border-gray-100 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                        {s}
                    </span>
                ))}
            </div>

            {/* Vehicle Info */}
            <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1 leading-snug">
                    {vehicle.year} {vehicle.make}
                </h4>
                <p className="text-xs text-gray-500 font-medium">{vehicle.model}</p>
            </div>

            {/* Customer & Date */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Client</p>
                    <p className="text-xs font-medium text-gray-700">{customer.name.split(' ')[0]}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Due</p>
                    <p className="text-xs font-medium text-gray-700">
                        {estimatedCompletion ? new Date(estimatedCompletion).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                    </p>
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); prevStatus(); }}
                    className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition"
                    title="Previous Stage"
                    disabled={!workflow || currentStageIndex === 0}
                >
                    <span className="text-[10px] font-bold">&lt;</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextStatus(); }}
                    className="w-6 h-6 flex items-center justify-center bg-black rounded-full hover:bg-gray-800 text-white transition"
                    title="Next Stage"
                    disabled={!workflow || currentStageIndex === workflow.length - 1}
                >
                    <span className="text-[10px] font-bold">&gt;</span>
                </button>
            </div>
        </div>
    );
}
