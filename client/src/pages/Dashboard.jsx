import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import Inventory from './Inventory';
import VehicleList from '../components/VehicleList';
import Profile from '../components/Profile';
import AddJobModal from '../components/AddJobModal';
import { Plus, LayoutGrid, Settings, LogOut, Search, Package, Command, Car } from 'lucide-react';

export default function Dashboard() {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'inventory', 'vehicles', 'profile'
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleJobCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900">
            {/* Sidebar - Minimal Light */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-20">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif font-bold text-lg">A</div>
                    <span className="ml-3 font-medium tracking-wide uppercase text-sm">Autoflow</span>
                </div>

                <nav className="flex-1 p-6 space-y-1">
                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest transition rounded-sm ${activeTab === 'shop' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                    >
                        <LayoutGrid size={16} strokeWidth={1.5} /> Shop Floor
                    </button>
                    <button
                        onClick={() => setActiveTab('vehicles')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest transition rounded-sm ${activeTab === 'vehicles' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                    >
                        <Car size={16} strokeWidth={1.5} /> Vehicles
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest transition rounded-sm ${activeTab === 'inventory' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                    >
                        <Package size={16} strokeWidth={1.5} /> Inventory
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest transition rounded-sm ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                    >
                        <Settings size={16} strokeWidth={1.5} /> Settings
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition mt-2">
                        <LogOut size={16} strokeWidth={1.5} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden bg-white">
                {/* Header - Transparent/Minimal */}
                <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-6">
                        {/* Garage Name Badge */}
                        <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-bold uppercase tracking-wide text-gray-900">
                                {user?.garageName || 'My Garage'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 w-80 bg-gray-50 px-4 py-2 rounded-sm border border-transparent focus-within:border-gray-200 transition">
                            <Search size={16} strokeWidth={1.5} />
                            <input
                                placeholder="Search..."
                                className="bg-transparent outline-none text-gray-900 placeholder-gray-400 w-full text-xs font-medium uppercase tracking-wide"
                            />
                            <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-400 hidden lg:inline-block"><Command size={10} className="inline" /> K</span>
                        </div>
                    </div>

                    {activeTab === 'shop' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2"
                        >
                            <Plus size={14} /> New Ticket
                        </button>
                    )}
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'shop' ? (
                        <div className="p-8 h-full w-full overflow-x-auto flex flex-col bg-gray-50/50">
                            <div className="mb-8 flex items-end justify-between relative z-10 flex-shrink-0">
                                <div>
                                    <h2 className="text-2xl font-light text-gray-900 tracking-tight">Workflow</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Operations</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden relative z-10">
                                <KanbanBoard key={refreshKey} />
                            </div>
                        </div>
                    ) : activeTab === 'vehicles' ? (
                        <VehicleList />
                    ) : activeTab === 'inventory' ? (
                        <Inventory />
                    ) : (
                        <Profile />
                    )}
                </div>
            </main>

            {showModal && (
                <AddJobModal
                    onClose={() => setShowModal(false)}
                    onJobCreated={handleJobCreated}
                />
            )}
        </div>
    );
}
