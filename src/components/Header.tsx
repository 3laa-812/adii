import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useI18nStore } from '@/stores/useI18nStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { t } from '@/lib/i18n';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useI18nStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navigation = [
    { name: t('home', locale), href: '/' },
    { name: t('dashboard', locale), href: '/dashboard', auth: true },
    { name: t('vehicles', locale), href: '/vehicles', auth: true },
    { name: t('wallet', locale), href: '/wallet', auth: true },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.auth || (item.auth && isAuthenticated)
  );

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="font-bold text-xl text-foreground">
              Smart Toll
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  {t('logout', locale)}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href="/login">{t('login', locale)}</a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <a href="/signup">{t('signup', locale)}</a>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              {filteredNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">
                      {user?.name}
                    </span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      {t('logout', locale)}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/login">{t('login', locale)}</a>
                    </Button>
                    <Button variant="hero" size="sm" asChild>
                      <a href="/signup">{t('signup', locale)}</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};