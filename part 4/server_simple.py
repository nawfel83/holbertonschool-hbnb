# Serveur HTTP
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

class HBnBHandler(SimpleHTTPRequestHandler):
    
    def do_GET(self):
        # Servir les fichiers statiques normalement
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        
        return super().do_GET()
    
    def end_headers(self):
        # Ajouter les headers CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == '__main__':
    port = 8000
    server = HTTPServer(('localhost', port), HBnBHandler)
    
    print(f"🚀 Serveur HBnB simple sur http://localhost:{port}")
    print("📱 Comptes test :")
    print("   demo@hbnb.com / demo123")
    print("   test@hbnb.com / test123")
    print("   user@hbnb.com / user123")
    print("=" * 40)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Serveur arrêté")
        server.server_close()
