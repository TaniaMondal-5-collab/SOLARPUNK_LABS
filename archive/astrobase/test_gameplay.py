# Automated End-to-End Test for ASTROBASE
import subprocess
import time
import json
import urllib.request
import sys
import os

PORT = 9222
HTML_PATH = os.path.abspath("index.html").replace("\\", "/")
CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Launching Edge/Chrome headless with remote debugging...")
proc = subprocess.Popen([
    CHROME_PATH,
    "--headless=new",
    f"--remote-debugging-port={PORT}",
    "--disable-gpu",
    "--no-sandbox",
    f"file:///{HTML_PATH}"
])

try:
    # Wait for DevTools port to open
    time.sleep(2.5)
    
    # Query DevTools list
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")
    tabs = json.loads(res.read().decode())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    print("Connected to headless browser session.")

    # We can use simple websocket or execute via CDP if websocket client is installed,
    # or test DOM snapshots.
except Exception as e:
    print("DevTools connect error:", e)
finally:
    proc.terminate()

