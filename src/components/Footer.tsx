import React from 'react';
import { Layers, ShieldCheck, Globe } from 'lucide-react';
import { FileCategory } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface FooterProps {
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string, categorySlug?: string) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenCookiePolicy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacyPolicy, onOpenCookiePolicy }) => {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">
                Media<span className="text-blue-600">Convert</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.allOS}</span>
            </div>
          </div>

          {/* Col 2: Conversiones Populares */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.popularConversions}</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="/convert/jpg-to-png" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'jpg-to-png'); }} className="hover:text-blue-600 text-left block">
                  Convert JPG to PNG
                </a>
              </li>
              <li>
                <a href="/convert/png-to-jpg" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'png-to-jpg'); }} className="hover:text-blue-600 text-left block">
                  Convert PNG to JPG
                </a>
              </li>
              <li>
                <a href="/convert/mp4-to-mp3" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'mp4-to-mp3'); }} className="hover:text-blue-600 text-left block">
                  Convert MP4 to MP3
                </a>
              </li>
              <li>
                <a href="/convert/pdf-to-word" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'pdf-to-word'); }} className="hover:text-blue-600 text-left block">
                  Convert PDF to Word
                </a>
              </li>
              <li>
                <a href="/convert/video-to-gif" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'video-to-gif'); }} className="hover:text-blue-600 text-left block">
                  Convert Video to GIF
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compresión & Utilidades */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">PDF & ZIP</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="/compress/jpg" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'compress-jpg'); }} className="hover:text-blue-600 text-left block">
                  Compress JPG / JPEG
                </a>
              </li>
              <li>
                <a href="/compress/png" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'compress-png'); }} className="hover:text-blue-600 text-left block">
                  Compress PNG
                </a>
              </li>
              <li>
                <a href="/compress/pdf" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'compress-pdf'); }} className="hover:text-blue-600 text-left block">
                  Compress PDF
                </a>
              </li>
              <li>
                <a href="/convert/files-to-zip" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'files-to-zip'); }} className="hover:text-blue-600 text-left block">
                  Pack to .ZIP
                </a>
              </li>
              <li>
                <a href="/convert/jpg-to-pdf" onClick={(e) => { e.preventDefault(); onNavigate('tool-page', undefined, 'jpg-to-pdf'); }} className="hover:text-blue-600 text-left block">
                  Convert JPG to PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Categorías de Navegación */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.categories}</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="/convert/image" onClick={(e) => { e.preventDefault(); onNavigate('category', 'image', undefined, 'image'); }} className="hover:text-blue-600 text-left block">
                  🖼️ {t.catImage}
                </a>
              </li>
              <li>
                <a href="/convert/video-audio" onClick={(e) => { e.preventDefault(); onNavigate('category', 'video-audio', undefined, 'video'); }} className="hover:text-blue-600 text-left block">
                  🎵 {t.catVideoAudio}
                </a>
              </li>
              <li>
                <a href="/convert/pdf-document" onClick={(e) => { e.preventDefault(); onNavigate('category', 'pdf-document', undefined, 'pdf'); }} className="hover:text-blue-600 text-left block">
                  📄 {t.catPdfDoc}
                </a>
              </li>
              <li>
                <a href="/convert/gif" onClick={(e) => { e.preventDefault(); onNavigate('category', 'gif', undefined, 'gif'); }} className="hover:text-blue-600 text-left block">
                  🎞️ {t.catGif}
                </a>
              </li>
              <li>
                <a href="/convert" onClick={(e) => { e.preventDefault(); onNavigate('category', undefined, undefined, 'convert'); }} className="hover:text-blue-600 text-left block">
                  ⚡ /convert
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Plataforma & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="/news" onClick={(e) => { e.preventDefault(); onNavigate('news-list'); }} className="hover:text-orange-600 text-left flex items-center gap-1 font-semibold text-orange-600">
                  <span>🔥 {t.newsAndTrends}</span>
                </a>
              </li>
              <li>
                <a href="/my-files" onClick={(e) => { e.preventDefault(); onNavigate('my-files'); }} className="hover:text-blue-600 text-left block">
                  {t.myFiles}
                </a>
              </li>
              <li>
                <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="hover:text-indigo-600 text-left block">
                  {t.adminBlog}
                </a>
              </li>
              <li>
                <a href="/tools" onClick={(e) => { e.preventDefault(); onNavigate('tools'); }} className="hover:text-blue-600 text-left block">
                  {t.siteDirectory}
                </a>
              </li>
              <li>
                <a href="/sitemap" onClick={(e) => { e.preventDefault(); onNavigate('sitemap'); }} className="hover:text-blue-600 text-left flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t.sitemapSeo}</span>
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacyPolicy}
                  className="hover:text-blue-600 text-left cursor-pointer transition-colors"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCookiePolicy}
                  className="hover:text-blue-600 text-left cursor-pointer transition-colors"
                >
                  Política de Cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediaConvert Studio. {t.rightsReserved}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.sslEncrypted}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
