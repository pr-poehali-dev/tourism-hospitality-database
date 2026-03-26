"""Дополнительные данные: экскурсии, акции, страховки, валюты"""
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


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'excursions')

    conn = get_connection()
    cur = conn.cursor()
    result = []

    if resource == 'excursions':
        search = params.get('search', '')
        conditions = ['is_available = TRUE']
        args = []
        if search:
            conditions.append("(name ILIKE %s OR description ILIKE %s)")
            args += [f'%{search}%', f'%{search}%']
        cur.execute(f"""
            SELECT excursion_id, name, description, price, duration, language, schedule, image_url
            FROM "{SCHEMA}".excursions WHERE {' AND '.join(conditions)} ORDER BY excursion_id
        """, args)
        result = [{'excursion_id': r[0], 'name': r[1], 'description': r[2],
                   'price': float(r[3]) if r[3] else None, 'duration': r[4],
                   'language': r[5], 'schedule': r[6], 'image_url': r[7]}
                  for r in cur.fetchall()]

    elif resource == 'promotions':
        cur.execute(f"""
            SELECT promotion_id, name, description, start_date, end_date, discount
            FROM "{SCHEMA}".promotions WHERE is_active = TRUE AND end_date >= CURRENT_DATE
            ORDER BY discount DESC
        """)
        result = [{'promotion_id': r[0], 'name': r[1], 'description': r[2],
                   'start_date': r[3].isoformat() if r[3] else None,
                   'end_date': r[4].isoformat() if r[4] else None,
                   'discount': float(r[5]) if r[5] else None}
                  for r in cur.fetchall()]

    elif resource == 'insurances':
        cur.execute(f"""
            SELECT insurance_id, type, price, conditions, validity_period
            FROM "{SCHEMA}".insurances WHERE is_available = TRUE ORDER BY price ASC
        """)
        result = [{'insurance_id': r[0], 'type': r[1], 'price': float(r[2]) if r[2] else None,
                   'conditions': r[3], 'validity_period': r[4]}
                  for r in cur.fetchall()]

    elif resource == 'currencies':
        cur.execute(f"""
            SELECT currency_code, name, rate, update_date
            FROM "{SCHEMA}".currencies ORDER BY currency_code
        """)
        result = [{'currency_code': r[0], 'name': r[1],
                   'rate': float(r[2]) if r[2] else None,
                   'update_date': r[3].isoformat() if r[3] else None}
                  for r in cur.fetchall()]

    conn.close()
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(result, ensure_ascii=False)}
