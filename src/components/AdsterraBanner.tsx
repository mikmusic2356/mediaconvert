import React, { useEffect, useRef } from 'react';

export type AdsterraBannerType = '160x600' | '300x250' | '320x50' | '728x90';

interface AdsterraBannerProps {
  type: AdsterraBannerType;
  className?: string;
}

const AD_CONFIGS: Record<AdsterraBannerType, { key: string; width: number; height: number }> = {
  '160x600': {
    key: '872520871ea78df5618d9477bbb10a62',
    width: 160,
    height: 600,
  },
  '300x250': {
    key: '539a84e603bbd1b989d7a84674e0764e',
    width: 300,
    height: 250,
  },
  '320x50': {
    key: '741f63b4d4e71dff1ef32af97cd5ff64',
    width: 320,
    height: 50,
  },
  '728x90': {
    key: 'c03d1f0619acb0466b0b0468e71ca186',
    width: 728,
    height: 90,
  },
};

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ type, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = AD_CONFIGS[type];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous iframe to prevent duplicates on route change
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = String(config.width);
    iframe.height = String(config.height);
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.title = `Adsterra ${type} Ad`;

    container.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${config.key}',
                'format' : 'iframe',
                'height' : ${config.height},
                'width' : ${config.width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://bauval.org/22/${config.key}"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [type, config.key, config.width, config.height]);

  return (
    <div
      className={`flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{ minWidth: config.width, minHeight: config.height }}
    >
      <div ref={containerRef} style={{ width: config.width, height: config.height }} />
    </div>
  );
};
