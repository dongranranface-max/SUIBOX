'use client';

/**
 * Compatibility re-export from lib/i18n.
 * All components should import from @/lib/i18n directly.
 * This file exists to avoid breaking imports that reference @/contexts/I18nContext.
 */
export { I18nProvider, useI18n, formatMessage } from '@/lib/i18n';
