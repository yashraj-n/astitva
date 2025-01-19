from werkzeug.datastructures import FileStorage

from lib.worqhat import worqHat
from prompts import IM2POEM_THEME
from routes.sketch2story.theme import Themes


def generate_themes(imageReader : FileStorage):
    return worqHat.multimodal(
        system=IM2POEM_THEME,
        image=imageReader,
        randomness=0.5,
        output_structure=Themes,
        prompt="generate themes",
    )