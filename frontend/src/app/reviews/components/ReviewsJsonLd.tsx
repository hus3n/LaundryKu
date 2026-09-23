import React from 'react';
import { Review } from '@/types';

interface ReviewsJsonLdProps {
  reviews: Review[];
  averageRating: string;
  totalCount: number;
}

export default function ReviewsJsonLd({
  reviews,
  averageRating,
  totalCount,
}: ReviewsJsonLdProps) {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.com').replace(/\/$/, '');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ulasan & Testimoni Pelanggan',
        item: `${siteUrl}/reviews`,
      },
    ],
  };

  const productReviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'LaundryKu POS Kasir Laundry',
    image: `${siteUrl}/logo/laundryku.png`,
    description:
      'Software POS kasir dan sistem manajemen laundry digital otomatis di Indonesia dengan notifikasi WhatsApp otomatis gratis.',
    brand: {
      '@type': 'Brand',
      name: 'LaundryKu',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: Math.max(totalCount, 1).toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.name,
      },
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2026-01-01',
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {totalCount > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productReviewSchema) }}
        />
      )}
    </>
  );
}
