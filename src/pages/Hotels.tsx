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

export default function Hotels() {
  const [search, setSearch] = useState('');

  const { data: hotels = [], isLoading } = useQuery<Hotel[]>({
    queryKey: ['hotels', search],
    queryFn: () => api.getHotels(search ? { search } : {}),
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Гостиницы</h1>
          <p className="text-muted-foreground">Комфортное размещение для вашего отдыха</p>
        </div>

        <div className="relative max-w-md mb-8">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск гостиниц..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Гостиницы не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <Link key={hotel.hotel_id} to={`/hotels/${hotel.hotel_id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{hotel.category}</Badge>
                      <StarRating rating={Math.round(hotel.rating)} />
                    </div>
                    <h3 className="font-medium mb-1">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
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
