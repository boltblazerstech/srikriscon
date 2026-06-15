import os
import pymysql
import psycopg2
import psycopg2.extras

MYSQL_CONFIG = {
    'host': os.environ['MYSQL_HOST'],
    'port': int(os.environ.get('MYSQL_PORT', 3306)),
    'user': os.environ['MYSQL_USER'],
    'password': os.environ['MYSQL_PASSWORD'],
    'database': os.environ['MYSQL_DATABASE'],
    'cursorclass': pymysql.cursors.DictCursor
}

PG_CONFIG = {
    'host': os.environ['DB_HOST'],
    'port': int(os.environ.get('DB_PORT', 5432)),
    'user': os.environ['DB_USERNAME'],
    'password': os.environ['DB_PASSWORD'],
    'dbname': os.environ['DB_NAME']
}

TABLES = [
    'users',
    'admin_users',
    'refresh_tokens',
    'password_reset_tokens',
    'categories',
    'products',
    'product_variants',
    'product_images',
    'addresses',
    'orders',
    'order_items',
    'payments',
    'shipments',
    'gallery_images',
    'cms_pages',
    'banners',
    'testimonials',
    'settings'
]

def get_boolean_columns(pg_cursor, table_name):
    query = """
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = %s AND data_type = 'boolean'
    """
    pg_cursor.execute(query, (table_name,))
    return set(row[0] for row in pg_cursor.fetchall())

def migrate():
    print("Connecting to PostgreSQL...")
    pg_conn = psycopg2.connect(**PG_CONFIG)
    pg_conn.autocommit = False
    pg_cursor = pg_conn.cursor()

    print("Connecting to MySQL...")
    my_conn = pymysql.connect(**MYSQL_CONFIG)
    my_cursor = my_conn.cursor()

    try:
        # Disable foreign key checks in PG for the session
        pg_cursor.execute("SET session_replication_role = 'replica';")
        
        print("Truncating tables in PostgreSQL...")
        for table in TABLES:
            pg_cursor.execute(f"TRUNCATE TABLE {table} CASCADE;")
        
        for table in TABLES:
            print(f"Migrating {table}...")
            
            # Identify boolean columns in Postgres
            bool_cols = get_boolean_columns(pg_cursor, table)
            
            my_cursor.execute(f"SELECT * FROM {table}")
            rows = my_cursor.fetchall()
            
            if not rows:
                print(f"  No data in {table}")
                continue
                
            columns = list(rows[0].keys())
            col_names = ', '.join(columns)
            placeholders = ', '.join(['%s'] * len(columns))
            
            insert_query = f"INSERT INTO {table} ({col_names}) VALUES ({placeholders})"
            
            data_to_insert = []
            for row in rows:
                row_data = []
                for col in columns:
                    val = row[col]
                    if col in bool_cols and val is not None:
                        val = bool(val)
                    row_data.append(val)
                data_to_insert.append(tuple(row_data))
                
            psycopg2.extras.execute_batch(pg_cursor, insert_query, data_to_insert)
            
            # Reset sequences if 'id' exists
            if 'id' in columns:
                try:
                    pg_cursor.execute(f"SELECT setval('{table}_id_seq', COALESCE((SELECT MAX(id)+1 FROM {table}), 1), false);")
                except Exception as e:
                    print(f"  Warning setting sequence for {table}: {e}")
                    pg_conn.rollback()
                    # Re-disable triggers if rollback occurred
                    pg_cursor.execute("SET session_replication_role = 'replica';")
            
            print(f"  Migrated {len(data_to_insert)} rows to {table}")

        pg_cursor.execute("SET session_replication_role = 'origin';")
        pg_conn.commit()
        print("Migration complete!")
        
    except Exception as e:
        pg_conn.rollback()
        print(f"Error: {e}")
    finally:
        pg_cursor.close()
        pg_conn.close()
        my_cursor.close()
        my_conn.close()

if __name__ == '__main__':
    migrate()
