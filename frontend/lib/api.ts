import axios, {type AxiosInstance} from 'axios';
import {GeneratedChapter} from "@/lib/shared";

// Axios client configuration with retry logic
const createAxiosClient = (): AxiosInstance => {
    const client = axios.create({
        timeout: 1000000,
        proxy: {
            port: 8080,
            host: "localhost",
            protocol: "http"
        }
    });

    client.interceptors.response.use(
        response => response,
        async error => {
            const config = error.config;
            if (!config || config.__retryCount >= 3) {
                return Promise.reject(error);
            }

            config.__retryCount = (config.__retryCount || 0) + 1;
            return client(config);
        }
    );

    return client;
};

const axiosClient = createAxiosClient();

// Types
interface ThemeResponse {
    data: { themes: string[] };
    file: string;
}

export interface MetaChapter {
    chapter_number: number;
    chapter_title: string;
    content: string;
}

interface StoryResponse {
    data: {
        chapters: MetaChapter[];
        title: string;
    };
}

interface PoemResponse {
    data: {
        poem: string;
    };
}

interface CaptionResponse {
    data: {
        captions: string[];
    };
}

// Theme API
class ThemeAPI {
    private readonly baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async generateThemes(file: File): Promise<ThemeResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<ThemeResponse>(
            `${this.baseUrl}/sketch2story/generateThemes`,
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'},
            }
        );
        return response.data;
    }
}

// Story API
class StoryAPI {
    private readonly baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async generateThemes(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        return await axiosClient.post<ThemeResponse>(
            `${this.baseUrl}/sketch2story/generateThemes`,
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'},
            }
        );
    }

    async generateChapters(
        themes: string[],
        image_uid: string
    ): Promise<StoryResponse> {
        const payload = {themes, image_uid};

        const response = await axiosClient.post<StoryResponse>(
            `${this.baseUrl}/sketch2story/generateChapters`,
            payload,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return response.data;
    }

    async generateStory(
        themes: string[],
        image_uid: string,
        chapters_res: StoryResponse["data"],
        size: string,
        backstory: string,
        user_id: string
    ): Promise<{
        data: {
            cover_art: string;
            chapters: GeneratedChapter[];
        };
    }> {
        const payload = {themes, image_uid, tone: "", chapters_res, size, backstory, user_id};

        const response = await axiosClient.post<{
            data: {
                cover_art: string;
                chapters: GeneratedChapter[];
            };
        }>(
            `${this.baseUrl}/sketch2story/generateStory`,
            payload,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return response.data;
    }
}

// Poem API
class PoemAPI {
    private readonly baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async generateThemes(file: File): Promise<ThemeResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<ThemeResponse>(
            `${this.baseUrl}/img2poem/generateThemes`,
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'},
            }
        );
        return response.data;
    }

    async generateSettings(image_uid: string, themes: string[]): Promise<{
        data: {
            settings: string[];
        };
    }> {
        const payload = {image_uid, themes};

        const response = await axiosClient.post<{
            data: {
                settings: string[];
            };
        }>(
            `${this.baseUrl}/img2poem/generateSettings`,
            payload,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return response.data;
    }

    async generatePoem(
        image_uid: string,
        themes: string[],
        settings: string[],
        user_id: string
    ): Promise<PoemResponse> {
        const payload = {image_uid, themes, settings, user_id};

        const response = await axiosClient.post<PoemResponse>(
            `${this.baseUrl}/img2poem/generatePoem`,
            payload,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return response.data;
    }

}

class CaptionAPI {
    private readonly baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async generateThemes(file: File): Promise<{
       themes:{
           themes: string[];
       }
        uid: string;
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<{
            themes:{
                themes: string[];
            }
            uid: string;
        }>(
            `${this.baseUrl}/cc/generateThemes`,
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'},
            }
        );
        return response.data
    }

    async generateCaptions(
        image_uid: string,
        themes: string[]
    ): Promise<CaptionResponse> {
        const payload = {image_uid, themes};

        const response = await axiosClient.post<CaptionResponse>(
            `${this.baseUrl}/cc/generateCaptions`,
            payload,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
        return response.data;
    }
}

interface AllSaved {
    poems: Poem[];
    stories: Story[];
}

interface Poem {
    content: string; // JSON string containing poem data
    id: number;
    user_id: string;
}

interface Story {
    content: string; // JSON string containing an array of chapters
    id: number;
    image?: string; // Optional, as not all stories might have an image
    title: string;
    user_id: string;
}

class StoredAPI {
    private readonly baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAllSaved(user_id: string) {
        return (await axiosClient.get<AllSaved>(`${this.baseUrl}/getAll/${user_id}`)).data;
    }
}

// Export classes
export {ThemeAPI, StoryAPI, PoemAPI, CaptionAPI, StoredAPI};