from flask import Flask, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Set upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'error': 'No file part in the request'}, 400

    file = request.files['file']
    print("test")
    
    if file.filename == '':
        return {'error': 'No file selected'}, 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return {'message': 'File uploaded successfully', 'path': filepath}, 200

    return {'error': 'Something went wrong'}, 500

if __name__ == '__main__':
    app.run(debug=True)