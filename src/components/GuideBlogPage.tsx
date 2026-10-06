import React, { useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Calendar,
  User,
  Tag,
  HelpCircle,
  ExternalLink,
  Layers,
  FileCheck,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { ToolConfig, FileCategory, BlogPost } from '../types';
import { getToolGuideArticle, getRelatedToolConfigs, getToolBySlug } from '../data/toolsConfig';
import { blogService } from '../services/blogService';
import { useI18n, getLocalizedBlogPost, getLocalizedToolConfig } from '../i18n/I18nContext';

/* ─── Inline markdown helper ─── */
function inlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_([^_]+)_|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={match.index} className="font-bold text-slate-900"><em className="italic">{match[2]}</em></strong>);
    else if (match[3]) parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[3]}</strong>);
    else if (match[4]) parts.push(<em key={match.index} className="italic text-slate-800">{match[4]}</em>);
    else if (match[5]) parts.push(<em key={match.index} className="italic text-slate-800">{match[5]}</em>);
    else if (match[6]) parts.push(<code key={match.index} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono border border-blue-200/60">{match[6]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : React.createElement(React.Fragment, null, ...parts);
}

/* ─── Markdown block renderer for Guide / Blog pages ─── */
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
                <tr key={ri} className="hover:bg-blue-50/30 transition-colors">
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
        <h3 key={i} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-8 mb-3 leading-tight flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="w-1.5 h-5 rounded-full bg-blue-600 shrink-0" />
          <span>{inlineMarkdown(line.slice(4))}</span>
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 pb-2 border-b border-blue-100 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600 shrink-0" />
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
        <blockquote key={i} className="border-l-4 border-blue-600 bg-blue-50/60 pl-4 pr-3 py-3 rounded-r-2xl my-5 text-xs sm:text-sm text-slate-800 italic shadow-2xs">
          {inlineMarkdown(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Numbered list
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
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {ii + 1}
              </span>
              <span className="flex-1">{inlineMarkdown(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul key={'ul-' + i} className="space-y-2.5 my-4 pl-2 text-xs sm:text-sm text-slate-700">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2.5">
              <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shrink-0 shadow-xs" />
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

interface GuideBlogPageProps {
  tool?: ToolConfig | null;
  slug?: string | null;
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string, categorySlug?: string) => void;
}

export const GuideBlogPage: React.FC<GuideBlogPageProps> = ({ tool: rawTool, slug: explicitSlug, onNavigate }) => {
  const { t, language } = useI18n();

  const activeSlug = explicitSlug || rawTool?.slug || '';

  // 1. Fetch dynamic blog post from blogService or fallback to tool-generated guide
  const customPost = useMemo(() => {
    if (!activeSlug) return null;
    const raw = blogService.getPostBySlug(activeSlug);
    return raw ? getLocalizedBlogPost(raw, language) : null;
  }, [activeSlug, language]);

  const resolvedTool = useMemo(() => {
    if (rawTool) return rawTool;
    if (customPost?.toolSlug) {
      const byToolSlug = getToolBySlug(customPost.toolSlug);
      if (byToolSlug) return byToolSlug;
    }
    if (activeSlug) {
      return getToolBySlug(activeSlug);
    }
    return undefined;
  }, [rawTool, customPost, activeSlug]);

  const tool = useMemo(() => {
    if (resolvedTool) {
      return getLocalizedToolConfig(resolvedTool, language);
    }
    // Fallback pseudo tool config for stand-alone guide articles
    return {
      id: customPost?.id || activeSlug || 'guide',
      slug: customPost?.slug || activeSlug || 'guide',
      routePath: `/convert/${activeSlug || 'jpg-to-png'}`,
      category: 'image' as FileCategory,
      type: 'convert' as const,
      name: customPost?.title || 'Guía Multimedia',
      shortName: customPost?.title || 'Guía Multimedia',
      title: customPost?.seoTitle || 'Guía Multimedia | MediaConvert',
      h1: customPost?.h1 || 'Guía Práctica de Conversión',
      description: customPost?.excerpt || 'Tutorial y guía práctica paso a paso.',
      contextualDescription: customPost?.excerpt || 'Aprende a transformar y optimizar archivos de forma privada.',
      inputFormats: ['ARCHIVOS'],
      outputFormats: ['OPTIMIZADO'],
      defaultOutputFormat: 'PNG',
      processingType: 'local' as const,
      maxFileSize: 2147483648,
      howToSteps: [],
      faq: [],
      features: ['Procesamiento local', 'Privacidad garantizada'],
      seo: {
        title: customPost?.seoTitle || 'Guía Multimedia | MediaConvert',
        metaDescription: customPost?.seoMetaDescription || 'Tutorial paso a paso.',
        canonical: `https://mediaconvert.online/guide/${activeSlug}`,
        keywords: []
      }
    } as ToolConfig;
  }, [resolvedTool, customPost, activeSlug, language]);

  const defaultGuide = useMemo(() => getToolGuideArticle(tool), [tool]);

  const allPosts = useMemo(() => {
    return blogService.getPublishedPosts().map(p => getLocalizedBlogPost(p, language));
  }, [language]);
  const otherPosts = useMemo(() => {
    return allPosts.filter(p => p.slug !== tool.slug && p.toolSlug !== tool.slug).slice(0, 3);
  }, [allPosts, tool.slug]);

  // Recommended tools from custom post or tool config
  const recommendedToolSlugs = customPost?.recommendedToolSlugs || tool.relatedTools || [];
  const recommendedTools = useMemo(() => {
    return recommendedToolSlugs
      .map(s => getToolBySlug(s))
      .filter((t): t is ToolConfig => t !== undefined)
      .map(t => getLocalizedToolConfig(t, language));
  }, [recommendedToolSlugs, language]);

  // Derived display fields
  const title = customPost?.title || defaultGuide.title;
  const h1 = customPost?.h1 || defaultGuide.h1;
  const excerpt = customPost?.excerpt || defaultGuide.summary;
  const readingTime = customPost?.readingTime || defaultGuide.readingTime || '2 min de lectura';
  const author = customPost?.author || 'Equipo Editorial MediaConvert';
  const authorRole = customPost?.authorRole || 'Especialista en Conversión Digital';
  const publishedAt = customPost?.publishedAt || '2026-03-01';
  const tags = customPost?.tags || ['Tutorial', tool.name, 'Conversión Online'];
  const desktopImg = customPost?.desktopImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const mobileImg = customPost?.mobileImage || desktopImg;
  const imgAlt = customPost?.imageAlt || title;

  // SEO tags, canonical, and Schema JSON-LD injection
  useEffect(() => {
    const rawTitle = customPost?.h1 || customPost?.title || customPost?.seoTitle || title;
    const seoTitle = rawTitle.includes('MediaConvert') ? rawTitle : `${rawTitle} | MediaConvert`;
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = customPost?.seoMetaDescription || excerpt.slice(0, 155);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://mediaconvert.online/guide/${tool.slug}`;

    const schemaId = 'guide-json-ld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          'headline': title,
          'description': excerpt,
          'image': [desktopImg, mobileImg],
          'datePublished': publishedAt,
          'author': {
            '@type': 'Person',
            'name': author
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'MediaConvert',
            'url': 'https://mediaconvert.online'
          }
        },
        {
          '@type': 'HowTo',
          'name': h1,
          'description': excerpt,
          'step': defaultGuide.stepByStep?.map((s) => ({
            '@type': 'HowToStep',
            'position': s.step,
            'name': s.title,
            'text': s.desc
          }))
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(structuredData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool, customPost, defaultGuide, title, h1, excerpt, desktopImg, mobileImg, publishedAt, author]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => onNavigate('home')} 
          className="hover:text-blue-600 transition-colors"
        >
          Inicio
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button 
          onClick={() => onNavigate('category', undefined, undefined, 'convert')} 
          className="hover:text-blue-600 transition-colors"
        >
          Convertir
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button 
          onClick={() => onNavigate('tool-page', undefined, tool.slug)} 
          className="hover:text-blue-600 transition-colors"
        >
          {tool.shortName || tool.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-semibold">Blog & Tutorial</span>
      </nav>

      {/* 2. Article Header */}
      <header className="mb-8">
        {/* Tags & Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tutorial & Blog Oficial</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {readingTime}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {publishedAt}
          </span>
        </div>

        {/* H1 Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {h1}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
          {excerpt}
        </p>

        {/* Author Byline */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {author.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{author}</p>
            <p className="text-[11px] text-slate-500">{authorRole}</p>
          </div>
        </div>

        {/* TOP CTA BUTTON: Direct access to tool */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-bold">¿Listo para usar la herramienta directamente?</p>
              <p className="text-xs text-blue-100">Conversión 100% privada en tu navegador y sin esperas</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('tool-page', undefined, tool.slug)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
          >
            <span>Usar herramienta ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Responsive Hero Image (Desktop on md+, Mobile on smaller screens) */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm mb-8 bg-slate-100">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopImg} />
            <img
              src={mobileImg}
              alt={imgAlt}
              className="w-full h-auto max-h-[440px] object-cover"
            />
          </picture>
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>📷 {imgAlt}</span>
            <span className="font-semibold text-blue-600">MediaConvert Graphics</span>
          </div>
        </div>
      </header>

      {/* 4. Main Article Content (Blog Style) */}
      <article className="prose prose-slate max-w-none mb-12">
        {customPost?.content ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed">
            {renderMarkdown(customPost.content)}
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Resumen del tutorial</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
              {defaultGuide.summary}
            </p>
          </div>
        )}

        {/* Step-by-Step Walkthrough Section */}
        {defaultGuide.stepByStep && defaultGuide.stepByStep.length > 0 && (
          <div className="mt-10 mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              <span>Instrucciones paso a paso para {tool.name}</span>
            </h2>

            <div className="space-y-4">
              {defaultGuide.stepByStep.map((step) => (
                <div 
                  key={step.step}
                  className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-sm border border-blue-100">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags pill footer */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Etiquetas:</span>
          </span>
          {tags.map((t, idx) => (
            <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              #{t}
            </span>
          ))}
        </div>
      </article>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white text-center shadow-xl mb-14 relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4 border border-blue-500/30">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Motor 100% Local en RAM & GPU</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            ¿Listo para usar {tool.name}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Aplica todo lo explicado y convierte tus archivos al instante sin límite de tamaño y con privacidad total.
          </p>
          <button
            onClick={() => onNavigate('tool-page', undefined, tool.slug)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Usar herramienta ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. REQUIRED SECTION 1: "Conocer más herramientas" */}
      {recommendedTools.length > 0 && (
        <section className="mb-14 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Recomendaciones Especializadas</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Conocer más herramientas de conversión
              </h2>
            </div>
            <button
              onClick={() => onNavigate('category', undefined, undefined, 'convert')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Ver catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTools.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onNavigate('tool-page', undefined, rec.slug)}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase border border-blue-100">
                      {rec.inputFormats.slice(0, 2).join(', ')} → {rec.defaultOutputFormat}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {rec.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {rec.shortName || rec.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span className="font-mono text-[10px] text-slate-400">{rec.routePath}</span>
                  <span className="inline-flex items-center gap-1">
                    <span>Abrir</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. REQUIRED SECTION 2: "Ver más entradas de otros blogs" */}
      {otherPosts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Artículos & Tutoriales</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Ver más entradas de otros blogs
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate('guide-page', undefined, post.slug)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-100 overflow-hidden">
                    <img
                      src={post.desktopImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1.5 font-medium">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readingTime || '2 min'}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                  <span>Leer tutorial</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
