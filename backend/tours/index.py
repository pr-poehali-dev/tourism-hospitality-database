"""Туры: получение списка с фильтрацией и деталей тура"""
import json
import os
import psycopg2


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    tour_id = params.get('id')
    search = params.get('search', '')
    season = params.get('season', '')
    min_price = params.get('min_price')
    max_price = params.get('max_price')

    conn = get_connection()
    cur = conn.cursor()

    schema = 't_p38643460_tourism_hospitality_'

    if tour_id:
        cur.execute(f"""
            SELECT tour_id, name, description, price, duration, season, is_available, destination, image_url
            FROM "{schema}".tours
            WHERE tour_id = %s
        """, (tour_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Tour not found'})}
        tour = {
            'tour_id': row[0], 'name': row[1], 'description': row[2],
            'price': float(row[3]) if row[3] else None,
            'duration': row[4], 'season': row[5],
            'is_available': row[6], 'destination': row[7], 'image_url': row[8]
        }
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(tour, ensure_ascii=False)}

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

    where = ' AND '.join(conditions)
    cur.execute(f"""
        SELECT tour_id, name, description, price, duration, season, is_available, destination, image_url
        FROM "{schema}".tours
        WHERE {where}
        ORDER BY tour_id
    """, args)

    rows = cur.fetchall()
    tours = [{
        'tour_id': r[0], 'name': r[1], 'description': r[2],
        'price': float(r[3]) if r[3] else None,
        'duration': r[4], 'season': r[5],
        'is_available': r[6], 'destination': r[7], 'image_url': r[8]
    } for r in rows]

    conn.close()
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(tours, ensure_ascii=False)}
