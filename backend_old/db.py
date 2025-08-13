import psycopg2
import psycopg2.extras
import env
import util

class DB:

    conn = None

    @staticmethod
    def init():
        DB.get_connection()

    @staticmethod
    def get_connection():
        if not DB.conn:
            DB.conn = psycopg2.connect(f"dbname='{env.DB}' user='{env.USER}' host='{env.HOST}' password='{env.PASSWORD}'")
        return DB.conn

    @staticmethod
    def get_cursor():
        conn = DB.get_connection()
        return conn.cursor(cursor_factory=psycopg2.extras.DictCursor)    

    @staticmethod
    def commit():
        if DB.conn:
            DB.conn.commit()
    
    @staticmethod
    def rollback():
        if DB.conn:
            DB.conn.rollback()

    @staticmethod
    def close():
        if DB.conn:
            util.logstd("Fechando conexão com o bd...")
            DB.conn.close()
        DB.conn = None
