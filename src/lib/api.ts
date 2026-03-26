const URLS = {
  catalog: 'https://functions.poehali.dev/443f51ac-8ee6-4bc6-b255-81b783ea729b',
  extras: 'https://functions.poehali.dev/aa47eafc-8b65-429d-8c44-d4e47934faff',
  bookings: 'https://functions.poehali.dev/7c411aec-8372-416d-bd1a-c51a792ca2c7',
  interactions: 'https://functions.poehali.dev/c686ec94-9a4c-4094-8291-5bf120b0bb10',
};

function buildUrl(base: string, params: Record<string, string>) {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  return url.toString();
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
}

async function post<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export const api = {
  getTours: (params: Record<string, string> = {}) =>
    get<Tour[]>(buildUrl(URLS.catalog, { resource: 'tours', ...params })),

  getTour: (id: number) =>
    get<Tour>(buildUrl(URLS.catalog, { resource: 'tours', id: String(id) })),

  getHotels: (params: Record<string, string> = {}) =>
    get<Hotel[]>(buildUrl(URLS.catalog, { resource: 'hotels', ...params })),

  getHotel: (id: number) =>
    get<Hotel>(buildUrl(URLS.catalog, { resource: 'hotels', id: String(id) })),

  getExcursions: (params: Record<string, string> = {}) =>
    get<Excursion[]>(buildUrl(URLS.extras, { resource: 'excursions', ...params })),

  getPromotions: () =>
    get<Promotion[]>(buildUrl(URLS.extras, { resource: 'promotions' })),

  getInsurances: () =>
    get<Insurance[]>(buildUrl(URLS.extras, { resource: 'insurances' })),

  getCurrencies: () =>
    get<Currency[]>(buildUrl(URLS.extras, { resource: 'currencies' })),

  getReviews: (params: Record<string, string> = {}) =>
    get<Review[]>(buildUrl(URLS.interactions, { resource: 'reviews', ...params })),

  postReview: (data: object) =>
    post(buildUrl(URLS.interactions, { resource: 'reviews' }), data),

  createBooking: (data: object) =>
    post(URLS.bookings, data),

  getBookings: (email: string) =>
    get<Booking[]>(buildUrl(URLS.bookings, { email })),

  sendContact: (data: object) =>
    post(buildUrl(URLS.interactions, { resource: 'contact' }), data),
};

export interface Tour {
  tour_id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  season: string;
  is_available: boolean;
  destination: string;
  image_url?: string;
}

export interface Hotel {
  hotel_id: number;
  name: string;
  category: string;
  address: string;
  rooms_count: number;
  rating: number;
  description: string;
  image_url?: string;
  rooms?: Room[];
}

export interface Room {
  room_id: number;
  category: string;
  price: number;
  is_available: boolean;
  amenities: string;
  capacity: number;
}

export interface Excursion {
  excursion_id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  language: string;
  schedule: string;
  image_url?: string;
}

export interface Promotion {
  promotion_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  discount: number;
}

export interface Insurance {
  insurance_id: number;
  type: string;
  price: number;
  conditions: string;
  validity_period: number;
}

export interface Currency {
  currency_code: string;
  name: string;
  rate: number;
  update_date: string;
}

export interface Review {
  review_id: number;
  text: string;
  rating: number;
  review_date: string;
  tour_name?: string;
  hotel_name?: string;
}

export interface Booking {
  booking_id: number;
  booking_date: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_amount: number;
  currency_code: string;
  tour_name?: string;
  hotel_name?: string;
  room_category?: string;
}
