import subprocess
import time
import http.server
import socketserver
import threading
import os

PORT = 8767

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

t = threading.Thread(target=run_server, daemon=True)
t.start()
time.sleep(1)

chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--dump-dom",
    "--enable-logging=stderr",
    "--v=1",
    f"http://localhost:{PORT}/index.html"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True, timeout=15, encoding="utf-8")
print("Chrome stderr:", res.stderr)

with open("dom_output.html", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find('id="root"')
if idx != -1:
    print("\n--- Root element snippet ---")
    print(text[idx:idx+1200])
else:
    print("id='root' not found")
