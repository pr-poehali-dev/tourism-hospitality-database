import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, type Currency } from '@/lib/api';

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: api.getCurrencies,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-24 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map(c => (
          <SelectItem key={c.currency_code} value={c.currency_code}>
            {c.currency_code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
