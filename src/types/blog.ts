export interface BlogPost {
  id: string;
  slug: string;
  /** Category distinguishes guide/tutorial articles from news & trend articles */
  category?: 'guide' | 'news_trend';
  toolSlug?: string;
  title: string;
  h1: string;
  excerpt: string;
  content: string;
  desktopImage?: string;
  mobileImage?: string;
  imageAlt?: string;
  author: string;
  authorRole?: string;
  publishedAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  readingTime: string;
  tags: string[];
  seoTitle: string;
  seoMetaDescription: string;
  seoKeywords: string[];
  recommendedToolSlugs: string[];
  /** Up to 3 featured conversion tool slugs embedded in news/trend articles */
  featuredToolSlugs?: string[];
}

