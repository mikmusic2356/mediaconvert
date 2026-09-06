import React from 'react';
import { ShieldCheck, EyeOff, Ban, ServerOff, CheckCircle } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const SecuritySection: React.FC = () => {
  const { t } = useI18n();

  const points = [
    {
      title: t.secLocalTitle,
      desc: t.secLocalDesc,
      icon: ServerOff,
    },
    {
      title: t.secNoAdsTitle,
      desc: t.secNoAdsDesc,
      icon: Ban,
    },
    {
      title: t.secDirectTitle,
      desc: t.secDirectDesc,
      icon: CheckCircle,
    },
    {
      title: t.secCleanupTitle,
      desc: t.secCleanupDesc,
      icon: EyeOff,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        {/* Background glow subtle effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.securityBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            {t.securityTitle}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.securityDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{pt.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
