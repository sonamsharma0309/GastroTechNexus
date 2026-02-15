import requests

def get_json(url, headers=None, timeout=20):
    headers = headers or {}
    last_err = None

    for _ in range(2):
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
            r.raise_for_status()
            return r.json()
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            last_err = e
            continue
        except requests.exceptions.RequestException as e:
            raise RuntimeError(str(e))

    raise RuntimeError(f"Upstream timeout/connection failed: {last_err}")
