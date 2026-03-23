'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { languages, defaultLanguage, LanguageCode, LANGUAGE_KEY, getBrowserLanguage } from './config';
import { zh, Translations } from './zh';
import { en } from './en';
import { ko } from './ko';
import { es } from './es';

// 翻译映射
const translations: Record<LanguageCode, Translations> = { en, zh, ko, es };

// 简化翻译函数
function getNestedValue(obj: unknown, path: string): string {
  const result = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : '';
}

// I18n Context
interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: typeof languages;
  tt: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// 简化翻译函数 - 可以直接用 tt('nav.home') 获取翻译
const createTranslateFn = (t: Translations) => (key: string, fallback?: string): string => {
  const result = getNestedValue(t, key);
  return result || fallback || key;
};

// Provider 组件
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return defaultLanguage;
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && languages.some((l) => l.code === saved)) {
      return saved as LanguageCode;
    }
    return getBrowserLanguage();
  });

  // 保存语言到 localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = translations[language];
  const tt = createTranslateFn(t);

  return (
    <I18nContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      languages,
      tt
    }}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用翻译的 Hook - SSR safe
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // SSR fallback - return default values
    const t = translations[defaultLanguage];
    return {
      language: defaultLanguage as LanguageCode,
      setLanguage: (lang: LanguageCode) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LANGUAGE_KEY, lang);
        }
      },
      t,
      languages,
      tt: createTranslateFn(t),
    };
  }
  return context;
}

// 格式化翻译字符串 (支持变量替换)
export function formatMessage(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || ''));
}
