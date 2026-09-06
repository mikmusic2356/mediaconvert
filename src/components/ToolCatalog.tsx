import React, { useState, useMemo } from 'react';
import { 
  FileTool, 
  FileCategory, 
  ToolType 
} from '../types';
import { 
  TOOLS_CATALOG, 
  FILE_CATEGORIES 
} from '../data/toolsData';
import { 
  Search, 
  Sparkles, 
  Zap, 
  Cloud, 
  Clock, 
  ArrowRight, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video, 
  Archive, 
  Filter,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useI18n, getLocalizedFileTool } from '../i18n/I18nContext';

interface ToolCatalogProps {
  onSelectTool: (tool: FileTool) => void;
  onNavigateToTool?: (slug: string) => void;
  onNavigateToGuide?: (slug: string) => void;
  initialCategory?: FileCategory | 'all';
}

export const ToolCatalog: React.FC<ToolCatalogProps> = ({
  onSelectTool,
  onNavigateToTool,
  onNavigateToGuide,
  initialCategory = 'all',
}) => {
  const { t, language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<'all' | 'convert' | 'compress'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryLabels: Record<string, string> = {
    all: t.filterAll,
    image: t.catImage,
    document: t.catPdfDoc,
    video: 'Video',
    audio: 'Audio',
    archive: t.catZip,
  };

  const localizedTools = useMemo(() => {
    return TOOLS_CATALOG.map((tool) => getLocalizedFileTool(tool, language));
  }, [language]);

  const filteredTools = useMemo(() => {
    return localizedTools.filter((tool) => {
      const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchType = selectedType === 'all' || tool.type === selectedType;
      const matchQuery =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.fromFormat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.toFormat && tool.toFormat.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchType && matchQuery;
    });
  }, [localizedTools, selectedCategory, selectedType, searchQuery]);

  const handleToolClick = (tool: FileTool) => {
    if (onNavigateToTool && tool.slug) {
      onNavigateToTool(tool.slug);
    } else {
      onSelectTool(tool);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'audio':
        return <Music className="w-4 h-4 text-amber-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-cyan-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.catalogBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {t.catalogTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            {t.catalogSubtitle}
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="tool-catalog-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs & Type Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-200">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {FILE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const label = categoryLabels[cat.id] || cat.label;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Action Type: All / Convert / Compress */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-end sm:self-auto">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedType === 'all' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterAll} ({TOOLS_CATALOG.length})
          </button>
          <button
            onClick={() => setSelectedType('convert')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedType === 'convert' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterConverters}
          </button>
          <button
            onClick={() => setSelectedType('compress')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedType === 'compress' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterCompressors}
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {filteredTools.map((tool) => {
          const isNative = tool.engine === 'client_native';

          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="group bg-white border border-slate-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header with Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {getCategoryIcon(tool.category)}
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                      {tool.fromFormat} {tool.toFormat ? `→ ${tool.toFormat}` : '(Opt)'}
                    </span>
                  </div>

                  {/* Engine Badge */}
                  {isNative ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      <span>{t.nativeBadge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      <Cloud className="w-3 h-3 text-blue-600" />
                      <span>Cloud v2</span>
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              {/* Bottom trigger CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                {onNavigateToGuide && tool.slug ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToGuide(tool.slug);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    <span>{t.howToUse}</span>
                  </button>
                ) : (
                  <span className="text-slate-400 font-mono text-[10px]">/{tool.slug}</span>
                )}
                <span className="inline-flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-bold">
                  <span>{t.useTool}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-700">{t.noToolsFound}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
            }}
            className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
          >
            {t.resetFilters}
          </button>
        </div>
      )}
    </section>
  );
};
