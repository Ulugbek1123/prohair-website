import { Link } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { LanguageProvider, useLanguage, type Language } from '../lib/language';

function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3 py-1 hover:opacity-90 transition-opacity">
      <img
        src="/logo2222222222.svg"
        alt="O‘zSTTA Logo"
        className="h-9 sm:h-11 w-auto max-w-[200px] sm:max-w-[240px] object-contain"
      />
    </Link>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    ['/', t('Главная', 'Bosh sahifa', 'Home')],
    ['/association', t('Об ассоциации', 'Assotsiatsiya', 'Association')],
    ['/events', t('Мероприятия', 'Tadbirlar', 'Events')],
    ['/education', t('Обучение', 'Ta’lim', 'Education')],
    ['/contacts', t('Контакты', 'Aloqa', 'Contact')],
  ] as const;

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="site-atmosphere" aria-hidden="true" />
      <header className="relative z-50 px-4 pt-4 sm:px-8 sm:pt-6">
        <nav
          className="glass-shell relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
          aria-label={t('Главная навигация', 'Asosiy menyu', 'Main navigation')}
        >
          <Logo />
          <div className="hidden items-center gap-6 lg:flex">
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === '/' }}
                className="nav-link"
                activeProps={{ className: 'text-primary underline underline-offset-8 font-semibold' }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              aria-label={t('Язык', 'Til', 'Language')}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-10 rounded-lg border border-border bg-card px-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="ru">RU</option>
              <option value="uz">UZ</option>
              <option value="en">EN</option>
            </select>
            <Button asChild className="hidden xl:inline-flex bg-accent text-accent-foreground font-bold hover:bg-accent/90">
              <Link to="/contacts">{t('Стать участником', 'A’zo bo‘lish', 'Join us')}</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={t('Меню', 'Menyu', 'Menu')}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
          {open && (
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] grid rounded-lg border border-border bg-card p-3 shadow-lg lg:hidden">
              {links.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: to === '/' }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 hover:bg-secondary font-medium"
                  activeProps={{ className: 'bg-secondary text-primary font-bold' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      {children}

      <footer className="relative border-t border-border bg-card/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {t(
                'Профессиональное сообщество трихологии Узбекистана.',
                'O‘zbekiston trixologiya mutaxassislari hamjamiyati.',
                'Uzbekistan’s professional trichology community.'
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className="footer-link">
                {label}
              </Link>
            ))}
            <Link to="/prohair-2027" className="footer-link text-accent hover:underline font-semibold">
              PROHAIR 2027
            </Link>
            <Link to="/prohair-2026" className="footer-link text-muted-foreground hover:text-accent">
              PROHAIR 2026
            </Link>
          </div>
          <div>
            <p className="footer-title">{t('Контакты', 'Aloqa', 'Contact')}</p>
            <a className="footer-link block" href="tel:+998773003080">
              +998 77 300 30 80
            </a>
            <a className="footer-link block" href="mailto:info@prohair.uz">
              info@prohair.uz
            </a>
            <p className="footer-link">{t('Узбекистан', 'O‘zbekiston', 'Uzbekistan')}</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-border px-4 py-5 text-xs text-muted-foreground">
          © 2026 O‘zSTTA. {t('Все права защищены.', 'Barcha huquqlar himoyalangan.', 'All rights reserved.')}
        </div>
      </footer>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Shell>{children}</Shell>
    </LanguageProvider>
  );
}
