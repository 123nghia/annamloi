from __future__ import annotations

import json
import os
import sys
import threading
import time
import uuid
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
CONSULT_FILE = DATA_DIR / "consult-requests.json"
WRITE_LOCK = threading.Lock()


def ensure_storage() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not CONSULT_FILE.exists():
        CONSULT_FILE.write_text("[]\n", encoding="utf-8")


def read_consults() -> list[dict]:
    ensure_storage()
    try:
        data = json.loads(CONSULT_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    return data if isinstance(data, list) else []


def write_consults(entries: list[dict]) -> None:
    ensure_storage()
    temp_file = CONSULT_FILE.with_suffix(".tmp")
    temp_file.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temp_file.replace(CONSULT_FILE)


def validate_payload(payload: object) -> dict[str, str]:
    if not isinstance(payload, dict):
        raise ValueError("Dữ liệu gửi lên không hợp lệ.")

    name = str(payload.get("name") or "").strip()
    phone = str(payload.get("phone") or "").strip()
    role = str(payload.get("role") or "").strip()
    need = str(payload.get("need") or "").strip()

    if not name:
        raise ValueError("Thiếu họ tên.")
    if not phone:
        raise ValueError("Thiếu số điện thoại/Zalo.")

    return {
        "name": name[:120],
        "phone": phone[:40],
        "role": role[:120],
        "need": need[:2000],
    }


def build_entry(payload: dict[str, str], client_ip: str) -> dict[str, str]:
    created_at = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    return {
        "id": f"consult_{int(time.time() * 1000)}_{uuid.uuid4().hex[:6]}",
        "createdAt": created_at,
        "name": payload["name"],
        "phone": payload["phone"],
        "role": payload["role"],
        "need": payload["need"],
        "source": "landing-page",
        "clientIp": client_ip,
    }


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def log_message(self, format: str, *args) -> None:
        sys.stdout.write("%s - - [%s] %s\n" % (
            self.address_string(),
            self.log_date_time_string(),
            format % args,
        ))

    def send_json(self, status: HTTPStatus, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status.value)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/consult":
            self.send_json(HTTPStatus.METHOD_NOT_ALLOWED, {
                "ok": False,
                "error": "Endpoint này chỉ nhận POST."
            })
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/consult":
            self.send_json(HTTPStatus.NOT_FOUND, {
                "ok": False,
                "error": "Không tìm thấy endpoint."
            })
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            self.send_json(HTTPStatus.BAD_REQUEST, {
                "ok": False,
                "error": "Thiếu dữ liệu gửi lên."
            })
            return

        if content_length > 64 * 1024:
            self.send_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {
                "ok": False,
                "error": "Dữ liệu gửi lên quá lớn."
            })
            return

        try:
            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8"))
            clean_payload = validate_payload(payload)
        except json.JSONDecodeError:
            self.send_json(HTTPStatus.BAD_REQUEST, {
                "ok": False,
                "error": "Body phải là JSON hợp lệ."
            })
            return
        except ValueError as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {
                "ok": False,
                "error": str(exc)
            })
            return

        client_ip = self.client_address[0]
        entry = build_entry(clean_payload, client_ip)

        with WRITE_LOCK:
            entries = read_consults()
            entries.append(entry)
            write_consults(entries)

        self.send_json(HTTPStatus.CREATED, {
            "ok": True,
            "message": "Đã lưu yêu cầu tư vấn.",
            "id": entry["id"],
        })


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), AppHandler)
    print(f"Server running at http://127.0.0.1:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
