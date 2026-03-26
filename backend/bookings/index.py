"""Бронирования: создание и просмотр бронирований"""
import json
import os
import psycopg2


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

SCHEMA = 't_p38643460_tourism_hospitality_'


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')

    conn = get_connection()
    cur = conn.cursor()

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        client_name = body.get('client_name', '').strip()
        client_email = body.get('client_email', '').strip()
        client_phone = body.get('client_phone', '').strip()
        tour_id = body.get('tour_id')
        room_id = body.get('room_id')
        check_in = body.get('check_in_date')
        check_out = body.get('check_out_date')
        currency = body.get('currency_code', 'RUB')
        total = body.get('total_amount')

        if not client_name or not client_email:
            conn.close()
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Имя и email обязательны'})}

        cur.execute(f"""
            INSERT INTO "{SCHEMA}".clients (full_name, email, phone)
            VALUES (%s, %s, %s)
            ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone
            RETURNING client_id
        """, (client_name, client_email, client_phone))
        client_id = cur.fetchone()[0]

        cur.execute(f"""
            INSERT INTO "{SCHEMA}".bookings (client_id, tour_id, room_id, check_in_date, check_out_date, total_amount, currency_code, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'confirmed')
            RETURNING booking_id
        """, (client_id, tour_id, room_id, check_in, check_out, total, currency))
        booking_id = cur.fetchone()[0]

        if room_id:
            cur.execute(f"""
                UPDATE "{SCHEMA}".rooms SET is_available = FALSE WHERE room_id = %s
            """, (room_id,))

        conn.commit()
        conn.close()
        return {'statusCode': 201, 'headers': CORS_HEADERS, 'body': json.dumps({'booking_id': booking_id, 'status': 'confirmed'})}

    params = event.get('queryStringParameters') or {}
    email = params.get('email')

    if email:
        cur.execute(f"""
            SELECT b.booking_id, b.booking_date, b.check_in_date, b.check_out_date,
                   b.status, b.total_amount, b.currency_code,
                   t.name as tour_name, h.name as hotel_name, r.category as room_category
            FROM "{SCHEMA}".bookings b
            JOIN "{SCHEMA}".clients c ON b.client_id = c.client_id
            LEFT JOIN "{SCHEMA}".tours t ON b.tour_id = t.tour_id
            LEFT JOIN "{SCHEMA}".rooms r ON b.room_id = r.room_id
            LEFT JOIN "{SCHEMA}".hotels h ON r.hotel_id = h.hotel_id
            WHERE c.email = %s
            ORDER BY b.booking_date DESC
        """, (email,))
        bookings = [{
            'booking_id': r[0],
            'booking_date': r[1].isoformat() if r[1] else None,
            'check_in_date': r[2].isoformat() if r[2] else None,
            'check_out_date': r[3].isoformat() if r[3] else None,
            'status': r[4],
            'total_amount': float(r[5]) if r[5] else None,
            'currency_code': r[6],
            'tour_name': r[7], 'hotel_name': r[8], 'room_category': r[9]
        } for r in cur.fetchall()]
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(bookings, ensure_ascii=False)}

    conn.close()
    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'email required'})}
