import json

from flask import Blueprint, jsonify, request
from flask_pydantic import validate

from lib.middleware import require_file
from lib.utils import save_image
from routes.img2poem.poem import PoemRequest, generate_poem
from routes.img2poem.settings import SettingsRequest, generate_settings
from routes.img2poem.theme import generate_themes
from lib.db import db, Poem

bp = Blueprint("img2poem", __name__)


@bp.route("/", methods=["GET"])
def index():
    return jsonify({"message": "img2poem API is running!"})


@bp.route("/generateThemes", methods=["POST"])
@require_file
def gen_theme():
    file = request.files["file"]
    uid = save_image(file)
    res = generate_themes(file)
    return jsonify({"data": res.dict(), "file": uid})


@bp.route("/generateSettings", methods=["POST"])
@validate()
def gen_settings(body: SettingsRequest):
    res = generate_settings(body)
    return jsonify({"data": res.dict()})


@bp.route("/generatePoem", methods=["POST"])
@validate()
def gen_poem(body: PoemRequest):
    res = generate_poem(body)
    poem = Poem(
        content=json.dumps(res.dict()),
        user_id=body.user_id
    )
    db.session.add(poem)
    db.session.commit()
    return jsonify({"data": res.dict()})
