import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import CurrencySelector from '@/components/CurrencySelector';
import { api, type Insurance } from '@/lib/api';
import { useCurrency } from '@/hooks/useCurrency';

const icons = ['Shield', 'ShieldCheck', 'ShieldStar'];

export default function InsurancePage() {
  const { data: insurances = [], isLoading } = useQuery<Insurance[]>({
    queryKey: ['insurances'],
    queryFn: api.getInsurances,
  });
  const { selectedCode, setSelectedCode, format } = useCurrency();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Страховка</h1>
          <p className="text-muted-foreground">Защитите своё путешествие</p>
        </div>

        <div className="flex justify-end mb-8">
          <CurrencySelector value={selectedCode} onChange={setSelectedCode} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {insurances.map((ins, idx) => (
              <Card key={ins.insurance_id} className={idx === 1 ? 'border-primary shadow-md' : ''}>
                <CardContent className="p-6">
                  {idx === 1 && (
                    <p className="text-xs text-primary font-medium uppercase tracking-wider mb-3">Популярный выбор</p>
                  )}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Icon name={icons[idx] || 'Shield'} size={22} />
                  </div>
                  <h3 className="font-medium text-lg mb-1">{ins.type}</h3>
                  <div className="text-2xl font-light mb-4">{format(ins.price)}</div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ins.conditions}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Icon name="Calendar" size={14} />
                    <span>Срок: {ins.validity_period} дней</span>
                  </div>
                  <Button className="w-full" variant={idx === 1 ? 'default' : 'outline'}>
                    Выбрать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Icon name="HelpCircle" size={18} />
              Что покрывает страховка?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {['Медицинские расходы', 'Эвакуация при несчастном случае', 'Отмена поездки', 'Потеря багажа'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Icon name="Phone" size={18} />
              Нужна консультация?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Наши специалисты помогут выбрать подходящую страховку для вашего путешествия.
            </p>
            <Button variant="outline" className="gap-2">
              <Icon name="MessageCircle" size={16} />
              Связаться с нами
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
