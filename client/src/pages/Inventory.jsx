import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import AddInventoryModal from '../components/AddInventoryModal'; // Assumed reused or styled

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Stats
    const totalItems = items.length;
    const lowStockCount = items.filter(i => i.quantity <= i.lowStockThreshold).length;
    const totalValue = items.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);

    const fetchInventory = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/inventory', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this item permanently?')) return;
        try {
            await fetch(`http://localhost:5001/api/inventory/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchInventory();
        } catch (err) {
            console.error(err);
        }
    };

    // Filtered Items
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading Inventory...</div>;

    return (
        <div className="p-8 h-full flex flex-col bg-white">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-1">Inventory</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Stock Management</p>
                </div>

                <div className="flex gap-12 mt-8 md:mt-0">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Total Valuation</p>
                        <p className="text-xl font-medium text-gray-900">${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Alerts</p>
                        <p className={`text-xl font-medium ${lowStockCount > 0 ? 'text-red-500' : 'text-gray-900'}`}>{lowStockCount}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4 text-gray-400 bg-gray-50 px-4 py-2.5 rounded-sm w-96 border border-transparent focus-within:border-gray-200 transition">
                    <Search size={14} />
                    <input
                        placeholder="Search SKU or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-xs font-medium uppercase tracking-wide w-full"
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2"
                >
                    <Plus size={14} /> Add Stock
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 z-10">
                        <tr>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-24">SKU</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Stock</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Price</th>
                            <th className="py-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-gray-400 italic font-light">
                                    {items.length === 0 ? 'Inventory is empty. Add your first item.' : 'No items match your search.'}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map(item => (
                                <tr key={item._id} className="group hover:bg-gray-50 transition border-b border-gray-50">
                                    <td className="py-4 font-mono text-gray-500 text-xs">{item.sku}</td>
                                    <td className="py-4 font-medium text-gray-900">
                                        {item.name}
                                        {item.quantity <= item.lowStockThreshold && (
                                            <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                                Low Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 text-gray-500 text-xs uppercase tracking-wide">{item.category}</td>
                                    <td className={`py-4 text-right font-medium ${item.quantity <= item.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                                        {item.quantity}
                                    </td>
                                    <td className="py-4 text-right text-gray-500 font-mono text-xs">${item.price.toFixed(2)}</td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-gray-300 hover:text-red-600 transition p-2"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Placeholder (Reusing logic but assumes styling matches) */}
            {showModal && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {/* Simplified wrapper to inject minimal style into the reused modal if needed, 
                        or we can fully replace AddInventoryModal content next. 
                        For now, let's assume we'll update that component too. */
                    }
                    <AddInventoryModal onClose={() => setShowModal(false)} onAdded={fetchInventory} />
                </div>
            )}
        </div>
    );
}
