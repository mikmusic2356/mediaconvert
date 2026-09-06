import React from 'react';
import { AlertCircle, Server, ShieldCheck, ArrowRight } from 'lucide-react';
import { ToolConfig } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface ToolHonestStatusBannerProps {
  tool: ToolConfig;
  onExploreOtherTools?: () => void;
}

export const ToolHonestStatusBanner: React.FC<ToolHonestStatusBannerProps> = ({
  tool,
  onExploreOtherTools,
}) => {
  const { language } = useI18n();

  const clusterIntegrationBadge = language === 'us' ? 'Server cluster integration' : language === 'fr' ? 'Intégration de cluster serveur' : 'En integración de clúster servidor';
  const transparencyPolicyText = language === 'us' ? 'MediaConvert Transparency Policy' : language === 'fr' ? 'Politique de transparence MediaConvert' : 'Política de Transparencia MediaConvert';
  const pipelinePrepTitle = language === 'us' ? `Technical pipeline in preparation for ${tool.shortName || tool.name}` : language === 'fr' ? `Pipeline technique en préparation pour ${tool.shortName || tool.name}` : `Pipeline técnico en preparación para ${tool.shortName || tool.name}`;
  const exploreActiveToolsBtn = language === 'us' ? 'Explore active tools' : language === 'fr' ? 'Explorer les outils actifs' : 'Explorar herramientas activas';
  const noFakeSimulationText = language === 'us' ? 'No fake simulation' : language === 'fr' ? 'Aucune fausse simulation' : 'Sin simulación falsa';
  const statusLabel = language === 'us' ? 'Status:' : language === 'fr' ? 'Statut :' : 'Estado:';

  const defaultExplanation = language === 'us'
    ? `Conversion between ${tool.inputFormats.join(', ')} and ${tool.defaultOutputFormat} requires high-performance encoding on dedicated GPU/CPU microservices. At MediaConvert we never generate fake simulations or empty files.`
    : language === 'fr'
    ? `La conversion entre ${tool.inputFormats.join(', ')} et ${tool.defaultOutputFormat} nécessite un encodage haute performance sur des microservices GPU/CPU dédiés. Chez MediaConvert, nous ne faisons aucune fausse simulation.`
    : `La conversión entre ${tool.inputFormats.join(', ')} y ${tool.defaultOutputFormat} requiere codificación de alto rendimiento en microservicios GPU/CPU dedicados. En MediaConvert no realizamos simulaciones falsas ni generamos descargas vacías.`;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-7 text-amber-950 shadow-sm mb-6 animate-in fade-in duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
          <Server className="w-6 h-6" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              {clusterIntegrationBadge}
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              {transparencyPolicyText}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-amber-950">
            {pipelinePrepTitle}
          </h3>

          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
            {tool.statusExplanation || defaultExplanation}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            {onExploreOtherTools && (
              <button
                onClick={onExploreOtherTools}
                className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>{exploreActiveToolsBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{statusLabel} <strong className="font-semibold">{noFakeSimulationText}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

