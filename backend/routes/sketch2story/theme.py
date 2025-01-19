from werkzeug.datastructures import FileStorage
from pydantic import BaseModel
from typing import List
from prompts import IMG2STORY_THEME

from lib.worqhat import worqHat

class Themes(BaseModel):
    themes: List[str]

def generate_themes(imageReader: FileStorage):
    return worqHat.multimodal(
        system=IMG2STORY_THEME,
        image=imageReader,
        randomness=0.5,
        output_structure=Themes,
        prompt="generate themes",
    )
