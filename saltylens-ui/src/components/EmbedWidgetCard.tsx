// src/components/EmbedWidgetCard.tsx
import React from 'react';

interface EmbedWidgetCardProps {
    title: string;
    value: string | number;
    unit?: string;
    badgeText?: string;
}

export const EmbedWidgetCard: React.FC<EmbedWidgetCardProps> = ({
    title,
    value,
    unit,
    badgeText = 'LIVE',
}) => {
    return (
        <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 font-sans shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{badgeText}</span>
                </div>
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-3xl font-black tracking-tight text-amber-400">{value}</span>
                {unit && <span className="text-xs text-slate-400">{unit}</span>}
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Powered by SaltyLens</span>
                <span>v1.0.0</span>
            </div>
        </div>
    );
};