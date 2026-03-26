import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const navLinks = [
  { to: '/tours', label: 'Туры', icon: 'Map' },
  { to: '/hotels', label: 'Гостиницы', icon: 'Building2' },
  { to: '/excursions', label: 'Экскурсии', icon: 'Camera' },
  { to: '/promotions', label: 'Акции', icon: 'Tag' },
  { to: '/insurance', label: 'Страховка', icon: 'Shield' },
  { to: '/reviews', label: 'Отзывы', icon: 'Star' },
  { to: '/contact', label: 'Контакты', icon: 'Phone' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100'
            : 'bg-white shadow-sm border-b border-blue-100'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-18 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 gradient-card rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Icon name="Compass" size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                РусТур
              </span>
              <p className="text-xs text-muted-foreground leading-none">путешествия по России</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cabinet" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                <Icon name="User" size={15} />
                Кабинет
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? 'X' : 'Menu'} size={22} />
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-4 grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </Link>
            ))}
            <Link
              to="/cabinet"
              className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg text-muted-foreground hover:bg-muted col-span-2"
              onClick={() => setMobileOpen(false)}
            >
              <Icon name="User" size={15} />
              Личный кабинет
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 text-slate-300 mt-0">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 gradient-card rounded-xl flex items-center justify-center">
                  <Icon name="Compass" size={18} className="text-white" />
                </div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  РусТур
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Туристическое агентство. Путешествия по всей России с 2005 года.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Icon name="MessageCircle" size={14} className="text-white" />
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Icon name="Instagram" size={14} className="text-white" />
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Icon name="Globe" size={14} className="text-white" />
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Туры и отдых</p>
              <div className="flex flex-col gap-2">
                {navLinks.slice(0, 3).map(l => (
                  <Link key={l.to} to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Сервис</p>
              <div className="flex flex-col gap-2">
                {navLinks.slice(3).map(l => (
                  <Link key={l.to} to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Контакты</p>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  +7 (800) 000-00-00
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  info@rustur.ru
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} />
                  Москва, ул. Тверская, 1
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} />
                  Пн–Пт: 9:00–19:00
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
            <span>© 2025 РусТур. Все права защищены.</span>
            <span>Лицензия Ростуризма № РТО-12345</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
