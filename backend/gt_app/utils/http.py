# backend/gt_app/utils/http.py

import requests

def get_json(url, headers=None, timeout=20):
    headers = headers or {}
    last_err = None

    # 2 retries
    for _ in range(2):
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
            r.raise_for_status()
            return r.json()
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            last_err = e
            continue
        except requests.exceptions.RequestException as e:
            # non-200 / other request errors
            raise RuntimeError(str(e))

    # after retries still failing
    raise RuntimeError(f"Upstream timeout/connection failed: {last_err}")
