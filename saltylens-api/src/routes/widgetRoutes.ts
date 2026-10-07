import { Router } from 'express';
import { WidgetController } from '../controllers/widgetController.js';

const router = Router();

router.get('/', WidgetController.getWidget);
router.post('/', WidgetController.createWidget);
router.put('/:id', WidgetController.updateWidget);
router.delete('/:id', WidgetController.deleteWidget);

export default router;
