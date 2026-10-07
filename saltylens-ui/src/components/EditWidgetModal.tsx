import React, { useState, useEffect } from 'react';

interface EditWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    widget: any;
}

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    widget
}) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('METRIC');
    const [eventName, setEventName] = useState('');

    // Isi form otomatis saat modal dibuka dan data widget tersedia
    useEffect(() => {
        if (widget) {
            setTitle(widget.title);
            setType(widget.type);
            setEventName(widget.event_name);
        }
    }, [widget]);

    if (!isOpen || !widget) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/widgets/${widget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, type, eventName }),
            });

            if (response.ok) {
                onSuccess(); // Refresh data di dashboard
                onClose(); // Tutup modal
            } else {
                console.error('Gagal mengupdate widget');
            }
        } catch (error) {
            console.error('Terjadi kesalahan jaringan:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-zinc-100">Edit Widget</h2>
                    <p className="text-sm text-zinc-400 mt-1">Update konfigurasi widget Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Widget Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 transition"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Widget Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 transition"
                        >
                            <option value="METRIC">Metric (Number)</option>
                            <option value="LINE">Line Chart</option>
                            <option value="BAR">Bar Chart</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Event Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 transition"
                            required
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-900 rounded-md hover:bg-white transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};