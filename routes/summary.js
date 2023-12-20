import express from 'express';
import { getSummaryNumbers } from '../controllers/summaryController.js';
import { verifyManagerOrAdmin } from '../middlewares/verifyManagerOrAdmin.js';
const router = express.Router();

router.route('/all')
    .get(verifyManagerOrAdmin, getSummaryNumbers)

export default router;