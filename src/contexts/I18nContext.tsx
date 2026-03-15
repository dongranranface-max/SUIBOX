'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en' | 'ja' | 'ko' | 'ru';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  zh: {
    // 导航
    'nav.invite': '邀约',
    'nav.box': '盲盒',
    'nav.craft': '合成',
    'nav.auction': '拍卖',
    'nav.dao': 'DAO治理',
    'nav.join': '入驻',
    // 首页
    'home.search': '搜索NFT、艺术家、系列...',
    'home.login': '登录',
    'home.connect': '连接钱包',
    // 搜索
    'search.placeholder': '搜索NFT、艺术家、系列...',
    'search.noResult': '未找到相关结果',
    'search.hot': '热门搜索',
    // 通用
    'common.viewAll': '查看全部',
    'common.remaining': '剩余',
    'common.price': '价格',
  },
  en: {
    'nav.invite': 'Invite',
    'nav.box': 'Box',
    'nav.craft': 'Craft',
    'nav.auction': 'Auction',
    'nav.dao': 'DAO',
    'nav.join': 'Join',
    'home.search': 'Search NFT, Artist, Collection...',
    'home.login': 'Login',
    'home.connect': 'Connect Wallet',
    'search.placeholder': 'Search NFT, Artist, Collection...',
    'search.noResult': 'No results found',
    'search.hot': 'Hot Search',
    'common.viewAll': 'View All',
    'common.remaining': 'Remaining',
    'common.price': 'Price',
  },
  ja: {
    'nav.invite': '招待',
    'nav.box': 'ボックス',
    'nav.craft': '合成',
    'nav.auction': 'オークション',
    'nav.dao': 'DAO',
    'nav.join': '入驻',
    'home.search': 'NFT、アーティスト、コレクションを検索...',
    'home.login': 'ログイン',
    'home.connect': 'ウォレット接続',
    'search.placeholder': 'NFT、アーティスト、コレクションを検索...',
    'search.noResult': '結果が見つかりません',
    'search.hot': '人気検索',
    'common.viewAll': 'すべて見る',
    'common.remaining': '残り',
    'common.price': '価格',
  },
  ko: {
    'nav.invite': '초대',
    'nav.box': '박스',
    'nav.craft': '합성',
    'nav.auction': '경매',
    'nav.dao': 'DAO',
    'nav.join': '입주',
    'home.search': 'NFT, 아티스트, 컬렉션 검색...',
    'home.login': '로그인',
    'home.connect': '지갑 연결',
    'search.placeholder': 'NFT, 아티스트, 컬렉션 검색...',
    'search.noResult': '결과 없음',
    'search.hot': '인기 검색',
    'common.viewAll': '전체 보기',
    'common.remaining': '남음',
    'common.price': '가격',
  },
  ru: {
    'nav.invite': 'Пригласить',
    'nav.box': 'Бокс',
    'nav.craft': 'Крафт',
    'nav.auction': 'Аукцион',
    'nav.dao': 'DAO',
    'nav.join': 'Присоединиться',
    'home.search': 'Поиск NFT, Артист, Коллекция...',
    'home.login': 'Вход',
    'home.connect': 'Подключить кошелек',
    'search.placeholder': 'Поиск NFT, Артист, Коллекция...',
    'search.noResult': 'Результатов не найдено',
    'search.hot': 'Популярные',
    'common.viewAll': 'Смотреть все',
    'common.remaining': 'Осталось',
    'common.price': 'Цена',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
