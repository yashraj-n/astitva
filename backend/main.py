import flask
import logging

from dotenv import load_dotenv

load_dotenv()

from lib.db import db, Story, Poem
from flask import jsonify
from lib.worqhat import worqHat

# Routes
from routes.sketch2story.router import bp as sketch2img_bp
from routes.img2poem.router import bp as img2poem_bp
from routes.cc.router import bp as cc_bp

from flask_cors import CORS

logging.basicConfig(level=logging.DEBUG)
logging.info("Starting the app")

UPLOADS_FOLDER = "uploads"

app = flask.Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOADS_FOLDER
CORS(app)

# Middleware

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(sketch2img_bp, url_prefix="/sketch2story")
app.register_blueprint(img2poem_bp, url_prefix="/img2poem")
app.register_blueprint(cc_bp, url_prefix="/cc")


@app.route("/worqhat")
def index():
    return jsonify(worqHat.check_authentication())


@app.route("/getAll/<user_id>")
def getAll(user_id):
    all_story = db.session.query(Story).filter(Story.user_id == user_id).all()
    all_poem = db.session.query(Poem).filter(Poem.user_id == user_id).all()

    return jsonify({
        "stories": [story.as_dict() for story in all_story],
        "poems": [poem.as_dict() for poem in all_poem]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0")
