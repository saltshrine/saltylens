export type WidgetType = 'LINE' | 'BAR' | 'METRIC';

export interface MetricCardData {
    id: string;
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
}

export interface TimeSeriesPoint {
    timestamp: string;
    events: number;
    uniqueUsers: number;
}

export interface WidgetConfig {
    id: string;
    title: string;
    type: WidgetType;
    description?: string;
}