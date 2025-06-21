from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from check import analyze
import os
import json
from pathlib import Path
import subprocess

app = Flask(__name__)
CORS(app)

# Set upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def read_feedback_text(path: str = "feedback.json") -> str:
    """
    Open the JSON file at `path` and return its raw text content.
    """
    return Path(path).read_text(encoding="utf-8")

def convert_webm_to_mp4(webm_path: str, mp4_path: str = None) -> str:
    if mp4_path is None:
        base, _ = os.path.splitext(webm_path)
        mp4_path = base + '.mp4'

    # -y: overwrite existing, -movflags +faststart for web streaming
    cmd = [
        'ffmpeg', '-y',
        '-f', 'webm',
        '-i', webm_path,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        mp4_path
    ]

    subprocess.run(cmd, check=True)
    return mp4_path

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'error': 'No file part in the request'}, 400

    file = request.files['file']
    if file.filename == '':
        return {'error': 'No file selected'}, 400
    

    # secure the filename and set up paths
    original_name = secure_filename(file.filename)
    ext = Path(original_name).suffix.lower()
    new_name = 'upload' + ext
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], new_name)

    # 1) Save the uploaded data once
    file.save(save_path)

    # 2) If it's webm, convert and point to the new file
    if ext == '.webm':
        try:
            final_path = convert_webm_to_mp4(save_path)
        except subprocess.CalledProcessError as e:
            return {'error': f'Conversion failed: {e.stderr.decode()}'}, 500
    else:
        final_path = save_path

    # 3) Run your analysis on the right file
    analyze(final_path)

    return {
        'message': 'File uploaded successfully',
        'path': final_path
    }, 200

@app.route('/feedback', methods=['GET'])
def fetch_feedback():
    """
    Load feedback.json as a Python dict and return it
    as a proper JSON response.
    """
    try:
        feedback_path = Path("feedback.json")
        data = json.loads(feedback_path.read_text(encoding="utf-8"))
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/video', methods=['GET'])
def serve_video():
    # check for mov first, then mp4
    for ext in ('.mov', '.mp4'):
        filename = f'upload{ext}'
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            # will set the correct Content-Type based on extension
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)
    
    return jsonify({'error': 'No uploaded video found'}), 404

if __name__ == '__main__':
    app.run(debug=True)