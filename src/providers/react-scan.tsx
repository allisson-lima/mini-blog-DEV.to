'use client';

import { useEffect } from 'react';

export function ReactScan() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const script = document.createElement('script');
    script.src = '//unpkg.com/react-scan/dist/auto.global.js';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
