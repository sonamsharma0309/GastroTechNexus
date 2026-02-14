from flask import current_app
from ..utils.http import get_json


def fetch_properties_by_num_rings(min_val=0, max_val=5, page=0, size=20):
    base = current_app.config["FLAVORDB_BASE_URL"]
    token = current_app.config["FLAVORDB_TOKEN"]

    url = f"{base}/more_properties/by-numRings-range"
    headers = {"Authorization": f"Bearer {token}"}

    params = {
        "min": int(min_val),
        "max": int(max_val),
        "page": int(page),
        "size": int(size),
    }

    return get_json(url, headers=headers, params=params)
