import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18nStore } from '@/stores/useI18nStore';

export const LanguageToggle = () => {
  const { locale, toggleLocale } = useI18nStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-2 font-medium"
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      {locale === 'en' ? 'عربي' : 'English'}
    </Button>
  );
};