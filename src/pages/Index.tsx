import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { api, type Tour, type Promotion } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';
import CurrencySelector from '@/components/CurrencySelector';
import Layout from '@/components/Layout';

const heroBg = 'https://cdn.poehali.dev/projects/55bff504-d429-40d0-b639-129b39ff4252/files/6e766e93-5d53-408e-8e80-de74d5ec8696.jpg';

const stats = [
  { value: '20+', label: 'лет на рынке' },
  { value: '5 000+', label: 'довольных туристов' },
  { value: '150+', label: 'маршрутов' },
  { value: '24/7', label: 'поддержка' },
];

const benefits = [
  { icon: 'Shield', title: 'Надёжность', text: 'Работаем с 2005 года, все туры лицензированы', color: 'bg-blue-50 text-blue-600' },
  { icon: 'HeartHandshake', title: 'Поддержка 24/7', text: 'Менеджер на связи в любое время', color: 'bg-amber-50 text-amber-600' },
  { icon: 'CreditCard', title: 'Удобная оплата', text: 'Карта, наличные, рассрочка', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'Globe', title: 'Страховка', text: 'Включена в каждый тур', color: 'bg-violet-50 text-violet-600' },
];

export default function Index() {
  const { data: tours = [] } = useQuery<Tour[]>({ queryKey: ['tours'], queryFn: () => api.getTours() });
  const { data: promotions = [] } = useQuery<Promotion[]>({ queryKey: ['promotions'], queryFn: api.getPromotions });
  const { selectedCode, setSelectedCode, format } = useCurrency();

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/60 to-blue-950/80" />
        <div className="relative z-10 text-center text-white px-4 py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 text-sm mb-6">
            <Icon name="Star" size={14} className="text-amber-400" />
            Туристическое агентство №1 в России
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Откройте<br />
            <span className="text-amber-400">красоту России</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Туры, гостиницы, экскурсии — всё в одном месте. Незабываемые путешествия по самой большой стране мира.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/tours">
              <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-400 text-white border-0 shadow-lg shadow-amber-500/30 px-8 h-12 text-base">
                <Icon name="Map" size={18} />
                Выбрать тур
              </Button>
            </Link>
            <Link to="/promotions">
              <Button size="lg" variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/15 px-8 h-12 text-base backdrop-blur-sm">
                <Icon name="Tag" size={18} />
                Акции и скидки
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center text-white">
                <p className="text-2xl font-bold text-amber-400">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/tours', icon: 'Map', label: 'Туры', color: 'from-blue-500 to-blue-700' },
            { to: '/hotels', icon: 'Building2', label: 'Гостиницы', color: 'from-emerald-500 to-emerald-700' },
            { to: '/excursions', icon: 'Camera', label: 'Экскурсии', color: 'from-violet-500 to-violet-700' },
            { to: '/promotions', icon: 'Tag', label: 'Акции', color: 'from-amber-500 to-orange-600' },
          ].map(item => (
            <Link key={item.to} to={item.to}>
              <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-white flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name={item.icon} size={24} className="text-white" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular tours */}
      <section className="container mx-auto px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Популярные туры
            </h2>
            <p className="text-muted-foreground mt-1">Самые востребованные направления</p>
          </div>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour, i) => (
            <Link key={tour.tour_id} to={`/tours/${tour.tour_id}`}>
              <Card className="card-hover cursor-pointer h-full overflow-hidden border-0 shadow-md">
                <div
                  className="h-44 relative"
                  style={{
                    background: `linear-gradient(135deg, hsl(${210 + i * 20}, 70%, ${35 + i * 5}%) 0%, hsl(${190 + i * 15}, 80%, ${45 + i * 5}%) 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Icon name="Map" size={80} className="text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="badge-gold border-0 text-xs font-semibold shadow-sm">
                      {tour.season}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center gap-1">
                    <Icon name="Clock" size={11} />
                    {tour.duration} дн.
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-lg leading-tight drop-shadow-md">{tour.name}</p>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={13} className="text-primary" />
                      {tour.destination}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">от</p>
                      <p className="font-bold text-primary text-lg">{format(tour.price)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {tours.length > 3 && (
          <div className="text-center mt-8">
            <Link to="/tours">
              <Button variant="outline" size="lg" className="gap-2 border-primary/40 text-primary hover:bg-primary hover:text-white transition-colors px-8">
                <Icon name="ArrowRight" size={16} />
                Все {tours.length} туров
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  🔥 Горящие акции
                </h2>
                <p className="text-blue-200 mt-1">Успейте забронировать по выгодной цене</p>
              </div>
              <Link to="/promotions">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/15">
                  Все акции
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {promotions.map(promo => (
                <div key={promo.promotion_id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="text-5xl font-black text-amber-400 mb-2">−{promo.discount}%</div>
                  <h3 className="text-white font-bold text-lg mb-2">{promo.name}</h3>
                  <p className="text-blue-100 text-sm">{promo.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Почему выбирают нас
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Более 20 лет мы помогаем людям открывать красоту России
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow text-center">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon name={item.icon} size={26} />
              </div>
              <h3 className="font-bold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Готовы к приключению?
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Свяжитесь с нашим менеджером — подберём тур под ваш бюджет и пожелания
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-white border-0 px-8 shadow-lg shadow-amber-500/25">
                Связаться с нами
              </Button>
            </Link>
            <Link to="/tours">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                Смотреть туры
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
