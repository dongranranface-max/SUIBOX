'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'mobile' | 'compact' }) {
  const { language, setLanguage, languages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  if (variant === 'compact') {
    return (
      <select
        value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
        className="bg-transparent text-gray-400 text-xs border-none focus:outline-none cursor-pointer"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code} className="bg-gray-800">
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="px-3 py-2">
        <p className="text-xs text-gray-500 mb-2">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                language === lang.code 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
              {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{currentLang?.flag}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    language === lang.code 
                      ? 'bg-violet-600/20 text-violet-400' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
