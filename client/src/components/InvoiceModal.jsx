import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Printer, Download, Mail, Building2, Phone, MapPin } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export default function InvoiceModal({ job, onClose }) {
    const { token, user } = useAuth();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                // Try create/fetch invoice
                const res = await fetch('http://localhost:5001/api/invoices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ jobId: job._id })
                });
                const data = await res.json();
                setInvoice(data);
            } catch (err) {
                console.error("Error fetching invoice:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [job, token]);

    if (loading) return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Generating Invoice...</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-100 w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Toolbar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Invoice #{invoice?.invoiceNumber}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{invoice?.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                            <Printer size={14} /> Print
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Invoice Preview Area */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-50">
                    {/* A4 Paper Container */}
                    <div ref={componentRef} className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-12 text-gray-900 font-sans relative">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-16">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif font-bold text-lg">A</div>
                                    <span className="font-bold tracking-wide uppercase text-lg">Autoflow</span>
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p className="font-bold text-gray-900 uppercase tracking-wide">{user.garageName}</p>
                                    <p>123 Service Lane</p>
                                    <p>Auto City, AC 56001</p>
                                    <p>GSTIN: 29ABCDE1234F1Z5</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">INVOICE</h1>
                                <p className="text-sm font-mono text-gray-500">#{invoice?.invoiceNumber}</p>
                                <div className="mt-4 text-xs text-gray-500 space-y-1">
                                    <p>Date: {new Date(invoice?.createdAt).toLocaleDateString()}</p>
                                    <p>Due Date: {new Date(invoice?.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="mb-16 border-t border-gray-100 pt-8">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Bill To</p>
                            <h3 className="text-xl font-light text-gray-900 mb-2">{job.customer.name}</h3>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>{job.customer.phone}</p>
                                <p>{job.customer.email}</p>
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-sm inline-block">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Vehicle Details</p>
                                <p className="text-sm font-medium text-gray-900">{job.vehicle.year} {job.vehicle.make} {job.vehicle.model}</p>
                                <p className="text-xs font-mono text-gray-500 mt-1 uppercase">{job.vehicle.plateNumber}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full mb-12">
                            <thead>
                                <tr className="border-b-2 border-black text-[10px] font-bold uppercase tracking-widest text-gray-900 text-left">
                                    <th className="py-3">Description</th>
                                    <th className="py-3 text-center">Qty</th>
                                    <th className="py-3 text-right">Unit Price</th>
                                    <th className="py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {invoice?.items.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="py-4 font-medium text-gray-800">{item.description}</td>
                                        <td className="py-4 text-center text-gray-500">{item.quantity}</td>
                                        <td className="py-4 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                                        <td className="py-4 text-right font-medium text-gray-900">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${invoice?.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Tax (18% GST)</span>
                                    <span>${invoice?.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-light text-gray-900 border-t border-black pt-4 mt-4">
                                    <span>Total</span>
                                    <span>${invoice?.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-12 left-12 right-12 border-t border-gray-100 pt-8 text-center">
                            <p className="text-xs text-gray-400 font-medium">Thank you for choosing {user.garageName}.</p>
                            <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest">Authorized Service Center</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
