import os
from pathlib import Path
from flask import Flask, jsonify
from dotenv import load_dotenv

from .utils.db import init_db, close_db


def create_app():
    # Load .env from backend/
    backend_root = Path(__file__).resolve().parents[1]  # .../backend
    load_dotenv(backend_root / ".env")

    app = Flask(__name__)

    # DB path: backend/data/app.db
    data_dir = backend_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    app.config["DB_PATH"] = str(data_dir / "app.db")

    # Save API config
    app.config["FLAVORDB_BASE_URL"] = os.getenv("FLAVORDB_BASE_URL", "").rstrip("/")
    app.config["FLAVORDB_TOKEN"] = os.getenv("FLAVORDB_TOKEN", "")

    app.config["RECIPEDB_BASE_URL"] = os.getenv("RECIPEDB_BASE_URL", "").rstrip("/")
    app.config["RECIPEDB_TOKEN"] = os.getenv("RECIPEDB_TOKEN", "")

    # DB init + close connection per request
    with app.app_context():
        init_db()

    app.teardown_appcontext(close_db)

    # Routes
    from .routes.health import bp as health_bp
    from .routes.flavors import bp as flavors_bp
    from .routes.recipes import bp as recipes_bp
    from .routes.users import bp as users_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(flavors_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(users_bp)

    @app.get("/")
    def home():
        return jsonify(
            {
                "message": "GastroTechNexus Backend is running ✅",
                "try": [
                    "/health",
                    "/api/users",
                    "/api/recipes/recipe-of-day",
                    "/api/flavors/properties-by-num-rings?min=0&max=5&page=0&size=20",
                ],
            }
        )

    return app
