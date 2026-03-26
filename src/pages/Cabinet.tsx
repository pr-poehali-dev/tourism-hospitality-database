import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import { api, type Booking } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  confirmed: { label: 'Подтверждено', variant: 'default' },
  pending: { label: 'Ожидает', variant: 'secondary' },
  cancelled: { label: 'Отменено', variant: 'destructive' },
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Cabinet() {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const { selectedCode, setSelectedCode, format } = useCurrency();

  const { data: bookings = [], isLoading, isFetched } = useQuery<Booking[]>({
    queryKey: ['bookings', searchEmail],
    queryFn: () => api.getBookings(searchEmail),
    enabled: !!searchEmail,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchEmail(email.trim());
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своими бронированиями</p>
        </div>

        <Card className="max-w-md mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="cab-email">Email для поиска бронирований</Label>
                <Input
                  id="cab-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ваш email"
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Icon name="Search" size={16} />
                Найти бронирования
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
          </div>
        )}

        {isFetched && !isLoading && bookings.length === 0 && searchEmail && (
          <div className="text-center py-16 text-muted-foreground">
            <Icon name="Calendar" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Бронирований не найдено для {searchEmail}</p>
          </div>
        )}

        {bookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">Ваши бронирования</h2>
              <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
            </div>
            <div className="space-y-4">
              {bookings.map(b => {
                const status = STATUS_MAP[b.status] || { label: b.status, variant: 'outline' as const };
                return (
                  <Card key={b.booking_id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-medium">
                            {b.tour_name || (b.hotel_name ? `${b.hotel_name} — ${b.room_category}` : `Бронь #${b.booking_id}`)}
                          </p>
                          <p className="text-sm text-muted-foreground">Создано {formatDate(b.booking_date)}</p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Заезд</p>
                          <p className="font-medium">{formatDate(b.check_in_date)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Выезд</p>
                          <p className="font-medium">{formatDate(b.check_out_date)}</p>
                        </div>
                        {b.total_amount && (
                          <div>
                            <p className="text-muted-foreground">Сумма</p>
                            <p className="font-medium">{format(b.total_amount)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
