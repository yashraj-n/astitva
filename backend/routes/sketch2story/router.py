import json

from flask import Blueprint, jsonify, request
from flask_pydantic import validate

from lib.middleware import require_file
from lib.utils import save_image, retrieve_image
from .chapters import GenerateChaptersRequest, generate_chapters
from .story import GenStoryRequest, generate_story_handler
from .theme import generate_themes
from lib.db import db, Story

bp = Blueprint("sketch2story", __name__)


@bp.route("/", methods=["GET"])
def index():
    return jsonify({"message": "sktech2story API is running!"})


@bp.route("/generateThemes", methods=["POST"])
@require_file
def gen_theme():
    file = request.files["file"]

    if not file.content_type.startswith('image/'):
        return jsonify({
            "error": "Invalid file type. Only images are allowed"
        }), 400
    uid = save_image(file)
    res = generate_themes(file)
    return jsonify({"data": res.dict(), "file": uid})


@bp.route("/generateChapters", methods=["POST"])
@validate()
def gen_chapters(body: GenerateChaptersRequest):
    img_file = retrieve_image(body.image_uid)
    data = generate_chapters(img_file, body)
    return jsonify({"data": data.dict()})


@bp.route("/generateStory", methods=["POST"])
@validate()
def gen_story(body: GenStoryRequest):

    img_file = retrieve_image(body.image_uid)
    data = generate_story_handler(img_file, body)
    story = Story(
        title=body.chapters_res.title,
        image=data.cover_art,
        content=json.dumps([chapter.dict() for chapter in data.chapters]),
        user_id=str(body.user_id)
    )
    db.session.add(story)
    db.session.commit()
    return jsonify({"data": data.dict()})
