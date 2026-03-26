import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import { api, type Tour } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

export default function Tours() {
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (season && season !== 'all') params.season = season;

  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ['tours', search, season],
    queryFn: () => api.getTours(params),
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Туры</h1>
          <p className="text-muted-foreground">Путешествия по всей России</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-56">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск туров..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Сезон" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сезоны</SelectItem>
              <SelectItem value="Лето">Лето</SelectItem>
              <SelectItem value="Зима">Зима</SelectItem>
              <SelectItem value="Весна">Весна</SelectItem>
              <SelectItem value="Осень">Осень</SelectItem>
            </SelectContent>
          </Select>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Туры не найдены. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
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
                      <span className="font-semibold">{format(tour.price)}</span>
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
