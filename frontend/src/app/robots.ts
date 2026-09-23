import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://laundryku.com').replace(/\/$/, '');

  const standardDisallow = [
    '/admin/',
    '/superadmin/',
    '/karyawan/',
    '/api/',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/reset-password/',
  ];

  const standardAllow = [
    '/',
    '/llms.txt',
    '/llms-full.txt',
    '/*.png$',
    '/*.ico$',
    '/*.svg$',
    '/*.jpg$',
    '/*.jpeg$',
    '/*.webp$',
    '/_next/static/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: standardAllow,
        disallow: standardDisallow,
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: standardDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: standardAllow,
        disallow: standardDisallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
