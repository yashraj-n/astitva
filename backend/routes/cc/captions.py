from pydantic import BaseModel

from lib.utils import retrieve_image
from lib.worqhat import worqHat

from prompts import CC_GENERATOR


class CaptionsRequest(BaseModel):
    image_uid: str
    themes: list[str]

class CaptionsResponse(BaseModel):
    captions: list[str]

def generate_captions(body: CaptionsRequest):
    image = retrieve_image(body.image_uid)
    return worqHat.multimodal(
        output_structure=CaptionsResponse,
        randomness=0.2,
        prompt=f"Themes {', '.join(body.themes)}. Give in JSON format of {{captions: ['caption1', 'caption2', ...]}}",
        system=CC_GENERATOR,
        image=image
    )
