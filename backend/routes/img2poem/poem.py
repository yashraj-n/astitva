from pydantic import BaseModel

from lib.utils import retrieve_image
from lib.worqhat import worqHat

from prompts import IM2POEM_GENERATOR


class PoemRequest(BaseModel):
    image_uid: str
    themes: list[str]
    settings: list[str]
    user_id: str

class PoemResponse(BaseModel):
    poem: str


def generate_poem(body: PoemRequest):
    file = retrieve_image(body.image_uid)
    return worqHat.multimodal(
        output_structure=PoemResponse,
        randomness=0.6,
        prompt=f"Themes: {','.join(body.themes)}\nSettings: {','.join(body.settings)}. Make sure you give the poem in string format in JSON, eg - {{'poem': 'The poem'}}",
        system=IM2POEM_GENERATOR,
        image=file,
    )