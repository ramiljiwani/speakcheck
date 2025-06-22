from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from check import analyze
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google-credentials.json"
app = Flask(__name__)
CORS(app)

# Set upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'error': 'No file part in the request'}, 400

    file = request.files['file']
    
    if file.filename == '':
        return {'error': 'No file selected'}, 400

    if file:
        filename = "upload"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return {'message': 'File uploaded successfully', 'path': filepath}, 200

    return {'error': 'Something went wrong'}, 500

@app.route('/check', methods=['POST'])
def processCheck():
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'upload')
    return analyze(filepath)
    

if __name__ == '__main__':
    app.run(debug=True)