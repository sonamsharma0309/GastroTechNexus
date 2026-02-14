import sqlite3
from flask import current_app, g


def get_db():
    if "db" not in g:
        db_path = current_app.config["DB_PATH"]
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()

    # Users table (frontend users / app users)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # Simple cache table (optional, for API responses)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS api_cache (
            key TEXT PRIMARY KEY,
            response_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    db.commit()
