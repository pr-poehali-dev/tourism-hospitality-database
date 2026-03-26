import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import BookingForm from '@/components/BookingForm';
import { api, type Tour } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

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
        <div className="h-40 bg-muted animate-pulse rounded" />
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
      <div className="container mx-auto px-4 py-12">
        <Link to="/tours" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 w-fit">
          <Icon name="ArrowLeft" size={14} />
          Назад к турам
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary">{tour.season}</Badge>
              <span className="text-sm text-muted-foreground">{tour.duration} дней</span>
            </div>
            <h1 className="text-3xl font-light mb-4">{tour.name}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-6">
              <Icon name="MapPin" size={16} />
              <span>{tour.destination}</span>
            </div>
            <p className="text-foreground leading-relaxed mb-8">{tour.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Icon name="Calendar" size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Длительность</p>
                  <p className="font-medium">{tour.duration} дней</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Icon name="Sun" size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Сезон</p>
                  <p className="font-medium">{tour.season}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Icon name="MapPin" size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Направление</p>
                  <p className="font-medium">{tour.destination}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Стоимость</span>
                  <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
                </div>
                <div className="text-3xl font-light mb-6">{format(tour.price)}</div>
                <BookingForm tourId={tour.tour_id} tourName={tour.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
