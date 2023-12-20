import express from 'express';
import apicache from 'apicache';
import { getAllBlogs, getBlogById, getLatestBlogs } from '../controllers/blogController.js';

const router = express.Router();
const cache = apicache.middleware;

router.route('/all')
    .get(cache('5 minutes'), getAllBlogs)

router.route('/latest')
    .get(cache('2 minutes'), getLatestBlogs)

router.route('/post/:slug')
    .get(cache('5 minutes'), getBlogById)

export default router;