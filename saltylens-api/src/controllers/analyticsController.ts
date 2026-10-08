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

    static async trackEvents(req: Request, res: Response): Promise<void> {
        try {
            const tenantId = 1;
            const { event_name, payload } = req.body;

            if (!event_name) {
                res.status(400).json({ error: 'event_name is required' });
                return;
            }
            await AnalyticsModel.trackEvents(tenantId, event_name, payload || {});

            res.status(201).json({ message: 'Event tracked successfully' });

        } catch (error) {
            console.error('Error tracking event', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}