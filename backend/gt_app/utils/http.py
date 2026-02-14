import requests


class APIError(Exception):
    pass


def get_json(url, headers=None, params=None, timeout=20):
    try:
        r = requests.get(url, headers=headers or {}, params=params or {}, timeout=timeout)
        if r.status_code >= 400:
            raise APIError(f"HTTP {r.status_code}: {r.text[:300]}")
        return r.json()
    except requests.RequestException as e:
        raise APIError(str(e))
