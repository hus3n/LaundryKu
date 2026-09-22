import { Router } from 'express';
import { getReviewsHandler, createReviewHandler } from '../controllers/review.controller.js';
import { uploadReviewImage } from '../middleware/upload.js';

const router = Router();

// GET /api/reviews - Dapatkan ulasan (publik)
router.get('/', getReviewsHandler);

// POST /api/reviews - Kirim ulasan baru dengan foto opsional (publik)
router.post('/', uploadReviewImage.single('image'), createReviewHandler);

export default router;
