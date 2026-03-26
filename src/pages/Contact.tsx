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

const contacts = [
  { icon: 'Phone', label: 'Телефон', value: '+7 (800) 000-00-00', color: 'bg-blue-50 text-blue-600' },
  { icon: 'Mail', label: 'Email', value: 'info@rustur.ru', color: 'bg-violet-50 text-violet-600' },
  { icon: 'MapPin', label: 'Адрес', value: 'Москва, ул. Тверская, 1', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'Clock', label: 'Режим работы', value: 'Пн–Пт: 9:00–20:00, Сб: 10:00–18:00', color: 'bg-amber-50 text-amber-600' },
];

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
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-16">
          <Icon name="Phone" size={220} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Контакты</h1>
          <p className="text-slate-300 text-lg">Свяжитесь с нами любым удобным способом</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Наши контакты
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contacts.map(item => (
                <div key={item.label} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon name={item.icon} size={18} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Мессенджеры
              </h3>
              <p className="text-blue-100 text-sm mb-4">Напишите нам — ответим в течение 15 минут</p>
              <div className="flex gap-3">
                {[
                  { icon: 'MessageCircle', label: 'Telegram' },
                  { icon: 'Phone', label: 'WhatsApp' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-4 py-2 cursor-pointer text-sm">
                    <Icon name={m.icon} size={16} />
                    {m.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Форма обратной связи
                </h2>
                <p className="text-blue-100 text-sm">Ответим в течение одного рабочего дня</p>
              </div>
              <CardContent className="p-6">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle2" size={30} className="text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Сообщение отправлено!
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">Мы ответим в течение одного рабочего дня.</p>
                    <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
                      Отправить ещё раз
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="c-name" className="font-semibold text-sm">Имя *</Label>
                        <Input id="c-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше имя" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="c-phone" className="font-semibold text-sm">Телефон</Label>
                        <Input id="c-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+7 999 000 00 00" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="c-email" className="font-semibold text-sm">Email</Label>
                      <Input id="c-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="c-msg" className="font-semibold text-sm">Сообщение *</Label>
                      <Textarea id="c-msg" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Ваш вопрос или пожелание..." rows={4} className="mt-1" />
                    </div>
                    <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                      {loading ? 'Отправка...' : 'Отправить сообщение'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
