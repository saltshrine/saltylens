import { Request, Response } from 'express';
import { WidgetModel } from '../models/widgetModel.js';
import { success } from 'zod';


export class WidgetController {
    static async createWidget(req: Request, res: Response): Promise<void> {
        try {
            const { title, type, eventName } = req.body;
            if (!title || !type || !eventName) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const newWidget = await WidgetModel.create(1, title, type, eventName);

            res.status(201).json({
                message: 'Widget created successfully',
                widget: newWidget
            });
        } catch (error) {
            console.error('Error creating widget:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async getWidget(req: Request, res: Response): Promise<void> {
        try {
            const widgets = await WidgetModel.findByDashboardId(1);
            res.json({ data: widgets });
        } catch (error) {
            console.error('Error fetching widgets', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async updateWidget(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const { title, type, eventName } = req.body;

            if (!title || !type || eventName) {
                res.status(400).json({ error: 'Missing required fiends' })
                return;
            }
            const updatedWidget = await WidgetModel.update(id, title, type, eventName);
            if (!updatedWidget) {
                res.status(404).json({ error: 'Widget not found' });
                return;
            }
            res.json({ message: 'Widget updated successfully', data: updatedWidget });
        } catch (error) {
            console.error('Error updating widget:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async deleteWidget(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const sucess = await WidgetModel.delete(id);

            if (!success) {
                res.status(404).json({ error: 'Widget Not Found' });
                return;
            }
            res.json({message: 'Widget delete sucssessfully'})
        } catch (error) {
            console.error('Error deleting widget:', error);
            res.status(500).json({error: 'Internal Server Error'});
            
        }

    }
}




