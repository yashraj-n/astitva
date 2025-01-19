from pydantic import BaseModel, TypeAdapter
from typing import List, BinaryIO
from prompts import IMG2STORY_CHAPTER_TITLE_GEN
from typing import Dict, Any, List
from lib.worqhat import worqHat


class GenerateChaptersRequest(BaseModel):
    themes: list[str]
    image_uid: str

class Chapter(BaseModel):
    chapter_number: int
    content: str
    chapter_title: str

class GeneratedChapterResponse(BaseModel):
    chapters: List[Chapter]
    title: str


def generate_chapters(imageReader : BinaryIO, body: GenerateChaptersRequest):
    return worqHat.multimodal(
        system=IMG2STORY_CHAPTER_TITLE_GEN,
        image=imageReader,
        randomness=0.5,
        output_structure=GeneratedChapterResponse,
        prompt=f"Themes are {'' if not body.themes else ', '.join(body.themes)}",
    )