import { Request, Response } from "express";
import { AnalyticsModel } from "../models/analyticsModel.js";

export class AnalyticsController {
    static async getWidgetData(req: Request, res: Response): Promise<void> {
        try {
            const { eventName, type } = req.query;
            if (!eventName || !type) {
                res.status(400).json({ error: 'Missing eventName or type in query parametes' });
                return;
            }
            if (type == 'METRIC') {
                const total = await AnalyticsModel.getMetricData(eventName as string);
                res.json({ data: { value: total } });
            } else {
                const timeSeries = await AnalyticsModel.getTimeSeriesData(eventName as string);
                res.json({ data: timeSeries });
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}