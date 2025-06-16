'use client';

export function ReactScanScript() {
  return (
    process.env.NODE_ENV === 'development' && (
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
    )
  );
}
