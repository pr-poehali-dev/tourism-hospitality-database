import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import BookingForm from '@/components/BookingForm';
import { api, type Excursion } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

export default function Excursions() {
  const [search, setSearch] = useState('');
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const { data: excursions = [], isLoading } = useQuery<Excursion[]>({
    queryKey: ['excursions', search],
    queryFn: () => api.getExcursions(search ? { search } : {}),
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Экскурсии</h1>
          <p className="text-muted-foreground">Откройте новые места с опытными гидами</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-56">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск экскурсий..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : excursions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Экскурсии не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {excursions.map(exc => (
              <Card key={exc.excursion_id}>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-2">{exc.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{exc.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>{exc.duration} ч.</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Languages" size={14} />
                      <span>{exc.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <Icon name="CalendarClock" size={14} />
                      <span>{exc.schedule}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{format(exc.price)}</span>
                    <BookingForm
                      tourId={undefined}
                      roomId={undefined}
                      tourName={exc.name}
                      price={exc.price}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
