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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-light mb-2">Отзывы</h1>
            <p className="text-muted-foreground">Мнения наших гостей</p>
          </div>
          <Button onClick={() => setFormOpen(!formOpen)} className="gap-2">
            <Icon name="PenLine" size={16} />
            Написать отзыв
          </Button>
        </div>

        {formOpen && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label>Оценка</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setRating(n)}
                        className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'text-amber-400' : 'text-muted'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-text">Отзыв *</Label>
                  <Textarea
                    id="review-text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Расскажите о своём путешествии..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Отправка...' : 'Отправить'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Отмена</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="MessageSquare" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Пока нет отзывов. Будьте первым!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.review_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-muted-foreground">{formatDate(review.review_date)}</span>
                  </div>
                  <p className="text-foreground leading-relaxed mb-2">{review.text}</p>
                  {(review.tour_name || review.hotel_name) && (
                    <p className="text-sm text-muted-foreground">
                      {review.tour_name || review.hotel_name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
