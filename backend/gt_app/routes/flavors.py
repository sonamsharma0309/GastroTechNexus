from flask import Blueprint, jsonify, request
from ..services.flavor_db_service import fetch_properties_by_num_rings

bp = Blueprint("flavors", __name__, url_prefix="/api/flavors")

@bp.get("/properties-by-num-rings")
def properties_by_num_rings():
    min_val = request.args.get("min", 0)
    max_val = request.args.get("max", 5)
    page = request.args.get("page", 0)
    size = request.args.get("size", 20)

    data = fetch_properties_by_num_rings(min_val, max_val, page, size)
    return jsonify(data)
