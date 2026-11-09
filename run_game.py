# ASTROBASE: Junior Astronaut Mission Trainer
# Local Web Server Launcher (Zero external dependencies)

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    print("=" * 65)
    print(" 🚀 ASTROBASE: JUNIOR ASTRONAUT MISSION TRAINER")
    print(" Think like an engineer. Decide like a commander. Survive like an astronaut.")
    print("=" * 65)
    print(f" Starting local game server on: http://localhost:{PORT}")
    print(" Press Ctrl+C at any time to shut down the server.")
    print("=" * 65)

    try:
        # Allow immediate socket reuse
        socketserver.TCPServer.allow_reuse_address = True
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            # Automatically open user's default browser
            webbrowser.open(f"http://localhost:{PORT}/index.html")
            print(" Browser launched successfully. Enjoy your mission!")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n Astrobase simulation shutdown cleanly. Safe travels, Commander!")
    except Exception as e:
        print(f"\n Note: Server could not bind to port {PORT}: {e}")
        print(f" You can also directly double-click 'index.html' in this folder to play!")

if __name__ == "__main__":
    main()

