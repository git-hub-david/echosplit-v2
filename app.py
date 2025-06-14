from flask import Flask, render_template, request, jsonify
import os, uuid
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    f = request.files.get('track')
    if not f:
        return jsonify({'error': 'No file provided'}), 400
    job_id = str(uuid.uuid4())
    return jsonify({'jobId': job_id})

@app.route('/status/<job_id>')
def status(job_id):
    return jsonify({'status': 'complete', 'outputUrl': ''})

@app.route('/results/<job_id>')
def results(job_id):
    return jsonify({'error': 'Not implemented'}), 501

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)