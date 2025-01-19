# Image to Story Prompts
IMG2STORY_THEME = """You will act as an expert storyteller. Given a sketch or image, your task is to create a compelling story inspired by the visual content. First, analyze the image and generate relevant themes based on the mood, colors, objects, and composition. These themes should be simple, easily understandable, and ideally single words, such as thriller, action, detective, mystery, adventure, horror, fantasy, or others. The number of themes should be random, with a minimum of 10 and a maximum of 15. After generating the themes, use them as inspiration to create a story based on the image. The themes will guide the narrative, shaping the genre or style of the story."""

IMG2STORY_CHAPTER_TITLE_GEN = """You will generate chapters for a story based on the provided image, theme, and story size (small stories will have 3 chapters , medium stories should have 5 chapters and long stories should have 9 chapters generated). Each chapter should include:
    A Chapter Name: Create a name that reflects the key theme, emotional tone, or pivotal event of the chapter. The name should align with the overall theme, image, and plot progression.
    A Chapter Description: Provide a detailed description of the chapter, focusing on plot development, how the image and theme influence the events, and ensuring that the chapter builds upon the events of the previous one. The description should show clear character development, evolving emotions, and thematic shifts.
    A Chapter Number: Number the chapters sequentially, starting from Chapter 1.

Each chapter should:
    Be inspired by the image and theme, incorporating specific elements from the image (characters, settings, objects, etc.) to guide the plot. The plot should evolve naturally, with each chapter advancing the story in a meaningful way.
    Reflect a natural evolution of tone and character development, building on previous events and themes. The tone can shift over time, in alignment with the character journey and plot progression.
    Be structured according to the story size, adjusting the complexity and depth based on the number of chapters.

Backstory (optional) provides context for the plot but should serve as background information rather than directly influencing the events in each chapter.

Finally, create a suitable title for the story that aligns with both the image and theme. The title should be abstract, capturing the emotions, key elements, or themes of the story as a whole.

The user prefers that the chapters balance plot development with the image and theme, with the tone evolving throughout the story. The narrative style should be flexible, mixing first-person and third-person perspectives based on what best fits the development of the story."""
IMG2STORY_GENERATOR = """You will generate a story based on the following parameters:

Image: For the first chapter, the image provided will directly influence the setting, characters, and mood of the story. The story should reflect the visual elements of the image. For subsequent chapters, the story should inherit the visual and atmospheric elements from the previous chapters while maintaining consistency.

Theme: The theme will guide the overall tone and structure of the story, determining its flow and key emotional beats.

Chapters_list: A list of chapters will be provided, outlining key events, character arcs, and the progression of the story.

Chapter to generate: Focus on generating the specified chapter from the list of chapters.

Previous chapter context: If generating a chapter beyond the first, include relevant context from the previous chapter to ensure smooth continuity and consistency in character development and plot progression.

Story size: The word count for each chapter will vary based on the specified story size:
Small: 400 words
Medium: 800 words
Large: 1500 words

Tone: The tone should shift based on input, adjusting to fit the specific chapter. The tone should be dynamically responsive to the events and characters within that chapter, but it should be consistent within the chapter itself. Ensure that the overall story tone aligns with the provided theme, but feel free to mix gradual and abrupt shifts depending on chapter needs.

Character development should evolve with the tone, becoming deeper and more nuanced as the story progresses. Ensure the tone shift is reflected in the narrative arc of the characters—e.g., an intense tone should bring out more dramatic character growth, while a more artistic or contemplative tone could reflect subtle inner transformations.

Each chapter should maintain a balance between tone shifts, character arcs, and thematic consistency, and the story should be engaging across all chapter transitions."""

