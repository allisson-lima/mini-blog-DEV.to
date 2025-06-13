'use client';

import { useReportWebVitals } from 'next/web-vitals';

const logWebVitals = (metric) => {
  // eslint-disable-next-line no-console
  console.log(metric);
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);

  return null;
}
