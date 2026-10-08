import React, { useState, useEffect } from 'react';
import {
    Layers,
    Key,
    Plus,
    Activity,
    MoreHorizontal,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';
import type { WidgetType } from '../types/dashboard';
import { CreateWidgetModal } from './CreateWidgetModal';
import { EditWidgetModal } from './EditWidgetModal';

// Kita pakai mock data untuk chart-nya dulu karena tabel analytics_events kita belum ada isinya
const MOCK_TIME_SERIES = [
    { timestamp: '00:00', events: 2400, uniqueUsers: 400 },
    { timestamp: '04:00', events: 1398, uniqueUsers: 210 },
    { timestamp: '08:00', events: 9800, uniqueUsers: 2290 },
    { timestamp: '12:00', events: 12080, uniqueUsers: 3100 },
    { timestamp: '16:00', events: 8900, uniqueUsers: 2500 },
    { timestamp: '20:00', events: 4800, uniqueUsers: 1200 },
];

export const DashboardView: React.FC = () => {
    const [apiKey] = useState<string>('sl_live_9f8a7b6c5d4e3f2a1');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk menyimpan data widget dari backend
    const [widgets, setWidgets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingWidget, setEditingWidget] = useState<any>(null);

    // Fungsi untuk fetch data widget
    const fetchWidgets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/widgets');
            const result = await response.json();

            if (response.ok) {
                setWidgets(result.data);
            }
        } catch (error) {
            console.error('Error fetching widgets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteWidget = async (id: number) => {
        if (!window.confirm('Are you sure want to delete this widget?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/widgets/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Widget berhasil dihapus');
                // setWidgets(widgets.filter(widget => widget.id !== id));
                fetchWidgets();
            } else {
                console.error('Failed to delete widget!');
            }
        } catch (error) {
            console.error('Error deleting widget', error);

        }
    }
    // Komponen WidgetMenu terpisah supaya state 'isOpen'-nya tidak berantakan
    const WidgetMenu = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-zinc-500 hover:text-zinc-300 transition p-1 rounded-md hover:bg-zinc-800"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>

                {isOpen && (
                    <>
                        {/* Overlay untuk menutup dropdown kalau diklik di luar area */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        ></div>

                        <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-700/50 rounded-lg shadow-xl z-20 overflow-hidden">
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                                onClick={() => {
                                    setIsOpen(false);
                                    onEdit();
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition"
                                onClick={() => {
                                    setIsOpen(false);
                                    onDelete();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const WidgetCard = ({ widget, onEdit, onDelete }: { widget: any, onEdit: () => void, onDelete: () => void }) => {
        const [data, setData] = useState<any>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchAnalytics = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/analytics/data?eventName=${widget.event_name}&type=${widget.type}`);
                    const json = await res.json();
                    if (res.ok) {
                        setData(json.data);
                    }
                } catch (err) {
                    console.error('Error fetching analytics:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchAnalytics();
        }, [widget.event_name, widget.type]);

        if (widget.type === 'METRIC') {
            return (
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-zinc-400">{widget.title}</span>
                        <WidgetMenu onEdit={onEdit} onDelete={onDelete} />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold tracking-tight text-zinc-100">
                            {loading ? '...' : (data?.value || 0)}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">
                            Event: {widget.event_name}
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-5 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-200">{widget.title}</h3>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{widget.event_name}</span>
                    </div>
                    <WidgetMenu onEdit={onEdit} onDelete={onDelete} />
                </div>
                <div className="h-[250px] w-full">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">Loading data...</div>
                    ) : data && data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {widget.type === 'LINE' ? (
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis dataKey="timestamp" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }} />
                                    <Line type="monotone" dataKey="events" stroke="#e4e4e7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#fff' }} />
                                </LineChart>
                            ) : (
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis dataKey="timestamp" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                                    <Bar dataKey="events" fill="#71717a" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">No data recorded yet</div>
                    )}
                </div>
            </div>
        );
    };

    // Jalankan fetchWidgets saat komponen pertama kali dimuat
    useEffect(() => {
        fetchWidgets();
    }, []);

    // Fungsi ini dipanggil pas modal sukses nyimpen widget baru
    const handleCreateWidget = () => {
        fetchWidgets(); // Refresh data widget setelah bikin baru
    };

    // Pisahkan widget berdasarkan tipe untuk layout yang rapi
    const metricWidgets = widgets.filter(w => w.type === 'METRIC');
    const chartWidgets = widgets.filter(w => w.type === 'LINE' || w.type === 'BAR');

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans p-6 md:p-10 selection:bg-zinc-800">
            {/* Top Bar Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-zinc-800/50">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="bg-white/10 p-1.5 rounded-md border border-zinc-700/50">
                            <Layers className="h-5 w-5 text-zinc-100" />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">SaltyLens</h1>
                        <span className="bg-zinc-800/50 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-medium border border-zinc-700/50 uppercase tracking-widest">
                            Beta
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-md text-xs font-mono text-zinc-400">
                        <Key className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{apiKey}</span>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Widget</span>
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-pulse text-zinc-500">Loading your widgets...</div>
                </div>
            ) : widgets.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                    <p className="text-zinc-400 mb-4">No widgets found for this dashboard.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-zinc-100 text-sm font-medium hover:underline">
                        Create your first widget
                    </button>
                </div>
            ) : (
                <>
                    {/* Section: Metrics (Angka) */}
                    {metricWidgets.length > 0 && (
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {metricWidgets.map((widget) => (
                                <WidgetCard
                                    key={widget.id}
                                    widget={widget}
                                    onEdit={() => {
                                        setEditingWidget(widget);
                                    }}
                                    onDelete={() => handleDeleteWidget(widget.id)}
                                />
                            ))}
                        </section>
                    )}

                    {/* Section: Charts (Grafik) */}
                    {chartWidgets.length > 0 && (
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {chartWidgets.map((widget) => (
                                <WidgetCard
                                    key={widget.id}
                                    widget={widget}
                                    onEdit={() => {
                                        setEditingWidget(widget);
                                    }}
                                    onDelete={() => handleDeleteWidget(widget.id)}
                                />
                            ))}
                        </section>
                    )}
                </>
            )}

            <CreateWidgetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={fetchWidgets}
            />

            <EditWidgetModal
                isOpen={!!editingWidget}
                onClose={() => setEditingWidget(null)}
                onSuccess={fetchWidgets}
                widget={editingWidget}
            />
        </div>
    );
};