import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  Film, 
  Archive,
  Layers,
  Sparkles
} from 'lucide-react';
import { getAllToolConfigs, generateSitemapXml, CATEGORIES_CONFIG } from '../data/toolsConfig';
import { FileCategory } from '../types';

interface SitemapViewProps {
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const tools = getAllToolConfigs().filter(t => t.sitemap && t.sitemap.include !== false);
  const xmlContent = generateSitemapXml();

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTools = tools.filter((t) => {
    const matchCategory =
      selectedCat === 'all' ||
      t.category === selectedCat ||
      (selectedCat === 'video-audio' && (t.category === 'video' || t.category === 'audio' || t.category === 'video-audio')) ||
      (selectedCat === 'pdf-document' && (t.category === 'document' || t.category === 'pdf-document'));

    const matchSearch =
      search.trim() === '' ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.routePath.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.h1.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getCategoryBadge = (category: FileCategory) => {
    switch (category) {
      case 'video-audio':
      case 'video':
      case 'audio':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200"><Music className="w-2.5 h-2.5" /> Video & Audio</span>;
      case 'image':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200"><ImageIcon className="w-2.5 h-2.5" /> Imagen</span>;
      case 'pdf-document':
      case 'document':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200"><FileText className="w-2.5 h-2.5" /> PDF & Docs</span>;
      case 'gif':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200"><Film className="w-2.5 h-2.5" /> GIF</span>;
      case 'archive':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold border border-cyan-200"><Archive className="w-2.5 h-2.5" /> ZIP</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{category}</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-100">
          <Globe className="w-3.5 h-3.5" />
          <span>Estructura de Indexación & SEO Técnico</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Mapa del Sitio & Directorio Indexable
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Generación dinámica del sitemap a partir de las herramientas registradas en la arquitectura. Cada herramienta dispone de URL canónica única, metaetiquetas específicas, Open Graph, Twitter/X y datos estructurados Schema.org.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedCat === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todas las Herramientas ({tools.length})
        </button>
        {CATEGORIES_CONFIG.map((cat) => {
          const count = tools.filter(t => {
            if (cat.id === 'video-audio') return t.category === 'video-audio' || t.category === 'video' || t.category === 'audio';
            if (cat.id === 'pdf-document') return t.category === 'pdf-document' || t.category === 'document';
            return t.category === cat.id;
          }).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 max-w-5xl mx-auto border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Directorio Visual ({filteredTools.length})
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'xml'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>sitemap.xml ({tools.length + 3} URLs)</span>
          </button>
        </div>

        {activeTab === 'visual' ? (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar ruta o herramienta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar XML'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar sitemap.xml</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === 'visual' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <th className="p-4">Ruta URL Canónica</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">H1 & Título SEO</th>
                    <th className="p-4 text-center">Prioridad</th>
                    <th className="p-4 text-center">Frecuencia</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {tool.routePath}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getCategoryBadge(tool.category)}
                      </td>
                      <td className="p-4 text-slate-800">
                        <div className="font-bold">{tool.h1}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-sm">{tool.title}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-[10px]">
                          {(tool.sitemap.priority ?? 0.8).toFixed(1)}
                        </span>
                      </td>
                      <td className="p-4 text-center text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {tool.sitemap.changeFrequency || 'weekly'}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onNavigate('tool-page', undefined, tool.slug)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <span>Abrir Herramienta</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-3xl p-6 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-xl max-h-[600px] overflow-y-auto">
            <pre className="text-emerald-400 whitespace-pre leading-relaxed">{xmlContent}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
