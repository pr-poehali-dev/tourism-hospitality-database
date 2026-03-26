import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import { api, type Review } from '@/lib/api';
import { toast } from 'sonner';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-orange-500',
];

export default function Reviews() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => api.getReviews(),
  });

  const mutation = useMutation({
    mutationFn: (data: object) => api.postReview(data),
    onSuccess: () => {
      toast.success('Спасибо за отзыв!');
      setText('');
      setRating(5);
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => toast.error('Ошибка при отправке отзыва'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { toast.error('Напишите текст отзыва'); return; }
    mutation.mutate({ text, rating });
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <Layout>
      <div className="bg-gradient-to-br from-amber-500 to-orange-700 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-16">
          <Icon name="Star" size={220} className="text-white" />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Отзывы</h1>
            <p className="text-orange-100 text-lg">Мнения наших путешественников</p>
          </div>
          {avgRating && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <p className="text-4xl font-black">{avgRating}</p>
              <div className="flex justify-center my-1">
                <StarRating rating={Math.round(Number(avgRating))} />
              </div>
              <p className="text-xs text-orange-100">{reviews.length} отзывов</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-end mb-8">
          <Button
            onClick={() => setFormOpen(!formOpen)}
            className="gap-2 bg-amber-500 hover:bg-amber-400 text-white border-0 shadow-lg shadow-amber-500/30"
          >
            <Icon name="PenLine" size={16} />
            Написать отзыв
          </Button>
        </div>

        {formOpen && (
          <Card className="mb-8 border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ваш отзыв
              </h2>
            </div>
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <Label className="font-semibold mb-2 block">Оценка</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setRating(n)}
                        className={`text-3xl transition-all hover:scale-125 ${n <= rating ? 'text-amber-400' : 'text-muted'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-text" className="font-semibold">Расскажите о поездке *</Label>
                  <Textarea
                    id="review-text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Расскажите о своём путешествии..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={mutation.isPending} className="bg-amber-500 hover:bg-amber-400 text-white border-0">
                    {mutation.isPending ? 'Отправка...' : 'Опубликовать'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Отмена</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-border p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-32" />
                    <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Icon name="MessageSquare" size={36} className="text-amber-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Пока нет отзывов</h3>
            <p className="text-muted-foreground">Будьте первым!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <Card key={review.review_id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon name="User" size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-muted-foreground">({review.rating}/5)</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(review.review_date)}</span>
                      </div>
                      <p className="text-foreground leading-relaxed text-sm">{review.text}</p>
                      {(review.tour_name || review.hotel_name) && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1">
                          <Icon name="MapPin" size={11} />
                          {review.tour_name || review.hotel_name}
                        </div>
                      )}
                    </div>
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
