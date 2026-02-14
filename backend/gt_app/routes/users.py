from flask import Blueprint, jsonify, request
from ..utils.db import get_db

bp = Blueprint("users", __name__, url_prefix="/api/users")


@bp.get("")
def list_users():
    db = get_db()
    rows = db.execute("SELECT id, name, email, created_at FROM users ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@bp.post("")
def create_user():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip() or None

    if not name:
        return jsonify({"error": "name is required"}), 400

    db = get_db()
    try:
        db.execute("INSERT INTO users(name, email) VALUES(?, ?)", (name, email))
        db.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "user saved ✅", "name": name, "email": email}), 201
