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

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; color: string }> = {
  confirmed: { label: 'Подтверждено', variant: 'default', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Ожидает', variant: 'secondary', color: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'Отменено', variant: 'destructive', color: 'bg-red-100 text-red-700' },
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
      <div className="bg-gradient-to-br from-slate-600 to-blue-900 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-16">
          <Icon name="User" size={220} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Личный кабинет</h1>
          <p className="text-slate-300 text-lg">Управляйте своими бронированиями</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mb-10">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="gradient-card px-6 py-4">
              <h2 className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Найти бронирования
              </h2>
              <p className="text-blue-100 text-sm">Введите email, указанный при бронировании</p>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="cab-email" className="font-semibold text-sm">Email</Label>
                  <Input
                    id="cab-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Ваш email"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full gap-2 h-11">
                  <Icon name="Search" size={16} />
                  Найти бронирования
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-border p-6 shadow-sm">
                <div className="h-4 bg-muted animate-pulse rounded w-48 mb-3" />
                <div className="h-3 bg-muted animate-pulse rounded w-32 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-8 bg-muted animate-pulse rounded" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {isFetched && !isLoading && bookings.length === 0 && searchEmail && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="Calendar" size={36} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Бронирования не найдены</h3>
            <p className="text-muted-foreground">По адресу {searchEmail} ничего не найдено</p>
          </div>
        )}

        {bookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ваши бронирования
              </h2>
              <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
            </div>
            <div className="space-y-4">
              {bookings.map(b => {
                const status = STATUS_MAP[b.status] || { label: b.status, variant: 'outline' as const, color: 'bg-muted text-muted-foreground' };
                const isTour = !!b.tour_name;
                return (
                  <Card key={b.booking_id} className="border-0 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-2 ${isTour ? 'bg-gradient-to-r from-blue-500 to-blue-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-700'}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTour ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                            <Icon name={isTour ? 'Map' : 'Building2'} size={18} className={isTour ? 'text-blue-600' : 'text-emerald-600'} />
                          </div>
                          <div>
                            <p className="font-bold">
                              {b.tour_name || (b.hotel_name ? `${b.hotel_name} — ${b.room_category}` : `Бронь #${b.booking_id}`)}
                            </p>
                            <p className="text-sm text-muted-foreground">Создано {formatDate(b.booking_date)}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-muted/50 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Заезд</p>
                          <p className="font-semibold text-sm">{formatDate(b.check_in_date)}</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Выезд</p>
                          <p className="font-semibold text-sm">{formatDate(b.check_out_date)}</p>
                        </div>
                        {b.total_amount && (
                          <div className="bg-primary/5 rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Сумма</p>
                            <p className="font-bold text-primary text-sm">{format(b.total_amount)}</p>
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
