import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import BookingForm from '@/components/BookingForm';
import { api, type Tour } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

const seasonColors: Record<string, string> = {
  'Лето': 'from-amber-400 to-orange-500',
  'Зима': 'from-blue-400 to-blue-600',
  'Весна': 'from-emerald-400 to-green-500',
  'Осень': 'from-orange-400 to-red-500',
};

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const { data: tour, isLoading } = useQuery<Tour>({
    queryKey: ['tour', id],
    queryFn: () => api.getTour(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 bg-muted animate-pulse rounded w-64 mb-4" />
        <div className="h-4 bg-muted animate-pulse rounded w-96 mb-8" />
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    </Layout>
  );

  if (!tour) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Тур не найден
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Hero */}
      <div className={`bg-gradient-to-br from-blue-600 to-blue-900 py-16 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Icon name="Map" size={300} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/tours" className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <Icon name="ArrowLeft" size={14} />
            Все туры
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-block bg-gradient-to-r ${seasonColors[tour.season] || 'from-blue-400 to-blue-600'} text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow`}>
              {tour.season}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Icon name="Clock" size={13} />
              {tour.duration} дней
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.name}</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <Icon name="MapPin" size={16} />
            <span className="text-lg">{tour.destination}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Info cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: 'Calendar', label: 'Длительность', value: `${tour.duration} дней`, color: 'text-blue-600 bg-blue-50' },
                { icon: 'Sun', label: 'Сезон', value: tour.season, color: 'text-amber-600 bg-amber-50' },
                { icon: 'MapPin', label: 'Направление', value: tour.destination, color: 'text-emerald-600 bg-emerald-50' },
              ].map(item => (
                <Card key={item.label} className="border-0 shadow-sm rounded-xl">
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon name={item.icon} size={18} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Icon name="FileText" size={20} className="text-primary" />
                Описание тура
              </h2>
              <p className="text-foreground leading-relaxed">{tour.description}</p>
            </div>

            {/* What's included */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-emerald-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Что включено
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Трансфер', 'Проживание', 'Питание', 'Экскурсии', 'Страховка', 'Гид'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-emerald-800">
                    <Icon name="CheckCircle2" size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div>
            <Card className="sticky top-24 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="gradient-card p-5 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-100 text-sm">Стоимость тура</span>
                  <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
                </div>
                <div className="text-4xl font-black">{format(tour.price)}</div>
                <p className="text-blue-100 text-xs mt-1">на человека</p>
              </div>
              <CardContent className="p-5">
                <BookingForm tourId={tour.tour_id} tourName={tour.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
