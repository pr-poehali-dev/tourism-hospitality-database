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

export default function Index() {
  const { data: tours = [] } = useQuery<Tour[]>({ queryKey: ['tours'], queryFn: () => api.getTours() });
  const { data: promotions = [] } = useQuery<Promotion[]>({ queryKey: ['promotions'], queryFn: api.getPromotions });
  const { selectedCode, setSelectedCode, format } = useCurrency();

  return (
    <Layout>
      <section className="container mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Туристическое агентство</p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
          Путешествия<br />по России
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
          Туры, гостиницы, экскурсии — всё в одном месте. Откройте для себя красоту страны.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/tours">
            <Button size="lg" className="gap-2">
              <Icon name="Map" size={18} />
              Смотреть туры
            </Button>
          </Link>
          <Link to="/hotels">
            <Button size="lg" variant="outline" className="gap-2">
              <Icon name="Building2" size={18} />
              Гостиницы
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Популярные туры</h2>
            <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.slice(0, 3).map(tour => (
              <Link key={tour.tour_id} to={`/tours/${tour.tour_id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{tour.season}</Badge>
                      <span className="text-sm text-muted-foreground">{tour.duration} дн.</span>
                    </div>
                    <h3 className="font-medium mb-2">{tour.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={14} />
                        {tour.destination}
                      </div>
                      <span className="font-medium">{format(tour.price)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {tours.length > 3 && (
            <div className="text-center mt-8">
              <Link to="/tours">
                <Button variant="outline">Все туры</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-2xl font-light mb-8">Актуальные акции</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.map(promo => (
                <Card key={promo.promotion_id}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-light text-primary mb-2">−{promo.discount}%</div>
                    <h3 className="font-medium mb-2">{promo.name}</h3>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-light text-center mb-12">Почему мы</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: 'Shield', title: 'Надёжность', text: 'Работаем с 2005 года' },
            { icon: 'HeartHandshake', title: 'Поддержка 24/7', text: 'Всегда на связи' },
            { icon: 'CreditCard', title: 'Онлайн оплата', text: 'Удобно и безопасно' },
            { icon: 'Globe', title: 'Страховка', text: 'Для всех туров' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Icon name={item.icon} size={22} className="text-foreground" />
              </div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
