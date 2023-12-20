import express from 'express'
import apicache from 'apicache'
import { getAllProperties, getProperty, createProperty, updateProperty, deleteProperty, searchProperties, getFeaturedProperties } from '../controllers/propertyController.js'
import { verifyManagerOrAdmin } from '../middlewares/verifyManagerOrAdmin.js'

const router = express.Router()
const cache = apicache.middleware

// Routes and Controllers
router.route('/all')
    .get(cache('2 minutes'), getAllProperties)

router.route('/search')
    .get(searchProperties)

router.route('/create')
    .post(verifyManagerOrAdmin, createProperty)

router.route('/featured')
    .get(cache('2 minutes'), getFeaturedProperties)

router.route('/:propertyId')
    .get(cache('2 minutes'), getProperty)
    .patch(verifyManagerOrAdmin, updateProperty)
    .delete(verifyManagerOrAdmin, deleteProperty)


export default router;