from pydantic import BaseModel
from typing import List, BinaryIO, Optional
from prompts import IMG2STORY_GENERATOR, IMG2STORY_COVER_ART_GEN

from lib.worqhat import worqHat, TextResponse
from routes.sketch2story.chapters import GeneratedChapterResponse, Chapter


class GenStoryRequest(BaseModel):
    themes: List[str]
    chapters_res: GeneratedChapterResponse
    backstory: Optional[str]
    tone: str
    image_uid: str
    size: str
    user_id: str


class ChapterResponse(BaseModel):
    title: str
    content: str

class StoryHandlerResponse(BaseModel):
    chapters: List[ChapterResponse]
    cover_art: str


def generate_story_handler(imageReader: BinaryIO, body: GenStoryRequest):
    res: List[ChapterResponse] = []
    chapters = body.chapters_res.chapters
    cover_art_prompt = generate_cover_art_prompt(
        themes=body.themes,
        chapters_metas=chapters,
        title=body.chapters_res.title,
        image=imageReader
    )

    cover_art = worqHat.text_to_image(cover_art_prompt)
    print(cover_art)


    for i, chapter in enumerate(chapters):
        print(f"Generating story for chapter {i}")
        if i == 0:
            prevContext = None
            tone = body.tone
        else:
            prevContext = chapters[i - 1].content
            tone = None

        response = generate_story(
            imageReader=imageReader,
            chapter_meta=chapter,
            prevContext=prevContext,
            total_chaps=len(chapters),
            themes=body.themes,
            size=body.size,
            tone=tone,
            backstory=body.backstory
        )
        res.append(response)

        print(f"Generated story for chapter {i}")

    return StoryHandlerResponse(
        chapters=res,
        cover_art=cover_art
    )


def generate_story(imageReader: BinaryIO, chapter_meta: Chapter, prevContext: str, total_chaps: int, themes: List[str], size: str,
                   tone: str | None = None, backstory: str | None = None):
    return worqHat.multimodal(
        image=imageReader,
        output_structure=ChapterResponse,
        system=IMG2STORY_GENERATOR,
        randomness=0.5,
        prompt=f"""
        Name of current chapter is {chapter_meta.chapter_title}
        Description of current chapter is {chapter_meta.content}
        {"Tone of the story is " + tone if tone else ""}
        {"Backstory is " + backstory if backstory else ""}
        Theme of the story is {', '.join(themes)}
        Data of previous Chapter {prevContext}
        All the chapters are {total_chaps}
        The size of the story is {size}
        Reply in json format and please make sure you give the response in string format in JSON, eg - {{'title': 'The title', 'content': 'The content'}}
"""
    )

def generate_cover_art_prompt( themes: List[str], chapters_metas: List[Chapter], title : str, image: BinaryIO):
    prompt = f"""
        Total Chapters are {len(chapters_metas)}
        Themes are {', '.join(themes)}
        Title of the story is {title}
    """

    for meta in chapters_metas:
        prompt += f"""
            Chapter {meta.chapter_title} is {meta.content}
            \n
            """

    return worqHat.multimodal_non_json(
        image=image,
        system=IMG2STORY_COVER_ART_GEN,
        randomness=0.5,
        prompt=prompt
    )
