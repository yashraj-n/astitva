from functools import wraps
from flask import request, jsonify

def require_file(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Only check POST requests
        if request.method == 'POST':
            # Check if any files were uploaded
            if 'file' not in request.files:
                return jsonify({
                    'error': 'No file part in the request',
                    'status': 'error'
                }), 400

            file = request.files['file']
            # Check if a file was selected
            if file.filename == '':
                return jsonify({
                    'error': 'No file selected',
                    'status': 'error'
                }), 400

        return f(*args, **kwargs)

    return decorated_function