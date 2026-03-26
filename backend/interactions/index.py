"""Взаимодействие: отзывы клиентов и контактные обращения"""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = 't_p38643460_tourism_hospitality_'


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'reviews')

    conn = get_connection()
    cur = conn.cursor()

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')

        if resource == 'contact':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            phone = body.get('phone', '').strip()
            message = body.get('message', '').strip()
            if not name or not message:
                conn.close()
                return {'statusCode': 400, 'headers': CORS_HEADERS,
                        'body': json.dumps({'error': 'Имя и сообщение обязательны'})}
            cur.execute(f"""
                INSERT INTO "{SCHEMA}".settings (parameter, value, description)
                VALUES ('contact_request', %s, 'Обращение с сайта')
            """, (json.dumps({'name': name, 'email': email, 'phone': phone, 'message': message}, ensure_ascii=False),))
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': CORS_HEADERS,
                    'body': json.dumps({'success': True})}

        if resource == 'reviews':
            tour_id = body.get('tour_id')
            hotel_id = body.get('hotel_id')
            text = body.get('text', '').strip()
            rating = body.get('rating')
            if not text or not rating:
                conn.close()
                return {'statusCode': 400, 'headers': CORS_HEADERS,
                        'body': json.dumps({'error': 'Текст и оценка обязательны'})}
            cur.execute(f"""
                INSERT INTO "{SCHEMA}".reviews (tour_id, hotel_id, text, rating, review_date)
                VALUES (%s, %s, %s, %s, CURRENT_DATE) RETURNING review_id
            """, (tour_id, hotel_id, text, int(rating)))
            review_id = cur.fetchone()[0]
            conn.commit()
            conn.close()
            return {'statusCode': 201, 'headers': CORS_HEADERS,
                    'body': json.dumps({'review_id': review_id, 'success': True})}

    if resource == 'reviews':
        tour_id = params.get('tour_id')
        hotel_id = params.get('hotel_id')
        conditions = ['1=1']
        args = []
        if tour_id:
            conditions.append("r.tour_id = %s")
            args.append(tour_id)
        if hotel_id:
            conditions.append("r.hotel_id = %s")
            args.append(hotel_id)
        cur.execute(f"""
            SELECT r.review_id, r.text, r.rating, r.review_date,
                   t.name as tour_name, h.name as hotel_name
            FROM "{SCHEMA}".reviews r
            LEFT JOIN "{SCHEMA}".tours t ON r.tour_id = t.tour_id
            LEFT JOIN "{SCHEMA}".hotels h ON r.hotel_id = h.hotel_id
            WHERE {' AND '.join(conditions)}
            ORDER BY r.review_date DESC LIMIT 50
        """, args)
        result = [{'review_id': r[0], 'text': r[1], 'rating': r[2],
                   'review_date': r[3].isoformat() if r[3] else None,
                   'tour_name': r[4], 'hotel_name': r[5]}
                  for r in cur.fetchall()]
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(result, ensure_ascii=False)}

    conn.close()
    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unknown resource'})}
