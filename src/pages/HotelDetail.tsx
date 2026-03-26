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
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    </Layout>
  );

  if (!hotel) return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Гостиница не найдена</div>
    </Layout>
  );

  const availableRooms = (hotel.rooms || []).filter(r => r.is_available).length;

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Icon name="Building2" size={300} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/hotels" className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white text-sm mb-6 transition-colors">
            <Icon name="ArrowLeft" size={14} />
            Все гостиницы
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              {hotel.category}
            </span>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
              <StarRating rating={Math.round(hotel.rating)} />
              <span className="text-white text-sm">{hotel.rating}</span>
            </div>
            {availableRooms > 0 && (
              <span className="bg-emerald-400/30 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                {availableRooms} номеров свободно
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{hotel.name}</h1>
          <div className="flex items-center gap-2 text-emerald-100">
            <Icon name="MapPin" size={16} />
            <span>{hotel.address}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Description */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Icon name="Info" size={20} className="text-primary" />
            О гостинице
          </h2>
          <p className="text-foreground leading-relaxed">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-10">
          {['Wi-Fi', 'Парковка', 'Ресторан', 'Спа', 'Тренажёрный зал', 'Завтрак'].map(a => (
            <div key={a} className="flex items-center gap-1.5 bg-muted/60 border border-border rounded-full px-4 py-1.5 text-sm">
              <Icon name="CheckCircle2" size={13} className="text-emerald-600" />
              {a}
            </div>
          ))}
        </div>

        {/* Rooms */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Номера</h2>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(hotel.rooms || []).map(room => (
            <Card key={room.room_id} className={`border-0 shadow-md rounded-2xl overflow-hidden transition-all duration-300 ${!room.is_available ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-xl'}`}>
              <div className={`h-28 relative ${room.is_available ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Icon name="BedDouble" size={60} className="text-white" />
                </div>
                <div className="absolute top-3 right-3">
                  {!room.is_available ? (
                    <Badge variant="outline" className="bg-black/30 backdrop-blur-sm text-white border-white/30 text-xs">Занят</Badge>
                  ) : (
                    <Badge className="bg-emerald-500 text-white border-0 text-xs">Свободен</Badge>
                  )}
                </div>
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-bold">{room.category}</p>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-3">{room.amenities}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Icon name="Users" size={13} className="text-primary" />
                  <span>до {room.capacity} чел.</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary">{format(room.price)}</span>
                    <span className="text-xs text-muted-foreground">/ночь</span>
                  </div>
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
