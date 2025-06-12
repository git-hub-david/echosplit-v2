from flask import Flask, render_template, request, jsonify, send_file
import os, uuid, time, threading
from dotenv import load_dotenv
import requests, base64

load_dotenv()
RP_ENDPOINT = os.getenv("RUNPOD_ENDPOINT_ID")
RP_KEY      = os.getenv("RUNPOD_API_KEY")

app = Flask(__name__, static_folder='static', template_folder='templates')
TMP_DIR = '/tmp/jobs'
os.makedirs(TMP_DIR, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

# Placeholder endpoints for upload/status/results. Replace with real logic.
@app.route('/upload', methods=['POST'])
def upload():
    # Save file & trigger RunPod job (stub)
    f = request.files.get('track')
    if not f:
        return jsonify({'error': 'No file'}), 400
    job_id = str(uuid.uuid4())
    # For demo, return job_id only
    return jsonify({'jobId': job_id})

@app.route('/status/<job_id>')
def status(job_id):
    # Polling stub: always complete with dummy URL
    return jsonify({'status': 'complete', 'outputUrl': '/static/dummy_stems.zip'})

@app.route('/results/<job_id>')
def results(job_id):
    # Serve dummy file
    return send_file('static/dummy_stems.zip', as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)