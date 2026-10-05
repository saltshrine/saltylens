import { Router } from 'express';
import { WidgetController } from '../controllers/widgetController.js';

const router = Router();

router.get('/', WidgetController.getWidget);

router.post("/", WidgetController.createWidget);

export default router;
