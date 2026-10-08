import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController.js";

const router = Router();

router.get('/data', AnalyticsController.getWidgetData);
router.post('/events', AnalyticsController.trackEvents);

export default router;