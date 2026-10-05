import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Key,
    Plus,
    Layers,
    Activity,
    MoreHorizontal
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
import type { MetricCardData, TimeSeriesPoint, WidgetType } from '../types/dashboard';
import { CreateWidgetModal } from './CreateWidgetModal';

const MOCK_METRICS: MetricCardData[] = [
    { id: 'm1', title: 'Total Ingested Events', value: '1,284,900', change: '+14.2%', isPositive: true },
    { id: 'm2', title: 'Active Embed Sessions', value: '42,105', change: '+8.1%', isPositive: true },
    { id: 'm3', title: 'Avg API Response Time', value: '14ms', change: '-2ms', isPositive: true },
];

const MOCK_TIME_SERIES: TimeSeriesPoint[] = [
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

    const handleCreateWidget = (data: { title: string; type: WidgetType; eventName: string }) => {
        console.log('New Widget Config:', data);
    };

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
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Widget</span>
                    </button>
                </div>
            </header>

            {/* Top Stat Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {MOCK_METRICS.map((metric) => (
                    <div key={metric.id} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-zinc-400">{metric.title}</span>
                            <Activity className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-bold tracking-tight text-zinc-100">{metric.value}</span>
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {metric.change}
                            </span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Main Chart Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Line Chart Widget */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-zinc-200">Real-time Event Ingestion</h3>
                        </div>
                        <button className="text-zinc-500 hover:text-zinc-300 transition">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_TIME_SERIES}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="timestamp" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#f4f4f5' }}
                                />
                                <Line type="monotone" dataKey="events" stroke="#e4e4e7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart Widget */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-zinc-200">Active Unique Sessions</h3>
                        </div>
                        <button className="text-zinc-500 hover:text-zinc-300 transition">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_TIME_SERIES}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="timestamp" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                                />
                                <Bar dataKey="uniqueUsers" fill="#71717a" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <CreateWidgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateWidget}
            />
        </div>
    );
};