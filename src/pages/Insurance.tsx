import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import { api, type Insurance } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

const plans = [
  {
    icon: 'Shield',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: null,
  },
  {
    icon: 'ShieldCheck',
    color: 'from-primary to-blue-800',
    bg: 'bg-primary',
    iconColor: 'text-white',
    badge: 'Популярный выбор',
  },
  {
    icon: 'ShieldStar',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badge: null,
  },
];

const covers = ['Медицинские расходы', 'Эвакуация при несчастном случае', 'Отмена поездки', 'Потеря багажа', 'Задержка рейса', 'Юридическая помощь'];

export default function InsurancePage() {
  const { data: insurances = [], isLoading } = useQuery<Insurance[]>({
    queryKey: ['insurances'],
    queryFn: api.getInsurances,
  });
  const { selectedCode, setSelectedCode, format } = useCurrency();

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-700 to-slate-900 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-16">
          <Icon name="ShieldCheck" size={220} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Страховка</h1>
          <p className="text-blue-200 text-lg">Защитите своё путешествие на все случаи жизни</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-8">
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {insurances.map((ins, idx) => {
              const plan = plans[idx % plans.length];
              const isPopular = idx === 1;
              return (
                <Card
                  key={ins.insurance_id}
                  className={`border-0 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isPopular ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`}
                >
                  {isPopular && (
                    <div className="bg-primary text-white text-center text-xs font-bold py-2 uppercase tracking-widest">
                      ⭐ Популярный выбор
                    </div>
                  )}
                  <div className={`bg-gradient-to-br ${plan.color} p-6 text-white text-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icon name={plan.icon} size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl">{ins.type}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-3xl font-black text-foreground mb-4 text-center">{format(ins.price)}</div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-center">{ins.conditions}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-3 py-2 mb-6">
                      <Icon name="Calendar" size={13} className="text-primary" />
                      <span>Действует {ins.validity_period} дней</span>
                    </div>
                    <Button className={`w-full ${isPopular ? '' : 'variant-outline'}`} variant={isPopular ? 'default' : 'outline'}>
                      Выбрать тариф
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Icon name="HelpCircle" size={20} className="text-primary" />
              Что покрывает страховка?
            </h3>
            <div className="space-y-2">
              {covers.map(item => (
                <div key={item} className="flex items-center gap-2.5 text-sm py-1.5 border-b border-border last:border-0">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="Check" size={11} className="text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-sm p-6 text-white">
            <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Нужна консультация?
            </h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Наши специалисты помогут выбрать подходящую страховку для вашего путешествия и ответят на все вопросы.
            </p>
            <div className="space-y-2 text-sm text-blue-100 mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={14} />
                +7 (800) 000-00-00
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} />
                Пн–Пт: 9:00–19:00
              </div>
            </div>
            <Link to="/contact">
              <Button variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/15 w-full">
                <Icon name="MessageCircle" size={16} />
                Написать нам
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
