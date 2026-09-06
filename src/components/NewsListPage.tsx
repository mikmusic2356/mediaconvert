import React, { useEffect, useState, useMemo } from 'react';
import { Clock, Calendar, ArrowRight, Newspaper, Zap, Flame, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { useI18n, getLocalizedBlogPost } from '../i18n/I18nContext';

interface NewsListPageProps {
  onNavigate: (view: any, catFilter?: any, toolSlug?: string, categorySlug?: string) => void;
}

export const NewsListPage: React.FC<NewsListPageProps> = ({ onNavigate }) => {
  const { t, language } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    const rawNews = blogService.getPostsByCategory('news_trend');
    const localizedNews = rawNews.map(p => getLocalizedBlogPost(p, language));
    setPosts(localizedNews);
    document.title = `🔥 ${t.newsFeedTitle} 2026 — Google Discover | MediaConvert`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t.newsFeedSubtitle);
  }, [language, t]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'all') return posts;
    return posts.filter(p => (p.tags || []).includes(selectedTag));
  }, [posts, selectedTag]);

  const localeCode = language === 'us' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'es-ES';

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      {/* Google Discover Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-white/30">
            <Flame size={14} className="animate-bounce text-amber-300" />
            <span>{t.newsDiscoverBadge}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight mb-3">
            {t.newsFeedTitle}
          </h1>
          
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-4">
            {t.newsFeedSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/80">
            <span className="flex items-center gap-1">✓ 100% Mobile Responsive</span>
            <span>•</span>
            <span className="flex items-center gap-1">✓ 3 {t.interactiveTools}</span>
            <span>•</span>
            <span className="flex items-center gap-1">✓ 2026 Tech Standards</span>
          </div>
        </div>
      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedTag === 'all'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
            }`}
          >
            🔥 {t.allTrends} ({posts.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Google Discover Articles */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 p-8">
          <Newspaper size={44} className="mx-auto mb-3 text-orange-300 animate-pulse" />
          <p className="font-bold text-slate-700 text-base">{t.noToolsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              onClick={() => onNavigate('news-page' as any, undefined, post.slug)}
              className="group cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Responsive picture */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <picture>
                    {post.mobileImage && <source media="(max-width: 640px)" srcSet={post.mobileImage} />}
                    <img
                      src={post.desktopImage || post.mobileImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </picture>
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    {idx === 0 && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Flame size={10} /> DISCOVER 2026
                      </span>
                    )}
                  </div>
                  {post.featuredToolSlugs && post.featuredToolSlugs.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Zap size={10} className="text-orange-400" />
                      <span>{post.featuredToolSlugs.length} {t.tools}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-2.5">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(post.publishedAt).toLocaleDateString(localeCode, { month: 'short', day: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readingTime}
                  </span>
                </div>
                <span className="text-orange-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {t.readArticle} <ArrowRight size={12} />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-14 p-6 sm:p-8 bg-slate-900 rounded-3xl text-center text-white shadow-xl">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-3">
          <Sparkles size={12} />
          <span>MediaConvert Hub 2026</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black mb-2">{t.moreToolsHub}</h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
          {t.moreToolsHubDesc}
        </p>
        <button
          onClick={() => onNavigate('tools')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30 active:scale-95"
        >
          <Zap size={15} />
          <span>{t.exploreToolsCatalog}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
};
