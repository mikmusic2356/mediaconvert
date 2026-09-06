import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive,
  Film,
  Sparkles,
  Command,
  CornerDownLeft
} from 'lucide-react';
import { getAllToolConfigs } from '../data/toolsConfig';
import { ToolConfig, FileCategory } from '../types';
import { useI18n, getLocalizedToolConfig } from '../i18n/I18nContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTool: (slug: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTool,
}) => {
  const { t, language } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allTools = useMemo(() => {
    return getAllToolConfigs().map(t => getLocalizedToolConfig(t, language));
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Algoritmo de Búsqueda Flexible por: Nombre, Formato Entrada, Formato Salida, Categoría y Slug
  const filteredTools = useMemo(() => {
    const raw = query.toLowerCase().trim();
    if (!raw) {
      // Sugerencias populares cuando no hay texto
      return allTools.slice(0, 8);
    }

    // Dividir términos en tokens para búsquedas como "jpg png" o "heic a jpg"
    const terms = raw
      .replace(/\ba\b/g, ' ')
      .replace(/\bto\b/g, ' ')
      .replace(/\bconvertir\b/g, ' ')
      .replace(/\bde\b/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    return allTools
      .map((tool) => {
        let score = 0;
        const nameLower = tool.name.toLowerCase();
        const shortNameLower = (tool.shortName || '').toLowerCase();
        const slugLower = tool.slug.toLowerCase();
        const catLower = tool.category.toLowerCase();
        const inFormats = tool.inputFormats.map((f) => f.toLowerCase());
        const outFormats = tool.outputFormats.map((f) => f.toLowerCase());
        const defaultOut = tool.defaultOutputFormat.toLowerCase();

        // 1. Coincidencia exacta de slug o nombre
        if (slugLower === raw || nameLower === raw) {
          score += 100;
        }

        // 2. Si todos los términos están presentes
        const allTermsMatch = terms.every((term) => {
          const inName = nameLower.includes(term) || shortNameLower.includes(term);
          const inSlug = slugLower.includes(term);
          const inCat = catLower.includes(term);
          const inInput = inFormats.some((f) => f.includes(term) || term.includes(f));
          const inOutput = outFormats.some((f) => f.includes(term) || term.includes(f)) || defaultOut.includes(term);
          const inDesc = tool.description.toLowerCase().includes(term);

          if (inInput || inOutput) score += 20;
          if (inName) score += 15;
          if (inSlug) score += 10;
          if (inCat) score += 5;
          if (inDesc) score += 2;

          return inName || inSlug || inCat || inInput || inOutput || inDesc;
        });

        if (!allTermsMatch) return null;

        // Bonificación si el primer término es formato de entrada y el segundo formato de salida
        if (terms.length >= 2) {
          const firstInInput = inFormats.some((f) => f.includes(terms[0]) || terms[0].includes(f));
          const secondInOutput = outFormats.some((f) => f.includes(terms[1]) || terms[1].includes(f)) || defaultOut.includes(terms[1]);
          if (firstInInput && secondInOutput) {
            score += 50;
          }
        }

        return { tool, score };
      })
      .filter((item): item is { tool: ToolConfig; score: number } => item !== null)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool);
  }, [allTools, query]);

  // Manejo de teclado: Flechas, Enter y Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredTools.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onNavigateToTool(filteredTools[selectedIndex].slug);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onNavigateToTool, onClose]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'video-audio':
      case 'audio':
        return <Music className="w-4 h-4 text-indigo-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'pdf-document':
      case 'document':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'gif':
        return <Film className="w-4 h-4 text-rose-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-cyan-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.quickSearchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            title={t.quickSearchEsc}
          >
            <span className="text-xs font-mono font-bold">ESC</span>
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        {!query && (
          <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-500">
            <span className="font-semibold text-slate-400">{t.quickSearchPopular}</span>
            {['jpg png', 'heic', 'mp4 mp3', 'pdf word', 'video gif', 'compress jpg'].map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredTools.map((tool, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  onNavigateToTool(tool.slug);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left group ${
                  isSelected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'
                  }`}>
                    {getCategoryIcon(tool.category)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${
                      isSelected ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {tool.shortName || tool.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-lg">
                    {tool.inputFormats.slice(0, 2).join(', ')} → {tool.defaultOutputFormat}
                  </span>
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'text-slate-400 group-hover:text-blue-600'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}

          {filteredTools.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">{t.quickSearchNoResults}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {t.quickSearchNoResultsDesc}
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px]">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↓</kbd>
              <span>{t.quickSearchNavigate}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px]">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↵</kbd>
              <span>{t.quickSearchOpenTool}</span>
            </span>
          </div>
          <span className="font-mono text-[10px]">{t.quickSearchEsc}</span>
        </div>
      </div>
    </div>
  );
};
