import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  tourId?: number;
  roomId?: number;
  tourName?: string;
  roomName?: string;
  price?: number;
}

export default function BookingForm({ tourId, roomId, tourName, roomName, price }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_name: '', client_email: '', client_phone: '',
    check_in_date: '', check_out_date: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.client_email) {
      toast.error('Укажите имя и email');
      return;
    }
    setLoading(true);
    try {
      await api.createBooking({
        ...form,
        tour_id: tourId,
        room_id: roomId,
        total_amount: price,
        currency_code: 'RUB',
      });
      toast.success('Бронирование успешно создано!');
      setOpen(false);
      setForm({ client_name: '', client_email: '', client_phone: '', check_in_date: '', check_out_date: '' });
    } catch {
      toast.error('Ошибка при бронировании');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button className="w-full" onClick={() => setOpen(true)}>
        Забронировать
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {(tourName || roomName) && (
        <p className="text-sm text-muted-foreground border-b pb-3">
          {tourName || roomName}
        </p>
      )}
      <div>
        <Label htmlFor="name">Имя *</Label>
        <Input id="name" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Ваше имя" />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} placeholder="email@example.com" />
      </div>
      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input id="phone" value={form.client_phone} onChange={e => set('client_phone', e.target.value)} placeholder="+7 999 000 00 00" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="checkin">Заезд</Label>
          <Input id="checkin" type="date" value={form.check_in_date} onChange={e => set('check_in_date', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="checkout">Выезд</Label>
          <Input id="checkout" type="date" value={form.check_out_date} onChange={e => set('check_out_date', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Отправка...' : 'Подтвердить'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
