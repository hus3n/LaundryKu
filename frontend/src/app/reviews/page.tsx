'use client';

import React, { useState, useEffect } from 'react';
import ReviewModal from '@/components/ui/ReviewModal';
import { api } from '@/lib/api';
import { Review } from '@/types';
import { RatingFilter } from './types';
import ReviewsHeader from './components/ReviewsHeader';
import ReviewsHero from './components/ReviewsHero';
import ReviewsFilterBar from './components/ReviewsFilterBar';
import ReviewCard from './components/ReviewCard';
import ReviewsEmptyState from './components/ReviewsEmptyState';
import ReviewImageLightbox from './components/ReviewImageLightbox';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<RatingFilter>('all');
  const [filterWithPhoto, setFilterWithPhoto] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat ulasan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewCreated = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (filterWithPhoto && !r.imageUrl) return false;
    return true;
  });

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#010E1C] dark:text-[#F5EACA] transition-colors duration-200">
      <ReviewsHeader onOpenModal={() => setIsModalOpen(true)} />

      <ReviewsHero
        averageRating={averageRating}
        reviewCount={reviews.length}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <ReviewsFilterBar
        reviews={reviews}
        filterRating={filterRating}
        onFilterRatingChange={setFilterRating}
        filterWithPhoto={filterWithPhoto}
        onFilterWithPhotoChange={setFilterWithPhoto}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl dark:bg-[#012040]/40 bg-slate-200/60 animate-pulse border border-slate-200 dark:border-[#1DA9D0]/10"
              />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <ReviewsEmptyState onOpenModal={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onImageClick={(url) => setSelectedImage(url)}
              />
            ))}
          </div>
        )}
      </section>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReviewCreated}
      />

      <ReviewImageLightbox
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
