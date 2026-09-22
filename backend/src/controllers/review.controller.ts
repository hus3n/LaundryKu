import { Request, Response, NextFunction } from 'express';
import { getReviews, createReview } from '../services/review.service.js';

export async function getReviewsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const bestOnly = req.query.bestOnly === 'true' || req.query.bestOnly === '1';

    const reviews = await getReviews({ limit, bestOnly });
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createReviewHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, storeName, role, rating, comment } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Nama pengulas wajib diisi.' });
      return;
    }

    if (!comment || !comment.trim()) {
      res.status(400).json({ success: false, error: 'Teks ulasan wajib diisi.' });
      return;
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      res.status(400).json({ success: false, error: 'Rating bintang harus antara 1 sampai 5.' });
      return;
    }

    let imageUrl: string | undefined = undefined;
    if (req.file) {
      imageUrl = `/uploads/reviews/${req.file.filename}`;
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
      imageUrl = req.body.imageUrl;
    }

    const review = await createReview({
      name,
      storeName,
      role,
      rating: parsedRating,
      comment,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Terima kasih atas ulasan dan apresiasi Anda untuk LaundryKu!',
      data: review,
    });
  } catch (error: any) {
    next(error);
  }
}
