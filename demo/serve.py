"""Local demo server for Heat Pump Flow Card.

Serves the project folder and, optionally, live values from a Husdata H60/H66
gateway. The gateway's status page is only read (plain GET), never changed.

    python demo/serve.py                      # simulated values only
    python demo/serve.py --h66 192.168.1.50   # also live values at /h66.json

Then open http://localhost:8765/demo/
"""
import argparse
import html
import http.server
import json
import os
import re
import time
import urllib.request

ROW = re.compile(r"<tr[^>]*>(.*?)</tr>", re.S | re.I)
CELL = re.compile(r"<td[^>]*>(.*?)</td>", re.S | re.I)
TAG = re.compile(r"<[^>]+>")
NUM = re.compile(r"^\s*(-?\d+(?:\.\d+)?)\s*([A-Za-z%]*)")


def clean(fragment):
    text = html.unescape(TAG.sub(" ", fragment)).replace("\xa0", " ")
    return re.sub(r"\s+", " ", text).strip()


def read_h66(host, timeout=5):
    """Return {"controller": str, "values": {idx: {"name", "value", "unit", "text"}}}."""
    with urllib.request.urlopen(f"http://{host}/", timeout=timeout) as resp:
        page = resp.read().decode("utf-8", "replace")
    values, controller = {}, None
    for row in ROW.findall(page):
        cells = [clean(c) for c in CELL.findall(row)]
        if len(cells) < 2:
            continue
        if cells[0] == "Controller":
            controller = cells[1]
            continue
        if len(cells) < 3 or not re.fullmatch(r"[0-9A-F]{4}", cells[0]):
            continue
        idx = cells[0]
        name = re.sub(r"\s+\d+W$", "", cells[1]).strip()  # drop the "0W" consumption link
        raw = cells[-1]
        m = NUM.match(raw)
        values[idx] = {
            "name": name,
            "value": float(m.group(1)) if m else None,
            "unit": (m.group(2) if m else "") or "",
            "text": raw,
        }
    return {"controller": controller, "values": values}


class Handler(http.server.SimpleHTTPRequestHandler):
    h66 = None
    cache = {"t": 0, "data": None}

    def end_headers(self):
        # Lets a local Home Assistant page load the card straight from this server while testing.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/h66.json":
            return self.send_h66()
        return super().do_GET()

    def send_h66(self):
        if not self.h66:
            body = {"ok": False, "error": "Start the server with --h66 <ip> to enable live data."}
        else:
            try:
                if time.time() - self.cache["t"] > 4:  # be gentle with the gateway
                    self.cache["data"] = read_h66(self.h66)
                    self.cache["t"] = time.time()
                body = {"ok": True, **self.cache["data"]}
            except Exception as exc:  # noqa: BLE001 – report any network problem to the page
                body = {"ok": False, "error": str(exc)}
        data = json.dumps(body).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        if "/h66.json" not in (str(args[0]) if args else ""):
            super().log_message(fmt, *args)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--bind", default="127.0.0.1")
    ap.add_argument("--h66", default=os.environ.get("H66_HOST"), help="IP or hostname of the H60/H66 gateway")
    args = ap.parse_args()
    Handler.h66 = args.h66
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    handler = lambda *a, **kw: Handler(*a, directory=root, **kw)  # noqa: E731
    print(f"Serving {root} on http://localhost:{args.port}/demo/  (H66: {args.h66 or 'off'})")
    http.server.ThreadingHTTPServer((args.bind, args.port), handler).serve_forever()


if __name__ == "__main__":
    main()
