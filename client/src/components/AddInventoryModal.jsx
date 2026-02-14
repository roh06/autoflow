import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRight } from 'lucide-react';

export default function AddInventoryModal({ onClose, onAdded }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        category: '',
        quantity: '',
        price: '',
        lowStockThreshold: 5
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5001/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            onAdded();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-gray-900">Add Stock Item</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">New Inventory Entry</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition"><X size={20} className="text-gray-400 hover:text-black" /></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-xs font-medium uppercase tracking-wide">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Item Name</label>
                            <input
                                className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                                placeholder="e.g. Microfiber Towels"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">SKU / Code</label>
                                <input
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300 font-mono uppercase"
                                    value={newItem.sku}
                                    onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
                                    required
                                    placeholder="MFT-001"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Category</label>
                                <select
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition bg-transparent"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Consumables">Consumables</option>
                                    <option value="Tools">Tools</option>
                                    <option value="Parts">Parts</option>
                                    <option value="Merchandise">Merchandise</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={newItem.quantity}
                                    onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                                    required
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Unit Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={newItem.price}
                                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Low Alert</label>
                                <input
                                    type="number"
                                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-300"
                                    value={newItem.lowStockThreshold}
                                    onChange={e => setNewItem({ ...newItem, lowStockThreshold: e.target.value })}
                                    placeholder="5"
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-black text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex justify-between items-center group mt-8">
                            {loading ? 'Adding...' : 'Add to Inventory'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
