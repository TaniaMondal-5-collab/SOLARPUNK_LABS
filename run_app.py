#!/usr/bin/env python3
"""
MEDBRIDGE - Startup Server & Browser Launcher
Generative AI Clash Hackathon 2026 @ Techno India University
RED ZONE_DevOps & Quantum_Neurons

Run:
    python run_app.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

DEFAULT_PORT = 8000

def find_available_port(start_port=8000, max_attempts=20):
    import socket
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                return port
    return start_port

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_available_port(DEFAULT_PORT)

    handler = http.server.SimpleHTTPRequestHandler
    # Add proper MIME types
    handler.extensions_map.update({
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.html': 'text/html'
    })

    print("=" * 65)
    print("   MEDBRIDGE - Real-time Medicine Availability Platform")
    print("   Generative AI Clash Hackathon @ Techno India University")
    print("   Developed by RED ZONE_DevOps & Quantum_Neurons")
    print("=" * 65)
    print(f"[*] Local Web Server running at: http://localhost:{port}/index.html")
    print("[*] Sourced Kolkata Pharmacy Network: Salt Lake, New Town, Gariahat")
    print("[*] Press Ctrl+C to stop the server.\n")

    url = f"http://localhost:{port}/index.html"
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[!] Could not launch browser automatically: {e}")
        print(f"[*] Please open your browser and navigate to: {url}")

    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()

