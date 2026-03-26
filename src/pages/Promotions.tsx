import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import { api, type Promotion } from '@/lib/api';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Promotions() {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: api.getPromotions,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light mb-2">Акции и скидки</h1>
          <p className="text-muted-foreground">Актуальные специальные предложения</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Tag" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Актуальных акций пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <Card key={promo.promotion_id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                <CardContent className="p-6">
                  <div className="text-4xl font-light text-primary mb-3">−{promo.discount}%</div>
                  <h3 className="font-medium text-lg mb-2">{promo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>до {formatDate(promo.end_date)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <Icon name="Info" size={20} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">Как воспользоваться скидкой?</p>
              <p className="text-sm text-muted-foreground">
                Скидки применяются автоматически при бронировании тура или номера в гостинице.
                Для VIP-скидок необходимо наличие статуса VIP-клиента.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
