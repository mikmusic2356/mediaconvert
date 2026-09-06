import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { FileCategory } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface HeroProps {
  onSelectCategory: (category: FileCategory) => void;
  activeCategory: string;
}

export const Hero: React.FC<HeroProps> = () => {
  const { t } = useI18n();

  return (
    <div className="relative pt-8 pb-4 sm:pt-12 sm:pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Privacy & Quality Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-6 shadow-sm">
        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400" />
        <span>{t.badgeNoAds}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">{t.badgePrivacy}</span>
      </div>

      {/* Main Title strictly matching concept */}
      <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-950 leading-[1.1] mb-5">
        {t.heroTitlePart1}
        <span className="text-blue-600">
          {t.heroTitlePart2}
        </span>
      </h1>

      {/* Clear Subtitle */}
      <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
        {t.heroSubtitle}
      </p>

      {/* Key Guarantees */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 mb-8">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          {t.guaranteeFast}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          {t.guaranteePrivacy}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {t.guaranteeDownload}
        </span>
      </div>
    </div>
  );
};
