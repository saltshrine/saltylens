import { query } from "../config/db.js"

export class AnalyticsModel {
    static async getMetricData(eventName: string): Promise<number> {
        const sql = `select count(*) as total FROM analytics_event WHERE event_name = $1`
        const { rows } = await query(sql, [eventName]);
        return parseInt(rows[0].total || '0', 10);
    }
    static async getTimeSeriesData(eventName: string): Promise<any[]> {
        const sql = `
        SELECT TO_CHAR(DATE_TRUNC('hour', created_at), 'HH24: 00') as timestamp,
        COUNT(*) as events
        FROM analytics_events
        WHERE event_name = $1
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY DATE_TRUNC('hour', created_at) ASC
        LIMIT 24;
        `;
        const { rows } = await query(sql, [eventName]);
        return rows;
    }

    static async trackEvents(tenantId: number, event_name: string, payload: any = {}): Promise<void> {
        const sql = `
        INSERT INTO analytics_events (tenant_id, event_name, payload, created_at)
        VALUES ($1, $2, $3, now())
        `;
        await query(sql, [tenantId, event_name, JSON.stringify(payload)]);
    }

}
