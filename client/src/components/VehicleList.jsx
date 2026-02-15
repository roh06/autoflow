import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Car, ChevronRight, User } from 'lucide-react';
import VehicleDetailModal from './VehicleDetailModal';

export default function VehicleList() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/vehicles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setVehicles(data);
            } catch (err) {
                console.error("Error fetching vehicles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, [token]);

    const filteredVehicles = vehicles.filter(v =>
        v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.owner?.name.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading Vehicle Registry...</div>;

    return (
        <div className="p-8 h-full flex flex-col bg-white">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-1">Vehicles</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Registry & History</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Total Fleet</p>
                    <p className="text-xl font-medium text-gray-900">{vehicles.length}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex mb-6">
                <div className="flex items-center gap-4 text-gray-400 bg-gray-50 px-4 py-2.5 rounded-sm w-96 border border-transparent focus-within:border-gray-200 transition">
                    <Search size={14} />
                    <input
                        placeholder="Search Plate, Make, or Owner..."
                        className="bg-transparent outline-none text-xs font-medium uppercase tracking-wide w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 z-10">
                        <tr>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">Vehicle</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">Plate Number</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">Owner</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredVehicles.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-400 italic font-light">
                                    {search ? 'No vehicles match your search.' : 'No vehicles found in registry.'}
                                </td>
                            </tr>
                        ) : (
                            filteredVehicles.map(vehicle => (
                                <tr
                                    key={vehicle._id}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    className="group hover:bg-gray-50 transition border-b border-gray-50 cursor-pointer"
                                >
                                    <td className="py-4">
                                        <div className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{vehicle.color} • {vehicle.vin || 'No VIN'}</div>
                                    </td>
                                    <td className="py-4">
                                        <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{vehicle.plateNumber}</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                <User size={12} />
                                            </div>
                                            <span className="text-gray-900">{vehicle.owner?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="text-gray-300 group-hover:text-black transition">
                                            <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedVehicle && (
                <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
            )}
        </div>
    );
}
