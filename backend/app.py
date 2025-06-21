from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from check import analyze
import os
import json
from pathlib import Path

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

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'error': 'No file part in the request'}, 400

    file = request.files['file']
    
    if file.filename == '':
        return {'error': 'No file selected'}, 400
    
    filetype = os.path.splitext(file.filename)[1].lower()

    if file:
        filename = "upload" + filetype
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        analyze(filepath)
        return {'message': 'File uploaded successfully', 'path': filepath}, 200

    return {'error': 'Something went wrong'}, 500

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