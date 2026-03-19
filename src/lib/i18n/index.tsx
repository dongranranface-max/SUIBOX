'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { languages, defaultLanguage, LanguageCode, LANGUAGE_KEY, getBrowserLanguage } from './config';
import { zh, Translations } from './zh';
import { en } from './en';
import { ja } from './ja';
import { ru } from './ru';

// 翻译映射
const translations: Record<LanguageCode, Translations> = { zh, en, ja, ru };

// I18n Context
interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: typeof languages;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Provider 组件
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // 初始化语言
  useEffect(() => {
    setMounted(true);
    // 优先从 localStorage 读取
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && languages.some(l => l.code === saved)) {
      setLanguageState(saved as LanguageCode);
    } else {
      // 其次使用浏览器语言
      setLanguageState(getBrowserLanguage());
    }
  }, []);

  // 保存语言到 localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  // 防止 SSR hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translations[language],
      languages 
    }}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用翻译的 Hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// 格式化翻译字符串 (支持变量替换)
export function formatMessage(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || ''));
}
