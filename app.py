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
    f = request.files.get('track')
    if not f:
        return jsonify({'error': 'No file'}), 400
    job_id = str(uuid.uuid4())
    return jsonify({'jobId': job_id})

@app.route('/status/<job_id>')
def status(job_id):
    return jsonify({'status': 'complete', 'outputUrl': '/static/dummy_stems.zip'})

@app.route('/results/<job_id>')
def results(job_id):
    return send_file('static/dummy_stems.zip', as_attachment=True)