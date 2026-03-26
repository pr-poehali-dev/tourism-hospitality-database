import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import { api, type Hotel } from '@/lib/api';

const categoryColors: Record<string, string> = {
  'Люкс': 'bg-amber-100 text-amber-800',
  'Бизнес': 'bg-blue-100 text-blue-800',
  'Эконом': 'bg-emerald-100 text-emerald-800',
  'Стандарт': 'bg-slate-100 text-slate-700',
};

const cardBgs = [
  'from-blue-600 to-blue-800',
  'from-emerald-600 to-emerald-800',
  'from-violet-600 to-violet-800',
  'from-slate-600 to-slate-800',
  'from-teal-600 to-teal-800',
];

export default function Hotels() {
  const [search, setSearch] = useState('');

  const { data: hotels = [], isLoading } = useQuery<Hotel[]>({
    queryKey: ['hotels', search],
    queryFn: () => api.getHotels(search ? { search } : {}),
  });

  return (
    <Layout>
      <div className="gradient-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Гостиницы</h1>
          <p className="text-blue-100 text-lg">Комфортное размещение для вашего отдыха</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-8">
          <div className="relative max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск гостиниц..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                <div className="h-44 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="SearchX" size={36} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Гостиницы не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <Link key={hotel.hotel_id} to={`/hotels/${hotel.hotel_id}`}>
                <Card className="card-hover cursor-pointer h-full overflow-hidden border-0 shadow-md rounded-2xl">
                  <div className={`h-44 bg-gradient-to-br ${cardBgs[i % cardBgs.length]} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <Icon name="Building2" size={90} className="text-white" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                        <StarRating rating={Math.round(hotel.rating)} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-bold text-base">{hotel.name}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[hotel.category] || 'bg-muted text-muted-foreground'}`}>
                        {hotel.category}
                      </span>
                      <span className="text-xs text-muted-foreground">★ {hotel.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={13} className="text-primary shrink-0" />
                      <span className="line-clamp-1">{hotel.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
