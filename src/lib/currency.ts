import type { Currency } from './api';

export function convertPrice(priceRub: number, currency: Currency): number {
  if (currency.currency_code === 'RUB') return priceRub;
  return priceRub / currency.rate;
}

export function formatPrice(amount: number, currencyCode: string): string {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    CNY: '¥',
  };
  const symbol = symbols[currencyCode] || currencyCode;
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('ru-RU')} ${symbol}`;
}
