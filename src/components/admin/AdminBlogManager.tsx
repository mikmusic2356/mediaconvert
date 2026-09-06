import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  ArrowLeft, 
  Image as ImageIcon, 
  Monitor, 
  Smartphone, 
  Tag, 
  Globe, 
  Sparkles, 
  Save, 
  RefreshCw, 
  FileText, 
  Layers, 
  ExternalLink, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Wand2,
  BookOpen,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Upload,
  Link2,
  Zap,
  Flame,
  Newspaper,
  Table,
  Copy
} from 'lucide-react';
import { BlogPost, ToolConfig } from '../../types';
import { blogService } from '../../services/blogService';
import { getAllToolConfigs } from '../../data/toolsConfig';
import { adminAuthService } from '../../services/adminAuthService';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminCookieAuditView } from './AdminCookieAuditView';
import { Shield, LogOut } from 'lucide-react';

interface AdminBlogManagerProps {
  onNavigate: (view: any, categoryFilter?: any, toolSlug?: string, categorySlug?: string) => void;
  onPreviewPost?: (slug: string) => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ onNavigate, onPreviewPost }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminAuthService.isAuthenticated());
  const [activeMainTab, setActiveMainTab] = useState<'blogs' | 'cookies_audit'>('blogs');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'news_trend' | 'guide'>('all');
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'images' | 'seo' | 'tools'>('content');
  const [newTagInput, setNewTagInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState<string>('all');

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const allTools = useMemo(() => getAllToolConfigs(), []);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(blogService.getAllPosts());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNew = (category: 'news_trend' | 'guide' = 'news_trend') => {
    const isNews = category === 'news_trend';
    const newPost = blogService.createPost({
      category: category,
      title: isNews 
        ? '🔥 Tendencias 2026: Nuevo Avance en Conversión Digital' 
        : 'Cómo Convertir Archivos Paso a Paso (Guía 2026)',
      h1: isNews
        ? 'Tendencias 2026: Cómo Optimizar y Convertir Archivos en el Móvil'
        : 'Guía Completa: Convertir Archivos en Alta Calidad',
      slug: (isNews ? 'tendencias-' : 'guia-') + Date.now().toString(36),
      excerpt: isNews
        ? 'Descubre las últimas tendencias para Google Discover y las 3 herramientas gratuitas imprescindibles para creadores.'
        : 'Aprende paso a paso cómo convertir archivos sin pérdida de calidad y con 100% de privacidad.',
      content: isNews
        ? `### ¿Por qué esta tendencia es clave en 2026?\n\nLos usuarios móviles y creadores de contenido buscan herramientas que no requieran instalar software pesado ni subir archivos a servidores externos.\n\n---\n\n### Puntos clave que debes conocer\n\n- **1. Privacidad total:** Procesamiento en la memoria RAM de tu teléfono o PC.\n- **2. Máxima velocidad:** Resultados inmediatos sin colas de espera.\n- **3. Compatibilidad universal:** Formatos listos para redes sociales y mensajería.\n\n---\n\n### Herramientas interactivas recomendadas\n\nPrueba a continuación las herramientas seleccionadas para este caso y optimiza tus archivos en segundos:`
        : `### Introducción al proceso de conversión\n\nExplica aquí por qué es importante este tipo de conversión y cuáles son los beneficios principales para los usuarios.\n\n---\n\n### Características clave\n\n- **Procesamiento en memoria:** Rápido y privado sin subir archivos a la nube.\n- **Alta fidelidad:** Mantiene la resolución y calidad sonora original.\n- **Sin límites:** Convierte sin restricciones ni marcas de agua.\n\n---\n\n### Instrucciones paso a paso\n\n1. **Carga tus archivos:** Arrastra el archivo compatible al área de conversión.\n2. **Inicia el proceso:** Pulsa en Convertir.\n3. **Descarga el resultado:** Guarda el archivo optimizado en tu dispositivo.\n\n> **💡 Consejo Pro:** Para mejores resultados, utiliza archivos fuente de alta calidad.`,
      desktopImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      imageAlt: isNews ? 'Noticias y tendencias Google Discover' : 'Tutorial de conversión en MediaConvert',
      author: isNews ? 'Redacción MediaConvert Discover' : 'Equipo Editorial MediaConvert',
      authorRole: isNews ? 'Especialista en Tendencias & Móviles' : 'Especialista en Conversión Digital',
      tags: isNews 
        ? ['Tendencias', 'Google Discover', 'Móviles', '2026', 'Herramientas']
        : ['Tutorial', 'Conversión', 'Guía 2026'],
      recommendedToolSlugs: ['jpg-to-png', 'mp4-to-mp3', 'pdf-to-word'],
      featuredToolSlugs: ['jpg-to-png', 'mp4-to-mp3', 'webp-to-jpg']
    });

    setPosts(blogService.getAllPosts());
    setSelectedPost(newPost);
    setIsEditing(true);
    setActiveEditorTab('content');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Nuevo artículo de ${isNews ? 'Noticias & Tendencias' : 'Guía'} creado.`);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost({ ...post });
    setIsEditing(true);
    setActiveEditorTab('content');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo de blog?')) {
      blogService.deletePost(id);
      loadPosts();
      if (selectedPost?.id === id) {
        setSelectedPost(null);
        setIsEditing(false);
      }
      showToast('Artículo eliminado.');
    }
  };

  const handleSaveCurrent = () => {
    if (!selectedPost) return;
    if (!selectedPost.title.trim() || !selectedPost.slug.trim()) {
      alert('El título y el slug son obligatorios.');
      return;
    }

    blogService.savePost(selectedPost);
    loadPosts();
    showToast('¡Artículo guardado exitosamente!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Restablecer todos los blogs a los predeterminados de fábrica?')) {
      blogService.resetToDefaults();
      loadPosts();
      setSelectedPost(null);
      setIsEditing(false);
      showToast('Blogs restablecidos a valores originales.');
    }
  };

  // Image Upload Handlers (FileReader to Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file || !selectedPost) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'desktop') {
        setSelectedPost({ ...selectedPost, desktopImage: dataUrl });
      } else {
        setSelectedPost({ ...selectedPost, mobileImage: dataUrl });
      }
      showToast(`Imagen para ${type === 'desktop' ? 'Escritorio' : 'Móvil'} cargada.`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Comma-separated Tag Input Management
  const handleAddTagsFromInput = (inputText: string) => {
    if (!inputText.trim() || !selectedPost) return;
    
    // Split by commas, trim each tag, remove empty strings
    const newTags = inputText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const existingTags = selectedPost.tags || [];
    const merged = Array.from(new Set([...existingTags, ...newTags]));

    setSelectedPost({
      ...selectedPost,
      tags: merged
    });
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!selectedPost) return;
    setSelectedPost({
      ...selectedPost,
      tags: selectedPost.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleRawTagsChange = (rawText: string) => {
    if (!selectedPost) return;
    const splitTags = rawText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setSelectedPost({
      ...selectedPost,
      tags: splitTags
    });
  };

  // Content Formatting Helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!contentTextareaRef.current || !selectedPost) return;
    const textarea = contentTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = selectedPost.content || '';
    const selectedText = text.substring(start, end) || 'texto';
    const replacement = prefix + selectedText + suffix;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setSelectedPost({ ...selectedPost, content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Filtered Tool List for Tool Selector
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchCat = toolCategoryFilter === 'all' || tool.category === toolCategoryFilter;
      const q = toolSearchQuery.toLowerCase();
      const matchQuery = tool.name.toLowerCase().includes(q) || tool.slug.toLowerCase().includes(q) || (tool.description && tool.description.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [allTools, toolCategoryFilter, toolSearchQuery]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || (categoryFilter === 'news_trend' ? p.category === 'news_trend' : (!p.category || p.category === 'guide'));
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (p.toolSlug && p.toolSlug.toLowerCase().includes(q));
      return matchStatus && matchCategory && matchQuery;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  if (!isAuthenticated) {
    return (
      <AdminLoginModal
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={() => onNavigate('home')}
      />
    );
  }

  const handleLogout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    showToast('Sesión de administración cerrada.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-indigo-50 text-slate-800 text-xs font-bold mb-2 border border-slate-200 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Panel CMS — Google Discover, Guías SEO & Seguridad 3FA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Panel de Control Administrativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestión editorial de artículos Discover, guías técnicas y monitorización de auditoría de cookies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Module Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200/80 mr-2">
            <button
              onClick={() => { setActiveMainTab('blogs'); setIsEditing(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'blogs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Gestor de Blogs</span>
            </button>
            <button
              onClick={() => { setActiveMainTab('cookies_audit'); setIsEditing(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'cookies_audit' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auditoría de Cookies</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          {activeMainTab === 'blogs' && (
            <>
              <button
                onClick={handleResetDefaults}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                title="Restablecer blogs predeterminados"
              >
                Restablecer
              </button>
              <button
                onClick={() => handleCreateNew('news_trend')}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>+ Noticia Discover</span>
              </button>
              <button
                onClick={() => handleCreateNew('guide')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Guía</span>
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Render */}
      {activeMainTab === 'cookies_audit' ? (
        <AdminCookieAuditView />
      ) : !isEditing ? (
        <div>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Artículos</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{posts.length}</p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200/80 bg-orange-50/20 shadow-xs">
              <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Noticias & Tendencias</span>
              </span>
              <p className="text-2xl font-black text-orange-700 mt-1">
                {posts.filter(p => p.category === 'news_trend').length}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
              <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Guías & Tutoriales</span>
              </span>
              <p className="text-2xl font-black text-blue-700 mt-1">
                {posts.filter(p => !p.category || p.category === 'guide').length}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-emerald-600 font-medium">Publicados</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6">
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, slug, tag o herramienta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setCategoryFilter('news_trend')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${categoryFilter === 'news_trend' ? 'bg-white text-orange-600 shadow-xs font-bold' : 'text-slate-600'}`}
                >
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>Discover / Tendencias</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('guide')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${categoryFilter === 'guide' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'}`}
                >
                  <BookOpen className="w-3 h-3 text-blue-500" />
                  <span>Guías</span>
                </button>
              </div>

              {/* Status Filter */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('published')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
                >
                  Publicados
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'draft' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'}`}
                >
                  Borradores
                </button>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Picture (Desktop / Mobile Preview) */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden group">
                    <picture>
                      {post.mobileImage && <source media="(max-width: 640px)" srcSet={post.mobileImage} />}
                      <img
                        src={post.desktopImage || post.mobileImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </picture>
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                        post.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs flex items-center gap-1 ${
                        post.category === 'news_trend' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {post.category === 'news_trend' ? <Flame className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                        {post.category === 'news_trend' ? 'Discover' : 'Guía'}
                      </span>
                    </div>

                    {/* Featured tools badge */}
                    {post.featuredToolSlugs && post.featuredToolSlugs.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Zap size={10} className="text-orange-400" />
                        <span>{post.featuredToolSlugs.length} Herramientas</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readingTime || '2 min'}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-semibold self-center">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[130px]">
                    {post.category === 'news_trend' ? `/news/${post.slug}` : `/guide/${post.slug}`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onNavigate(post.category === 'news_trend' ? 'news-page' as any : 'guide-page', undefined, post.slug)}
                      className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-white rounded-lg transition-colors"
                      title="Ver en vivo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1.5 bg-white text-orange-600 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 3. BLOG BUILDER / EDITOR WORKSPACE */
        selectedPost && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Editor Top Bar */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                  title="Volver a la lista"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedPost.category === 'news_trend' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {selectedPost.category === 'news_trend' ? '🔥 Noticia Discover' : '📖 Guía Tutorial'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono truncate">
                      {selectedPost.category === 'news_trend' ? `/news/${selectedPost.slug}` : `/guide/${selectedPost.slug}`}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold truncate max-w-md">
                    {selectedPost.title || 'Editando Artículo'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate(selectedPost.category === 'news_trend' ? 'news-page' as any : 'guide-page', undefined, selectedPost.slug)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver en Vivo</span>
                </button>
                <button
                  onClick={handleSaveCurrent}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>

            {/* Editor Tabs Navigation */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50 overflow-x-auto">
              <button
                onClick={() => setActiveEditorTab('content')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeEditorTab === 'content'
                    ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Contenido & Texto</span>
              </button>
              <button
                onClick={() => setActiveEditorTab('images')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeEditorTab === 'images'
                    ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>2. Imágenes (Móvil & PC)</span>
              </button>
              <button
                onClick={() => setActiveEditorTab('tools')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeEditorTab === 'tools'
                    ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-orange-500" />
                <span>3. Herramientas Incrustadas (Máx 3)</span>
              </button>
              <button
                onClick={() => setActiveEditorTab('seo')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeEditorTab === 'seo'
                    ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>4. SEO & Etiquetas por Comas</span>
              </button>
            </div>

            {/* Editor Body */}
            <div className="p-6 sm:p-8">
              {/* TAB 1: CONTENIDO & TEXTO */}
              {activeEditorTab === 'content' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Category + Slug + Status row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Categoría / Formato
                      </label>
                      <select
                        value={selectedPost.category || 'news_trend'}
                        onChange={(e) => setSelectedPost({ ...selectedPost, category: e.target.value as 'guide' | 'news_trend' })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-orange-500 outline-none"
                      >
                        <option value="news_trend">🔥 Noticias y Tendencias (Google Discover)</option>
                        <option value="guide">📖 Guía y Tutorial SEO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={selectedPost.slug}
                        onChange={(e) => setSelectedPost({ ...selectedPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-orange-500 outline-none"
                        placeholder="ej. tendencias-video-2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Estado de Publicación
                      </label>
                      <select
                        value={selectedPost.status}
                        onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value as 'published' | 'draft' })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-orange-500 outline-none"
                      >
                        <option value="published">✅ Publicado en vivo</option>
                        <option value="draft">📝 Borrador privado</option>
                      </select>
                    </div>
                  </div>

                  {/* Title & H1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Título del Artículo (Card & Listados)
                      </label>
                      <input
                        type="text"
                        value={selectedPost.title}
                        onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-orange-500 outline-none"
                        placeholder="ej. 🔥 Tendencias 2026: La Edición de Vídeo se Mueve al Navegador"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Encabezado Principal H1
                      </label>
                      <input
                        type="text"
                        value={selectedPost.h1}
                        onChange={(e) => setSelectedPost({ ...selectedPost, h1: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-orange-500 outline-none"
                        placeholder="ej. Edición de Vídeo en el Navegador: La Revolución en 2026"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Resumen / Excerpt (Snippet para Google Discover)
                    </label>
                    <textarea
                      rows={2}
                      value={selectedPost.excerpt}
                      onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-700 focus:bg-white focus:border-orange-500 outline-none resize-none"
                      placeholder="Breve introducción de 2 líneas que engancha a los usuarios en Google Discover..."
                    />
                  </div>

                  {/* Rich Text Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Contenido Completo del Artículo (Markdown & Tablas)
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {(selectedPost.content || '').length} caracteres
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-t-xl border border-slate-200 border-b-0">
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ', '\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Subtítulo H3"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                        <span>H3</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Negrita"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Cursiva"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ', '\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Lista de viñetas"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('1. ', '\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Lista numerada"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> 💡 **Consejo Pro:** ', '\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Cita destacada"
                      >
                        <Quote className="w-3.5 h-3.5" />
                        <span>Tip</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n| Característica | Detalle |\n|---|---|\n| Formato | Resultado |\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Insertar Tabla"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Tabla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n---\n')}
                        className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        title="Separador horizontal"
                      >
                        — Separador
                      </button>
                    </div>

                    <textarea
                      ref={contentTextareaRef}
                      rows={14}
                      value={selectedPost.content}
                      onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-b-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                      placeholder="Escribe el artículo con títulos, explicaciones y pasos..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: IMÁGENES RESPONSIVE (MÓVIL & ESCRITORIO) */}
              {activeEditorTab === 'images' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        Imágenes Adaptativas: Escritorio (16:9) & Móvil (Google Discover)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configura imágenes independientes para garantizar máximo impacto visual en pantallas de ordenador y en Google Discover para móviles.
                      </p>
                    </div>

                    {/* Live device preview switcher */}
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          previewDevice === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Vista Escritorio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          previewDevice === 'mobile' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Vista Móvil</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Desktop Image Card */}
                    <div className={`p-5 rounded-2xl border transition-all ${
                      previewDevice === 'desktop' ? 'border-blue-400 bg-blue-50/20 ring-2 ring-blue-400/20' : 'border-slate-200 bg-slate-50/60'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase">Imagen para Escritorio</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">1200x675 (16:9)</span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative h-48 rounded-xl bg-slate-200 overflow-hidden mb-3 border border-slate-300">
                        {selectedPost.desktopImage ? (
                          <img
                            src={selectedPost.desktopImage}
                            alt={selectedPost.imageAlt || 'Desktop'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                            Sin imagen de escritorio
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                          16:9 PC
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={selectedPost.desktopImage || ''}
                          onChange={(e) => setSelectedPost({ ...selectedPost, desktopImage: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-blue-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <input
                          ref={desktopFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'desktop')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => desktopFileInputRef.current?.click()}
                          className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>Subir desde dispositivo (PC)</span>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Image Card */}
                    <div className={`p-5 rounded-2xl border transition-all ${
                      previewDevice === 'mobile' ? 'border-orange-400 bg-orange-50/20 ring-2 ring-orange-400/20' : 'border-slate-200 bg-slate-50/60'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase">Imagen para Móvil (Discover)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">600x600 o 600x800</span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative h-48 rounded-xl bg-slate-200 overflow-hidden mb-3 border border-slate-300 flex items-center justify-center">
                        {selectedPost.mobileImage ? (
                          <img
                            src={selectedPost.mobileImage}
                            alt={selectedPost.imageAlt || 'Mobile'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-400 text-xs font-semibold">
                            Sin imagen móvil (usará la de PC)
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded">
                          MÓVIL DISCOVER
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={selectedPost.mobileImage || ''}
                          onChange={(e) => setSelectedPost({ ...selectedPost, mobileImage: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <input
                          ref={mobileFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'mobile')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => mobileFileInputRef.current?.click()}
                          className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-orange-600" />
                          <span>Subir desde dispositivo (Móvil)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Alt Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Texto Alternativo (Alt Text para Google Discover & Accesibilidad)
                    </label>
                    <input
                      type="text"
                      value={selectedPost.imageAlt || ''}
                      onChange={(e) => setSelectedPost({ ...selectedPost, imageAlt: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-orange-500 outline-none"
                      placeholder="ej. Cómo convertir vídeos MP4 a MP3 paso a paso en 2026"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: 3 HERRAMIENTAS INCRUSTADAS EN EL ARTÍCULO */}
              {activeEditorTab === 'tools' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 rounded-3xl border-2 border-orange-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            Incrustar 3 Herramientas de la Web en el Artículo
                          </h3>
                          <p className="text-xs text-slate-600">
                            Aportan valor práctico interactivo a tus lectores en Google Discover. (Máximo 3 herramientas seleccionables).
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black px-3.5 py-1.5 bg-orange-600 text-white rounded-full self-start sm:self-auto shadow-sm">
                        {(selectedPost.featuredToolSlugs || []).length} / 3 Seleccionadas
                      </span>
                    </div>

                    {/* Selected tools chips & preview */}
                    {(selectedPost.featuredToolSlugs || []).length > 0 ? (
                      <div className="space-y-2 mb-5">
                        <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                          Herramientas actualmente incrustadas en el blog:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedPost.featuredToolSlugs || []).map((slug, idx) => {
                            const t = allTools.find(tool => tool.slug === slug);
                            return (
                              <div
                                key={slug}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-orange-300 rounded-xl shadow-xs text-xs font-bold text-slate-800"
                              >
                                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                                  #{idx + 1}
                                </span>
                                <span>{t?.name || slug}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (selectedPost.featuredToolSlugs || []).filter(s => s !== slug);
                                    setSelectedPost({ ...selectedPost, featuredToolSlugs: updated });
                                  }}
                                  className="text-orange-400 hover:text-red-600 font-bold ml-1"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white/80 rounded-xl border border-orange-200 text-xs text-orange-700 font-semibold mb-4">
                        💡 No has seleccionado herramientas aún. Marca hasta 3 herramientas del catálogo a continuación para insertarlas como widgets interactivos.
                      </div>
                    )}

                    {/* Tool Search & Category Filter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={toolSearchQuery}
                          onChange={(e) => setToolSearchQuery(e.target.value)}
                          placeholder="Buscar herramienta (ej. jpg a png, mp4)..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <select
                        value={toolCategoryFilter}
                        onChange={(e) => setToolCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-orange-500"
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="image">Imágenes (JPG, PNG, WebP, HEIC...)</option>
                        <option value="video">Vídeo & Audio (MP4, MP3, MOV...)</option>
                        <option value="pdf">Documentos & PDF (PDF, Word, OCR...)</option>
                      </select>
                    </div>

                    {/* Tool Picker Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2 bg-white rounded-2xl border border-orange-200 shadow-inner">
                      {filteredTools.map((tool) => {
                        const featured = selectedPost.featuredToolSlugs || [];
                        const isChecked = featured.includes(tool.slug);
                        const isMaxReached = featured.length >= 3 && !isChecked;

                        return (
                          <label
                            key={tool.id}
                            className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 transition-all select-none ${
                              isChecked
                                ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-xs cursor-pointer'
                                : isMaxReached
                                ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-xs cursor-pointer'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                  {tool.category}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-slate-900 truncate">{tool.name}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{tool.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isMaxReached}
                              onChange={(e) => {
                                const current = selectedPost.featuredToolSlugs || [];
                                const updated = e.target.checked
                                  ? [...current, tool.slug].slice(0, 3)
                                  : current.filter(s => s !== tool.slug);
                                setSelectedPost({ ...selectedPost, featuredToolSlugs: updated });
                              }}
                              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 mt-1 shrink-0"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SEO & ETIQUETAS SEPARADAS POR COMAS */}
              {activeEditorTab === 'seo' && (
                <div className="space-y-6 max-w-4xl">
                  {/* SEO Tags Section with Comma Support */}
                  <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 rounded-2xl border border-indigo-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider">
                        Etiquetas SEO Separadas por Comas (Búsquedas & Google Discover)
                      </label>
                    </div>
                    <p className="text-xs text-indigo-700 mb-3 leading-relaxed">
                      Escribe o pega etiquetas separadas por comas (ej. <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">jpg a png, convertir fotos gratis, google discover, optimizar imagen</code>) y pulsa Añadir o Enter.
                    </p>

                    {/* Tag input with add button */}
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddTagsFromInput(newTagInput);
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 outline-none shadow-xs font-medium"
                        placeholder="Escribe etiquetas separadas por comas y pulsa Enter..."
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTagsFromInput(newTagInput)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        + Añadir Etiquetas
                      </button>
                    </div>

                    {/* Interactive Tag Chips */}
                    <div className="flex flex-wrap gap-2 p-3 bg-white rounded-xl border border-indigo-100 min-h-[50px] items-center mb-3">
                      {(selectedPost.tags || []).length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No hay etiquetas agregadas todavía.</span>
                      ) : (
                        selectedPost.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-indigo-400 hover:text-red-600 font-black ml-1 text-sm leading-none"
                              title="Eliminar etiqueta"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Raw Comma-separated Text View/Editor */}
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">
                        Texto Plano Separado por Comas (Para copiar / pegar rápido)
                      </label>
                      <input
                        type="text"
                        value={(selectedPost.tags || []).join(', ')}
                        onChange={(e) => handleRawTagsChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white/90 border border-indigo-200 rounded-lg text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                        placeholder="etiqueta 1, etiqueta 2, etiqueta 3"
                      />
                    </div>
                  </div>

                  {/* SEO Meta Title & Meta Description */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Meta Título SEO (&lt;title&gt;)
                        </label>
                        <span className={`text-[11px] font-mono font-bold ${
                          (selectedPost.seoTitle || '').length > 60 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {(selectedPost.seoTitle || '').length} / 60 caracteres recomendados
                        </span>
                      </div>
                      <input
                        type="text"
                        value={selectedPost.seoTitle || ''}
                        onChange={(e) => setSelectedPost({ ...selectedPost, seoTitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-orange-500 outline-none"
                        placeholder="ej. 🔥 Tendencias Edición Vídeo 2026: Todo en el Navegador | MediaConvert"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Meta Descripción (&lt;meta name="description"&gt;)
                        </label>
                        <span className={`text-[11px] font-mono font-bold ${
                          (selectedPost.seoMetaDescription || '').length > 160 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {(selectedPost.seoMetaDescription || '').length} / 155 caracteres recomendados
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={selectedPost.seoMetaDescription || ''}
                        onChange={(e) => setSelectedPost({ ...selectedPost, seoMetaDescription: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-orange-500 outline-none resize-none"
                        placeholder="Descripción optimizada que Google indexará y mostrará en los resultados de búsqueda..."
                      />
                    </div>
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Vista Previa en Google Search & Discover
                    </span>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs max-w-lg">
                      <p className="text-xs text-slate-500 truncate font-mono">
                        https://mediaconvert.io{selectedPost.category === 'news_trend' ? '/news/' : '/guide/'}{selectedPost.slug}
                      </p>
                      <h4 className="text-sm font-bold text-blue-700 hover:underline leading-snug my-1 line-clamp-1">
                        {selectedPost.seoTitle || selectedPost.title || 'Título del artículo'}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {selectedPost.seoMetaDescription || selectedPost.excerpt || 'Descripción del artículo...'}
                      </p>
                    </div>
                  </div>

                  {/* Author & Reading Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Autor del Artículo
                      </label>
                      <input
                        type="text"
                        value={selectedPost.author || ''}
                        onChange={(e) => setSelectedPost({ ...selectedPost, author: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none"
                        placeholder="ej. Redacción MediaConvert"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Tiempo Estimado de Lectura
                      </label>
                      <input
                        type="text"
                        value={selectedPost.readingTime || ''}
                        onChange={(e) => setSelectedPost({ ...selectedPost, readingTime: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none"
                        placeholder="ej. 3 min de lectura"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

