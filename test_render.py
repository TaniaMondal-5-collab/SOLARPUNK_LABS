import subprocess
import time
import http.server
import socketserver
import threading

PORT = 8768

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

t = threading.Thread(target=run_server, daemon=True)
t.start()
time.sleep(1)

# Let's run chrome with a node/script or inspect window variables
chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--dump-dom",
    "--run-all-compositor-stages-before-draw",
    f"http://localhost:{PORT}/index.html"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True, timeout=15, encoding="utf-8")
dom = res.stdout

with open("test_output.html", "w", encoding="utf-8") as f:
    f.write(dom)

print("test_output.html written. Length:", len(dom))
if "MEDBRIDGE" in dom:
    print("MEDBRIDGE found in DOM!")
if "Find Your Prescribed Medicines" in dom:
    print("Find Your Prescribed Medicines found in DOM!")

