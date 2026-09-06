import React, { useEffect } from 'react';

export interface AdBannerProps {
  slotType: 'vertical-skyscraper' | 'horizontal-leaderboard' | 'in-feed' | 'rectangle';
  adSlot?: string;
  adClient?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  adSlot,
  adClient = 'ca-pub-5108692655083046',
  className = '',
}) => {
  const isConfigured = Boolean(adClient && adSlot);

  // If real AdSense credentials are configured, execute the adsbygoogle push
  useEffect(() => {
    if (isConfigured && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Safe fail
      }
    }
  }, [isConfigured]);

  if (slotType === 'vertical-skyscraper') {
    return (
      <aside
        aria-label="Espacio publicitario"
        className={`w-full flex flex-col items-center justify-start ${className}`}
      >
        <div className="w-[160px] min-h-[600px] flex items-center justify-center">
          {isConfigured ? (
            <ins
              className="adsbygoogle w-[160px] h-[600px] block"
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="vertical"
              data-full-width-responsive="false"
            />
          ) : (
            // Clean invisible structural layout spacer that keeps the perfect centered alignment
            <div className="w-[160px] min-h-[600px] pointer-events-none opacity-0" aria-hidden="true" />
          )}
        </div>
      </aside>
    );
  }

  if (slotType === 'horizontal-leaderboard') {
    if (!isConfigured) {
      // Don't clutter with mock ads if not configured, or keep a subtle spacing
      return null;
    }
    return (
      <div
        aria-label="Espacio publicitario"
        className={`w-full flex justify-center my-4 ${className}`}
      >
        <div className="w-full max-w-4xl min-h-[90px] flex items-center justify-center">
          <ins
            className="adsbygoogle w-full h-[90px] block"
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Rectangle / in-feed
  if (!isConfigured) return null;

  return (
    <div
      aria-label="Espacio publicitario"
      className={`w-full flex justify-center my-4 ${className}`}
    >
      <div className="w-full max-w-md min-h-[250px] flex items-center justify-center">
        <ins
          className="adsbygoogle w-[300px] h-[250px] block"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="rectangle"
        />
      </div>
    </div>
  );
};
