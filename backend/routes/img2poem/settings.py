from pydantic import BaseModel

from lib.utils import retrieve_image
from lib.worqhat import worqHat
from prompts import IM2POEM_SETTING


class SettingsRequest(BaseModel):
    image_uid : str
    themes : list[str]

class SettingsResponse(BaseModel):
    settings: list[str]


def generate_settings(body : SettingsRequest):
    img = retrieve_image(body.image_uid)
    return worqHat.multimodal(
        system=IM2POEM_SETTING,
        prompt=f"Themes: {','.join(body.themes)}",
        image=img,
        randomness=0.5,
        output_structure=SettingsResponse
    )

