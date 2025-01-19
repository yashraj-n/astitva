import os

from uuid import uuid4
from werkzeug.datastructures import FileStorage
from flask import current_app

def save_image(file: FileStorage):
    uploads_dir = current_app.config["UPLOAD_FOLDER"]
    uid = str(uuid4())
    file.save(os.path.join(uploads_dir, uid + ".png"))
    return uid

def retrieve_image(uid: str):
    uploads_dir = current_app.config["UPLOAD_FOLDER"]
    file_path = os.path.join(os.getcwd(), uploads_dir, uid + ".png")
    return open(file_path, "rb")
