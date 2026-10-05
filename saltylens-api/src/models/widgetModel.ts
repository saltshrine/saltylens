import { query } from "../config/db.js";
import { Widget } from '../types/index.js';

export class WidgetModel {
    static async create(
        dashboardId: number,
        title: string,
        type: string,
        eventName: string
    ): Promise<Widget> {
        const sql = `
        INSERT INTO widgets (dashboard_id, title, type, event_name, config)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;
        const config = JSON.stringify({ eventName });
        const values = [dashboardId, title, type, eventName, config];

        const { rows } = await query<Widget>(sql, values);
        return rows[0];

    }

    static async findByDashboardId(dashboardId: number): Promise<Widget[]> {
        const sql = `SELECT * FROM widget WHERE dashboard_id = $1 ORDER BY create_at DESC`;
        const { rows } = await query<Widget>(sql, [dashboardId]);
        return rows;
    }
}