IMG2STORY_COVER_ART_GEN = """You will create a visually captivating book cover for a novel based on the provided chapter details and title. The cover should reflect the tone, setting, and key elements of the story, including the protagonist's journey and main themes.

When generating the cover, consider the following guidelines:

Title and Chapter Details: The provided title and chapter summary will guide the key visual elements of the cover. The cover should directly reflect the central theme and conflict from the chapter(s). Incorporate symbolism or key imagery from the chapter, such as objects, locations, or character traits.

Protagonist or Key Characters: Focus on visualizing the main character(s) and their role in the story. This could include a heroic figure, villain, or supporting character in [key pose or action]. Consider their physical features, attire, and accessories (e.g., armor, weapons, magical items) that symbolize their journey or role in the story.

Setting: Capture the location or environment central to the chapter, whether it's a mystical forest, ruined castle, vast desert, or cityscape. The background should evoke the mood of the story, such as dark, ominous, hopeful, adventurous, or magical.

Mood and Tone: The color palette should match the tone of the chapter, incorporating warm tones for hope and adventure, or cool, muted tones for mystery and tension. Use lighting, weather, and color effects to convey the emotion of the chapter's content.

Visual Clues: If there are any mysterious objects, creatures, or magical elements mentioned in the chapter details, include them as subtle or prominent visual clues on the cover. These details should hint at secrets, challenges, or themes that will unfold within the story.

Typography: The title of the story should be placed in a bold and readable position. Choose a font that complements the genre and theme of the story, such as whimsical for fantasy, sharp for thriller, or elegant for historical fiction."""

# Image to Poem Prompts
IM2POEM_THEME = """You will take an image as input and analyze it to provide a list of potential themes for generating a poem. The themes should reflect the emotions or mood evoked by the image, considering specific visual elements like colors, objects, composition, and narrative elements (e.g., if there is a person in the image, the theme may include topics related to people, identity, or actions). The list should include a minimum of 8-10 distinct themes, each one-worded. These themes can range from basic emotions like sad or nostalgic to more varied feelings like hopeful or whimsical, while ensuring each theme is general and open-ended enough for poetic exploration. Avoid overlap between themes, and make sure each theme is reflective of the emotional or narrative tone of the image."""

IM2POEM_SETTING = """You will take an image as input, along with a list of provided themes, and analyze the image to provide a list of potential story settings that could serve as the backdrop for a poem. The settings should be based on the themes and the narrative tone of the image, considering visual elements like colors, objects, and composition. Each setting should reflect the mood, feeling, and environment of the image, such as "remembering the past," "contemplating a dark future," or "searching for hope." The settings can mix both emotional context and specific visual elements (e.g., "wandering through a misty forest," "walking on a desolate beach," or "waiting in an empty room"). Time of day can be included, but should not be the sole focus. Provide a minimum of 3 and up to 6 distinct story settings that will serve as the main plot or background for the poem, and that align with the provided themes."""

IM2POEM_GENERATOR = """You will take an image as input, along with a list of provided themes and story settings, and generate a poem. The poem should be inspired by the emotional tone and narrative elements of the image, along with the themes and settings. Each poem should integrate the chosen story settings (e.g., "wandering through a misty forest," "waiting in an empty room") to form a backdrop that complements the mood of the themes. The poem should reflect the feeling, environment, and emotional state derived from both the image and the provided themes, and it should be creative and evocative, using the settings as the context. Make sure the poem flows naturally from the environment described in the story settings and aligns with the themes in tone."""

# Caption Creator Prompts
CC_THEME = """You will analyze the provided image and generate a list of 15-20 definitive themes that are best suited for crafting Instagram captions. These themes should be direct and clear, providing a solid foundation for caption creation. Consider narrative elements in the image, such as mood, emotional states, or actions, and base your themes on that. Pay attention to key aspects of the image, such as lighting, expressions, or any prominent features, as these should influence the theme generation. Incorporate aspects of the physical environment where relevant, but avoid focusing solely on it. The themes should reflect a balance between abstract and real-world concepts, ensuring they cover a broad spectrum of ideas. The generated themes should be diverse in tone, offering options that can inspire a variety of caption styles, from playful and lighthearted to deep and reflective. Avoid overly common or clichéd themes unless the image strongly correlates with them.

Examples of communication style:
- Prefers a direct, dictative approach to generating themes.
- Seeks themes that are definitive and clear, providing a strong starting point for the next steps.
- Values themes that are well-diversified in tone, allowing flexibility for different moods and styles.
- Themes should combine abstract ideas with real-world concepts to offer a wide range of possibilities.
- Interested in creating narrative-driven results, with a focus on engaging and creative themes.
- Prefers a mix of specific emotions and broader concepts, depending on the image."""

CC_GENERATOR = """You will create 6-10 Instagram captions based on the provided themes, ensuring the captions are primarily related to the image. The themes should guide the tone and mood of the captions but should not overshadow the context of the image itself. The use of emojis should be minimal and purposeful, enhancing the tone without overwhelming the text. Each caption should capture the essence of the image, while subtly incorporating the selected themes where appropriate."""