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
    static async update(id: number, title: string, type: string, eventName: string): Promise<Widget | null> {
        const sql = `
      UPDATE widgets 
      SET title = $1, type = $2, event_name = $3 
      WHERE id = $4 
      RETURNING *;
    `;
        const { rows } = await query<Widget>(sql, [title, type, eventName, id]);
        return rows[0] || null;
    }
    static async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM widgets WHERE id = $1 RETURNING id;`;
        const { rowCount } = await query(sql, [id]);
        // rowCount akan > 0 jika ada data yang berhasil dihapus
        return (rowCount ?? 0) > 0;
    }

    static async findByDashboardId(dashboardId: number): Promise<Widget[]> {
        const sql = `SELECT * FROM widgets WHERE dashboard_id = $1 ORDER BY created_at DESC`;
        const { rows } = await query<Widget>(sql, [dashboardId]);
        return rows;
    }

}

