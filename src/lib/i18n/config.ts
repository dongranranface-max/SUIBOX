// 语言配置
export const languages = [
  { code: 'zh', name: '中文', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

// 默认语言
export const defaultLanguage: LanguageCode = 'zh';

// 语言存储key
export const LANGUAGE_KEY = 'suibox_language';

// 获取浏览器语言
export function getBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return defaultLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  const supported = languages.map(l => l.code);
  
  return supported.includes(browserLang) ? browserLang as LanguageCode : defaultLanguage;
}
