import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import CurrencySelector from '@/components/CurrencySelector';
import BookingForm from '@/components/BookingForm';
import { api, type Hotel } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const { data: hotel, isLoading } = useQuery<Hotel>({
    queryKey: ['hotel', id],
    queryFn: () => api.getHotel(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 bg-muted animate-pulse rounded w-64 mb-8" />
        <div className="h-40 bg-muted animate-pulse rounded" />
      </div>
    </Layout>
  );

  if (!hotel) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Гостиница не найдена</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Link to="/hotels" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 w-fit">
          <Icon name="ArrowLeft" size={14} />
          Назад к гостиницам
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline">{hotel.category}</Badge>
            <StarRating rating={Math.round(hotel.rating)} />
            <span className="text-sm text-muted-foreground">{hotel.rating}</span>
          </div>
          <h1 className="text-3xl font-light mb-2">{hotel.name}</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span>{hotel.address}</span>
          </div>
        </div>

        <p className="text-foreground leading-relaxed mb-10 max-w-2xl">{hotel.description}</p>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-light">Номера</h2>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(hotel.rooms || []).map(room => (
            <Card key={room.room_id} className={!room.is_available ? 'opacity-50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium">{room.category}</h3>
                  {!room.is_available && <Badge variant="outline">Занят</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{room.amenities}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Icon name="Users" size={14} />
                  <span>до {room.capacity} чел.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{format(room.price)}<span className="text-sm font-normal text-muted-foreground">/ночь</span></span>
                  {room.is_available && (
                    <BookingForm
                      roomId={room.room_id}
                      roomName={`${hotel.name} — ${room.category}`}
                      price={room.price}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
