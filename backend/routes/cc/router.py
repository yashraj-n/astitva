from flask import Blueprint, jsonify, request
from flask_pydantic import validate

from lib.middleware import require_file
from lib.utils import save_image
from routes.cc.captions import CaptionsRequest, generate_captions
from routes.cc.theme import generate_themes
from routes.sketch2story.chapters import GenerateChaptersRequest

bp = Blueprint("cc", __name__)

@bp.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Captions API is running!"})

@bp.route("/generateThemes", methods=["POST"])
@require_file
def gen_themes():
    file = request.files["file"]
    uid = save_image(file)
    res = generate_themes(file)

    return jsonify({"uid": uid, "themes": res.dict()})


@bp.route("/generateCaptions", methods=["POST"])
@validate()
def gen_captions(
    body: CaptionsRequest
):
    res = generate_captions(body)
    return jsonify({"data": res.dict()})