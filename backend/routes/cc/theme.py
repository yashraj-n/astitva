from werkzeug.datastructures import FileStorage

from lib.worqhat import worqHat
from routes.sketch2story.theme import Themes
from prompts import  CC_THEME


def generate_themes(imageReader : FileStorage):
    return worqHat.multimodal(
        system=CC_THEME,
        image=imageReader,
        randomness=0.5,
        output_structure=Themes,
        prompt="generate themes",
    )