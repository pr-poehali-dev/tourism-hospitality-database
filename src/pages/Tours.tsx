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

const seasonColors: Record<string, string> = {
  'Лето': 'from-amber-400 to-orange-500',
  'Зима': 'from-blue-400 to-blue-600',
  'Весна': 'from-emerald-400 to-green-500',
  'Осень': 'from-orange-400 to-red-500',
};

const cardGradients = [
  'from-blue-500 to-blue-700',
  'from-teal-500 to-emerald-700',
  'from-violet-500 to-purple-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-700',
];

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
      {/* Header banner */}
      <div className="gradient-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Туры по России</h1>
          <p className="text-blue-100 text-lg">Откройте для себя красоту самой большой страны мира</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-8 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-56">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск туров..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 border-border"
            />
          </div>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Все сезоны" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сезоны</SelectItem>
              <SelectItem value="Лето">🌞 Лето</SelectItem>
              <SelectItem value="Зима">❄️ Зима</SelectItem>
              <SelectItem value="Весна">🌸 Весна</SelectItem>
              <SelectItem value="Осень">🍂 Осень</SelectItem>
            </SelectContent>
          </Select>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
          {(search || (season && season !== 'all')) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setSeason(''); }} className="gap-1 text-muted-foreground">
              <Icon name="X" size={14} />
              Сбросить
            </Button>
          )}
        </div>

        {/* Results count */}
        {!isLoading && tours.length > 0 && (
          <p className="text-sm text-muted-foreground mb-5">Найдено туров: <strong className="text-foreground">{tours.length}</strong></p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                <div className="h-44 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="SearchX" size={36} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Туры не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, i) => (
              <Link key={tour.tour_id} to={`/tours/${tour.tour_id}`}>
                <Card className="card-hover cursor-pointer h-full overflow-hidden border-0 shadow-md rounded-2xl">
                  <div
                    className={`h-44 relative bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <Icon name="Map" size={90} className="text-white" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block bg-gradient-to-r ${seasonColors[tour.season] || 'from-blue-400 to-blue-600'} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}>
                        {tour.season}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center gap-1">
                      <Icon name="Clock" size={11} />
                      {tour.duration} дн.
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-bold text-base leading-tight">{tour.name}</p>
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
                        <p className="text-xs text-muted-foreground leading-none mb-0.5">от</p>
                        <p className="font-bold text-primary text-base">{format(tour.price)}</p>
                      </div>
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
