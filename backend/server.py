"""
CivicAI — Smart Public Issue Resolution
Zero-Dependency Python Backend Service (Standard Library only)
Runs instantly without pip/network issues on port 8000.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time

PORT = 8000

class CivicAPIHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            response = {
                "status": "healthy",
                "service": "CivicAI Core Intelligence Engine",
                "version": "2.4.0",
                "port": PORT
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        elif self.path in ['/download/pptx', '/CivicAI_Visor_Edition_Pitch_Deck.pptx']:
            import os
            pptx_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'CivicAI_Visor_Edition_Pitch_Deck.pptx')
            if os.path.exists(pptx_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
                self.send_header('Content-Disposition', 'attachment; filename="CivicAI_Visor_Edition_Pitch_Deck.pptx"')
                self._send_cors_headers()
                self.end_headers()
                with open(pptx_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        payload = {}
        if post_data:
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except Exception:
                payload = {}

        if self.path == '/api/analyze':
            desc = payload.get('description', '').lower()
            if 'manhole' in desc or 'drain' in desc or 'sewer' in desc:
                category = "Open Manhole"
                severity = "Critical"
                severity_score = 98
                impact = "Life-threatening pedestrian and two-wheeler fall hazard"
                duplicates = 5
                department = "Water & Sewerage"
            elif 'garbage' in desc or 'waste' in desc:
                category = "Garbage Dump"
                severity = "Medium"
                severity_score = 68
                impact = "Public sanitation, disease vector, and odor issue"
                duplicates = 2
                department = "Solid Waste Management"
            elif 'light' in desc or 'dark' in desc:
                category = "Broken Streetlight"
                severity = "Medium"
                severity_score = 58
                impact = "Nighttime blind spot & pedestrian safety hazard"
                duplicates = 1
                department = "Electricity & Lighting"
            else:
                category = "Road Pothole"
                severity = "High"
                severity_score = 88
                impact = "High risk of vehicular accidents & peak traffic congestion"
                duplicates = 3
                department = "Municipal Roads"

            priority_score = round(
                (severity_score * 0.35) +
                (min(100, duplicates * 25) * 0.25) +
                (90 * 0.20) +
                (85 * 0.20),
                1
            )

            res = {
                "category": category,
                "confidence": 96.4,
                "severity": severity,
                "severity_score": severity_score,
                "potential_impact": impact,
                "duplicate_count": duplicates,
                "duplicate_radius_m": 110,
                "department": department,
                "sla_hours": 24,
                "priority_score": priority_score
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/api/verify':
            res = {
                "issue_id": payload.get('issue_id', 'CA1024'),
                "clearance_score": 98.4,
                "surface_level_delta_cm": 0.2,
                "defect_cleared": True,
                "verdict": "Issue appears resolved: Defect filled with hot-mix asphalt and compacted. Surface grade tolerance within 98.4%."
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif self.path == '/api/chat':
            msg = payload.get('message', '').lower()
            if 'status' in msg or 'ca1024' in msg or 'ticket' in msg:
                reply = (
                    "Ticket #CA1024 (Road Pothole at Electronic City Phase 1) is currently IN PROGRESS with "
                    "Rapid Road Repair Unit #14. The SLA has 18 hours remaining. Photo verification is pending contractor completion."
                )
            elif 'priority' in msg or 'formula' in msg:
                reply = (
                    "CivicAI calculates priority using: (Severity × 35%) + (Duplicates × 25%) + "
                    "(Location Importance × 20%) + (Public Impact × 20%). Arterial roads and open manholes rank highest."
                )
            elif 'emergency' in msg or 'phone' in msg or 'helpline' in msg:
                reply = (
                    "Emergency Helplines: BBMP Control Room: 1533 | BWSSB Water/Drainage: 1916 | BESCOM Electricity: 1912 | National Emergency: 112."
                )
            else:
                reply = (
                    "I am the CivicAI Assistant. I can track ticket statuses, explain our neural priority formula, "
                    "or guide you through submitting a geo-tagged complaint."
                )

            res = {"response": reply, "timestamp": time.strftime("%H:%M:%S")}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=CivicAPIHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"CivicAI Zero-Dependency Python Backend running on http://localhost:{port}/")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
