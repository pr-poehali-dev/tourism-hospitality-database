"""Каталог: туры и гостиницы с фильтрацией и поиском"""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = 't_p38643460_tourism_hospitality_'


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_tours(cur, params):
    tour_id = params.get('id')
    search = params.get('search', '')
    season = params.get('season', '')
    min_price = params.get('min_price')
    max_price = params.get('max_price')

    if tour_id:
        cur.execute(f"""
            SELECT tour_id, name, description, price, duration, season, is_available, destination, image_url
            FROM "{SCHEMA}".tours WHERE tour_id = %s
        """, (tour_id,))
        row = cur.fetchone()
        if not row:
            return None
        return {'tour_id': row[0], 'name': row[1], 'description': row[2],
                'price': float(row[3]) if row[3] else None, 'duration': row[4],
                'season': row[5], 'is_available': row[6], 'destination': row[7], 'image_url': row[8]}

    conditions = ['is_available = TRUE']
    args = []
    if search:
        conditions.append("(name ILIKE %s OR description ILIKE %s OR destination ILIKE %s)")
        args += [f'%{search}%', f'%{search}%', f'%{search}%']
    if season:
        conditions.append("season = %s")
        args.append(season)
    if min_price:
        conditions.append("price >= %s")
        args.append(float(min_price))
    if max_price:
        conditions.append("price <= %s")
        args.append(float(max_price))

    cur.execute(f"""
        SELECT tour_id, name, description, price, duration, season, is_available, destination, image_url
        FROM "{SCHEMA}".tours WHERE {' AND '.join(conditions)} ORDER BY tour_id
    """, args)
    return [{'tour_id': r[0], 'name': r[1], 'description': r[2],
             'price': float(r[3]) if r[3] else None, 'duration': r[4],
             'season': r[5], 'is_available': r[6], 'destination': r[7], 'image_url': r[8]}
            for r in cur.fetchall()]


def get_hotels(cur, params):
    hotel_id = params.get('id')
    search = params.get('search', '')
    category = params.get('category', '')
    min_rating = params.get('min_rating')

    if hotel_id:
        cur.execute(f"""
            SELECT hotel_id, name, category, address, rooms_count, rating, description, image_url
            FROM "{SCHEMA}".hotels WHERE hotel_id = %s
        """, (hotel_id,))
        row = cur.fetchone()
        if not row:
            return None
        hotel = {'hotel_id': row[0], 'name': row[1], 'category': row[2], 'address': row[3],
                 'rooms_count': row[4], 'rating': float(row[5]) if row[5] else None,
                 'description': row[6], 'image_url': row[7]}
        cur.execute(f"""
            SELECT room_id, category, price, is_available, amenities, capacity
            FROM "{SCHEMA}".rooms WHERE hotel_id = %s
        """, (hotel_id,))
        hotel['rooms'] = [{'room_id': r[0], 'category': r[1], 'price': float(r[2]) if r[2] else None,
                           'is_available': r[3], 'amenities': r[4], 'capacity': r[5]}
                          for r in cur.fetchall()]
        return hotel

    conditions = ['1=1']
    args = []
    if search:
        conditions.append("(name ILIKE %s OR address ILIKE %s)")
        args += [f'%{search}%', f'%{search}%']
    if category:
        conditions.append("category = %s")
        args.append(category)
    if min_rating:
        conditions.append("rating >= %s")
        args.append(float(min_rating))

    cur.execute(f"""
        SELECT hotel_id, name, category, address, rooms_count, rating, description, image_url
        FROM "{SCHEMA}".hotels WHERE {' AND '.join(conditions)} ORDER BY rating DESC NULLS LAST
    """, args)
    return [{'hotel_id': r[0], 'name': r[1], 'category': r[2], 'address': r[3],
             'rooms_count': r[4], 'rating': float(r[5]) if r[5] else None,
             'description': r[6], 'image_url': r[7]}
            for r in cur.fetchall()]


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'tours')

    conn = get_connection()
    cur = conn.cursor()

    if resource == 'hotels':
        result = get_hotels(cur, params)
    else:
        result = get_tours(cur, params)

    conn.close()

    if result is None:
        return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(result, ensure_ascii=False)}
