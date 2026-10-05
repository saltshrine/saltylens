export interface Tenant {
    id: number;
    name: string;
    api_key: string;
    created_at: Date;
}

export type WidgetType = 'LINE' | 'BAR' | 'METRIC';

export interface Widget {
    id: number;
    dashboard_id: number;
    title: string;
    type: WidgetType;
    event_name: string;
    config: Record<string, unknown>;
    created_at: Date;
}