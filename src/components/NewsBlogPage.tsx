import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  TrendingUp,
  ChevronRight,
  Zap,
  Newspaper,
  ArrowRight,
  User,
  Share2,
  Check,
  Sparkles,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { BlogPost, ToolConfig } from '../types';
import { blogService } from '../services/blogService';
import { getToolBySlug, getAllToolConfigs } from '../data/toolsConfig';
import { useI18n, getLocalizedBlogPost, getLocalizedToolConfig } from '../i18n/I18nContext';

interface NewsBlogPageProps {
  slug: string;
  onNavigate: (view: any, catFilter?: any, toolSlug?: string, categorySlug?: string) => void;
}

/* ─── Inline markdown helper ─── */
function inlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={match.index}><em>{match[2]}</em></strong>);
    else if (match[3]) parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[3]}</strong>);
    else if (match[4]) parts.push(<em key={match.index} className="italic text-slate-800">{match[4]}</em>);
    else if (match[5]) parts.push(<code key={match.index} className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-mono border border-orange-200/60">{match[5]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : React.createElement(React.Fragment, null, ...parts);
}

/* ─── Markdown block renderer ─── */
function renderMarkdown(raw: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Table
    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].match(/^\|[-| :]+\|$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++; }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
      nodes.push(
        <div key={'table-' + i} className="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-xs bg-white">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-3 text-left font-bold text-slate-800">
                    {inlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-orange-50/30 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-slate-700 font-medium">
                      {inlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-8 mb-3 leading-tight flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-orange-500 shrink-0" />
          <span>{inlineMarkdown(line.slice(4))}</span>
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 pb-2 border-b border-orange-100 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-gradient-to-b from-orange-500 to-red-500 shrink-0" />
          <span>{inlineMarkdown(line.slice(3))}</span>
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={i} className="text-2xl sm:text-3xl font-black text-slate-900 mt-8 mb-4">
          {inlineMarkdown(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.trim() === '---') {
      nodes.push(<hr key={i} className="my-8 border-slate-200" />);
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      nodes.push(
        <blockquote key={i} className="border-l-4 border-orange-500 bg-orange-50/60 pl-4 pr-3 py-3 rounded-r-2xl my-5 text-xs sm:text-sm text-slate-800 italic shadow-2xs">
          {inlineMarkdown(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      nodes.push(
        <ol key={'ol-' + i} className="space-y-3 my-5 text-slate-700 text-sm sm:text-base leading-relaxed pl-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {ii + 1}
              </span>
              <span className="flex-1">{inlineMarkdown(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={'ul-' + i} className="space-y-2 my-4 pl-2 text-xs sm:text-sm text-slate-700">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2.5">
              <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shrink-0 shadow-xs" />
              <span className="flex-1">{inlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    nodes.push(
      <p key={i} className="text-slate-700 text-sm sm:text-base leading-relaxed my-4">
        {inlineMarkdown(line)}
      </p>
    );
    i++;
  }
  return nodes;
}

/* ─── Featured Interactive Tool Card for Google Discover ─── */
interface FeaturedToolCardProps {
  slug: string;
  onNavigate: NewsBlogPageProps['onNavigate'];
  index: number;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ slug, onNavigate, index }) => {
  const { t, language } = useI18n();
  const rawTool = getToolBySlug(slug);
  if (!rawTool) return null;
  const tool = getLocalizedToolConfig(rawTool, language);

  const catColors: Record<string, { bg: string; badge: string; btn: string }> = {
    video: { bg: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-800', btn: 'bg-violet-600 hover:bg-violet-700' },
    audio: { bg: 'from-pink-500 to-rose-600', badge: 'bg-rose-100 text-rose-800', btn: 'bg-rose-600 hover:bg-rose-700' },
    image: { bg: 'from-blue-500 to-cyan-600', badge: 'bg-blue-100 text-blue-800', btn: 'bg-blue-600 hover:bg-blue-700' },
    pdf: { bg: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-800', btn: 'bg-orange-600 hover:bg-orange-700' },
    default: { bg: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  };

  const scheme = catColors[tool.category] || catColors.default;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border-2 border-orange-100/80 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden">
      {/* Top Accent Line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${scheme.bg}`} />

      {/* Floating Tool Badge */}
      <div className="p-5 flex flex-col gap-3.5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${scheme.bg} flex items-center justify-center text-white text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
              {(tool as any).icon || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 uppercase">
                  {t.toolNumber}{index + 1}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${scheme.badge}`}>
                  {tool.category}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-orange-600 transition-colors">
                {tool.name}
              </h4>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          {tool.description || 'Convierte y procesa tus archivos al instante de forma 100% privada y gratuita en tu navegador.'}
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{t.free100Badge}</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{t.noSignupBadge}</span>
          </div>
        </div>

        {/* Direct Action Button */}
        <button
          onClick={() => onNavigate('tool-page', undefined, slug)}
          className={`mt-auto w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-98 transition-all`}
        >
          <Zap size={14} className="animate-pulse" />
          <span>{t.openTool} {tool.name}</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/* ─── Related News Card ─── */
interface RelatedNewsCardProps {
  post: BlogPost;
  onNavigate: NewsBlogPageProps['onNavigate'];
}

const RelatedNewsCard: React.FC<RelatedNewsCardProps> = ({ post, onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate('news-page' as any, undefined, post.slug)}
      className="group text-left flex gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200 transition-all shadow-xs hover:shadow-sm w-full"
    >
      {(post.mobileImage || post.desktopImage) && (
        <img
          src={post.mobileImage || post.desktopImage}
          alt={post.imageAlt || post.title}
          className="w-20 h-20 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
        />
      )}
      <div className="min-w-0 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wide mb-1 block">
            🔥 Tendencia
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </p>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <Clock size={10} /> {post.readingTime}
        </p>
      </div>
    </button>
  );
};

/* ─── Main Google Discover News Article Component ─── */
export const NewsBlogPage: React.FC<NewsBlogPageProps> = ({ slug, onNavigate }) => {
  const { t, language } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const rawFound = blogService.getPostBySlug(slug);
    const found = rawFound ? getLocalizedBlogPost(rawFound, language) : null;
    setPost(found);
    const allNews = blogService.getPostsByCategory('news_trend');
    setRelatedPosts(
      allNews
        .filter(p => p.slug !== slug)
        .slice(0, 4)
        .map(p => getLocalizedBlogPost(p, language))
    );

    if (found) {
      document.title = found.seoTitle || `${found.title} | ${t.newsFeedTitle} MediaConvert`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', found.seoMetaDescription || found.excerpt || '');

      // Schema.org structured data for Google Discover / News
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'discover-news-schema';
      schemaScript.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: found.h1 || found.title,
        description: found.seoMetaDescription || found.excerpt,
        image: [found.desktopImage, found.mobileImage].filter(Boolean),
        datePublished: found.publishedAt,
        dateModified: found.updatedAt || found.publishedAt,
        author: {
          '@type': 'Person',
          name: found.author || 'Equipo Editorial MediaConvert',
          jobTitle: found.authorRole || 'Especialista Multimedia'
        },
        publisher: {
          '@type': 'Organization',
          name: 'MediaConvert',
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': window.location.href
        }
      });
      const oldScript = document.getElementById('discover-news-schema');
      if (oldScript) oldScript.remove();
      document.head.appendChild(schemaScript);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language, t.newsFeedTitle]);

  const handleShare = async () => {
    if (!post) return;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-sm">
          <Newspaper size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.articleNotFound}</h2>
        <p className="text-slate-500 mb-6 text-sm max-w-sm">{t.articleNotFoundDesc}</p>
        <button
          onClick={() => onNavigate('news-list' as any)}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          {t.viewAllNewsBtn}
        </button>
      </div>
    );
  }

  // Get up to 3 featured tools
  const featuredToolSlugs = (post.featuredToolSlugs && post.featuredToolSlugs.length > 0)
    ? post.featuredToolSlugs.slice(0, 3)
    : (post.recommendedToolSlugs || []).slice(0, 3);

  const dateLocale = language === 'us' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'es-ES';

  return (
    <article className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-0">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          onClick={() => onNavigate('news-list' as any)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft size={13} />
          <span>{t.newsFeedTitle}</span>
        </button>

        {/* Share Button (Mobile & Desktop) */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-xs"
          title={t.shareArticle}
        >
          {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
          <span>{copied ? t.linkCopied : t.shareArticle}</span>
        </button>
      </div>

      {/* Google Discover Trending Badge */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-[11px] sm:text-xs font-black px-3.5 py-1 rounded-full shadow-md shadow-orange-500/25 uppercase tracking-wide">
          <Flame size={13} className="animate-bounce" />
          <span>{t.newsDiscoverBadge}</span>
        </span>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {post.readingTime || `3 ${t.minRead}`}
        </span>
      </div>

      {/* Main H1 Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
        {post.h1 || post.title}
      </h1>

      {/* Excerpt / Lead Paragraph */}
      <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mb-6 border-l-4 border-orange-500 pl-4 bg-orange-50/40 py-2 rounded-r-xl">
        {post.excerpt}
      </p>

      {/* Author Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 mb-6 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            <User size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1 font-bold text-slate-900 text-xs sm:text-sm">
              <span>{post.author}</span>
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px]">
                ✓
              </span>
            </div>
            {post.authorRole && (
              <span className="text-slate-400 text-[11px] block">{post.authorRole}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-orange-500" />
            {new Date(post.publishedAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-orange-500" />
            {post.readingTime}
          </span>
        </div>
      </div>

      {/* Hero Responsive Picture (Desktop 16:9 vs Mobile Portrait / Square) */}
      {(post.desktopImage || post.mobileImage) && (
        <div className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-slate-100 relative group">
          <picture>
            {post.mobileImage && <source media="(max-width: 640px)" srcSet={post.mobileImage} />}
            <img
              src={post.desktopImage || post.mobileImage}
              alt={post.imageAlt || post.title}
              className="w-full h-56 sm:h-80 md:h-96 object-cover group-hover:scale-102 transition-transform duration-700"
            />
          </picture>
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Smartphone size={10} />
            <span>{t.mobileOptimized}</span>
          </div>
        </div>
      )}

      {/* ─── 3 EMBEDDED INTERACTIVE TOOLS SECTION (TOP/MIDDLE CALLOUT) ─── */}
      {featuredToolSlugs.length > 0 && (
        <section className="my-8 p-5 sm:p-7 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50/60 rounded-3xl border-2 border-orange-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                <Zap size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {t.featuredToolsForArticle}
                </h2>
                <p className="text-xs text-slate-600">
                  {t.tryDirectlyInBrowser}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-white text-orange-700 rounded-full border border-orange-200 self-start sm:self-auto shadow-xs">
              ⚡ {featuredToolSlugs.length} {t.readyToolsCount}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {featuredToolSlugs.map((toolSlug, idx) => (
              <FeaturedToolCard
                key={toolSlug}
                slug={toolSlug}
                onNavigate={onNavigate}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Blog Article Rich Content */}
      <div className="prose prose-slate max-w-none mb-10 text-slate-800">
        {renderMarkdown(post.content)}
      </div>

      {/* SEO Tags / Categorías */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-10 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Tag size={13} className="text-orange-500" />
            <span>{t.seoTagsAndRelated}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white text-slate-700 text-xs rounded-xl font-bold border border-slate-200 hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related News Carousel / Grid */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-slate-200 pt-8 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Newspaper size={18} className="text-orange-500" />
              <span>{t.moreDiscoverNews}</span>
            </h3>
            <button
              onClick={() => onNavigate('news-list' as any)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              {t.viewAll} <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedPosts.map(rp => (
              <RelatedNewsCard
                key={rp.id}
                post={rp}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Conversion CTA */}
      <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-3 border border-orange-500/30">
          <Sparkles size={12} />
          <span>MediaConvert Suite 2026</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black mb-2">
          {t.needConvertToday}
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
          {t.suiteSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('tools')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-black text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-500/30 active:scale-95"
          >
            <Zap size={15} />
            <span>{t.exploreAllToolsBtn}</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};
