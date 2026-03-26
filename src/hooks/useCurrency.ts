import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type Currency } from '@/lib/api';
import { convertPrice, formatPrice } from '@/lib/currency';

export function useCurrency() {
  const [selectedCode, setSelectedCode] = useState('RUB');

  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: api.getCurrencies,
    staleTime: 1000 * 60 * 60,
  });

  const selectedCurrency = currencies.find(c => c.currency_code === selectedCode)
    || { currency_code: 'RUB', name: 'Рубль', rate: 1, update_date: '' };

  const format = (priceRub: number) => {
    const converted = convertPrice(priceRub, selectedCurrency);
    return formatPrice(converted, selectedCode);
  };

  return { selectedCode, setSelectedCode, currencies, format };
}
