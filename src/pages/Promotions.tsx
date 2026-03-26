import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import { api, type Promotion } from '@/lib/api';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const promoColors = [
  { bg: 'from-orange-500 to-red-600', accent: 'text-orange-200' },
  { bg: 'from-blue-500 to-blue-700', accent: 'text-blue-200' },
  { bg: 'from-violet-500 to-purple-700', accent: 'text-violet-200' },
];

export default function Promotions() {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: api.getPromotions,
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-orange-500 to-red-700 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-12">
          <Icon name="Tag" size={220} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-4">
            <Icon name="Flame" size={15} className="text-amber-300" />
            Горящие предложения
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Акции и скидки</h1>
          <p className="text-orange-100 text-lg">Успейте забронировать по выгодной цене</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-52 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="Tag" size={36} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Акций пока нет</h3>
            <p className="text-muted-foreground">Следите за новыми предложениями</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {promotions.map((promo, i) => {
              const colors = promoColors[i % promoColors.length];
              return (
                <Card key={promo.promotion_id} className="card-hover border-0 shadow-md rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-br ${colors.bg} p-6 relative overflow-hidden`}>
                    <div className="absolute -top-4 -right-4 w-28 h-28 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full" />
                    <div className="relative z-10">
                      <div className="text-6xl font-black text-white drop-shadow mb-1">−{promo.discount}%</div>
                      <p className={`text-sm ${colors.accent}`}>скидка на тур</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2">{promo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                      <Icon name="Calendar" size={13} className="text-primary" />
                      <span>Действует до {formatDate(promo.end_date)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Icon name="Info" size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold mb-1 text-amber-900">Как воспользоваться скидкой?</p>
              <p className="text-sm text-amber-800">
                Скидки применяются автоматически при бронировании тура или номера.
                Для VIP-скидок необходимо наличие статуса VIP-клиента.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
