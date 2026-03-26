import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navLinks = [
  { to: '/tours', label: 'Туры' },
  { to: '/hotels', label: 'Гостиницы' },
  { to: '/excursions', label: 'Экскурсии' },
  { to: '/promotions', label: 'Акции' },
  { to: '/insurance', label: 'Страховка' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/contact', label: 'Контакты' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="font-semibold text-lg tracking-tight text-foreground">
            Турагентство
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cabinet">
              <Button variant="ghost" size="sm" className="gap-2">
                <Icon name="User" size={16} />
                <span className="hidden sm:inline">Личный кабинет</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm py-1 ${
                  location.pathname.startsWith(link.to)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-background mt-16">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-2">Турагентство</p>
            <p>Путешествия по всей России</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">Навигация</p>
            <div className="flex flex-col gap-1">
              {navLinks.slice(0, 4).map(l => (
                <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">Контакты</p>
            <p>info@tourism.ru</p>
            <p>+7 (800) 000-00-00</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
