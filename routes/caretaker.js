import express from 'express';
import { verifyManagerOrAdmin } from '../middlewares/verifyManagerOrAdmin.js';
import { createCaretaker, deleteCaretaker, getAllCaretakers, getCaretaker, searchCaretakers, updateCaretaker } from '../controllers/caretakerController.js';
import { getCaretakerByIdentifier } from '../middlewares/getCaretakerByIdentifier.js';
const router = express.Router();

// Routes and Controllers
router.route('/all')
    .get(verifyManagerOrAdmin, getAllCaretakers)

router.route('/create')
    .post(verifyManagerOrAdmin, createCaretaker)

router.route('/search')
    .get(verifyManagerOrAdmin, searchCaretakers);

router.route('/:caretakerId')
    .get(verifyManagerOrAdmin, getCaretakerByIdentifier, getCaretaker)
    .patch(verifyManagerOrAdmin, getCaretakerByIdentifier, updateCaretaker)
    .delete(verifyManagerOrAdmin, getCaretakerByIdentifier, deleteCaretaker)

export default router;