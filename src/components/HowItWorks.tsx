import React from 'react';
import { UploadCloud, Sliders, ArrowDownToLine } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const HowItWorks: React.FC = () => {
  const { t } = useI18n();

  const steps = [
    {
      step: '01',
      title: t.step1Title,
      description: t.step1Desc,
      icon: UploadCloud,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      step: '02',
      title: t.step2Title,
      description: t.step2Desc,
      icon: Sliders,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      step: '03',
      title: t.step3Title,
      description: t.step3Desc,
      icon: ArrowDownToLine,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          {t.howItWorksTitle}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {t.howItWorksSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs relative flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
