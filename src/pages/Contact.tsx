import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Заполните имя и сообщение'); return; }
    setLoading(true);
    try {
      await api.sendContact(form);
      setSent(true);
      toast.success('Сообщение отправлено!');
    } catch {
      toast.error('Ошибка отправки. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Контакты</h1>
          <p className="text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="space-y-6 mb-10">
              {[
                { icon: 'Phone', label: 'Телефон', value: '+7 (800) 000-00-00' },
                { icon: 'Mail', label: 'Email', value: 'info@tourism.ru' },
                { icon: 'MapPin', label: 'Адрес', value: 'Москва, ул. Тверская, 1' },
                { icon: 'Clock', label: 'Режим работы', value: 'Пн–Пт: 9:00–20:00, Сб: 10:00–18:00' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={24} className="text-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Сообщение отправлено</h3>
                  <p className="text-muted-foreground text-sm mb-6">Мы ответим в течение одного рабочего дня.</p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
                    Отправить ещё
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h2 className="font-medium text-lg mb-2">Форма обратной связи</h2>
                  <div>
                    <Label htmlFor="c-name">Имя *</Label>
                    <Input id="c-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше имя" />
                  </div>
                  <div>
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="c-phone">Телефон</Label>
                    <Input id="c-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+7 999 000 00 00" />
                  </div>
                  <div>
                    <Label htmlFor="c-msg">Сообщение *</Label>
                    <Textarea id="c-msg" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Ваш вопрос или пожелание..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
