import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

type Translations = typeof en;

type Language = 'en' | 'ru';

const getInitialLanguage = (): Language => {
  const htmlLang = document.documentElement.lang.split('-')[0];
  if (htmlLang === 'ru') {
    return 'ru';
  }
  return 'en';
};

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { en, ru };

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const t = useMemo(() => (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[language];
    for (const key of keys) {
      if (result[key] === undefined) {
        return path;
      }
      result = result[key];
    }
    return result;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};

