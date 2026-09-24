'use client';

import type { ReactNode } from 'react';
import { PixelLink } from '@/components/ui/PixelButton';
import { cvFileName, cvHref } from '@/config/site';
import type { Locale } from '@/i18n/locales';

interface CvDownloadLinkProps {
  cvLocale: Locale;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

export function CvDownloadLink({
  cvLocale,
  variant = 'primary',
  size = 'lg',
  className,
  children,
}: CvDownloadLinkProps) {
  return (
    <PixelLink
      href={cvHref(cvLocale)}
      download={cvFileName(cvLocale)}
      hrefLang={cvLocale}
      type="application/pdf"
      variant={variant}
      size={size}
      sound="coin"
      className={className}
    >
      {children}
    </PixelLink>
  );
}
