// 语言配置
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

// 默认语言
export const defaultLanguage: LanguageCode = 'en';

// 语言存储key
export const LANGUAGE_KEY = 'suibox_language';

// 获取浏览器语言
export function getBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return defaultLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  const supported = languages.map(l => l.code);
  
  return supported.includes(browserLang) ? browserLang as LanguageCode : defaultLanguage;
}
