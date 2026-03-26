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

const excIcons = ['Camera', 'Mountain', 'Binoculars', 'Landmark', 'TreePine'];
const excColors = [
  'from-violet-500 to-purple-700',
  'from-teal-500 to-cyan-700',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
];

export default function Excursions() {
  const [search, setSearch] = useState('');
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const { data: excursions = [], isLoading } = useQuery<Excursion[]>({
    queryKey: ['excursions', search],
    queryFn: () => api.getExcursions(search ? { search } : {}),
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-violet-600 to-purple-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Экскурсии</h1>
          <p className="text-violet-100 text-lg">Откройте новые места с опытными гидами</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-8 flex flex-wrap gap-3">
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                <div className="h-40 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : excursions.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="SearchX" size={36} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Экскурсии не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {excursions.map((exc, i) => (
              <Card key={exc.excursion_id} className="card-hover overflow-hidden border-0 shadow-md rounded-2xl">
                <div className={`h-32 bg-gradient-to-br ${excColors[i % excColors.length]} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Icon name={excIcons[i % excIcons.length]} size={80} className="text-white" />
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight">{exc.name}</h3>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{exc.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 text-sm">
                      <Icon name="Clock" size={14} className="text-primary" />
                      <span>{exc.duration} ч.</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 text-sm">
                      <Icon name="Languages" size={14} className="text-primary" />
                      <span>{exc.language}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 text-sm col-span-2">
                      <Icon name="CalendarClock" size={14} className="text-primary" />
                      <span>{exc.schedule}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">стоимость</p>
                      <p className="font-bold text-primary text-xl">{format(exc.price)}</p>
                    </div>
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
