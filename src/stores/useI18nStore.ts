import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, Direction, defaultLocale, getDirection } from '@/lib/i18n';

interface I18nStore {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      direction: getDirection(defaultLocale),
      setLocale: (locale: Locale) => {
        const direction = getDirection(locale);
        set({ locale, direction });
        
        // Update document attributes
        document.documentElement.lang = locale;
        document.documentElement.dir = direction;
        document.documentElement.setAttribute('dir', direction);
      },
      toggleLocale: () => {
        const currentLocale = get().locale;
        const newLocale = currentLocale === 'en' ? 'ar' : 'en';
        get().setLocale(newLocale);
      },
    }),
    {
      name: 'i18n-storage',
    }
  )
);