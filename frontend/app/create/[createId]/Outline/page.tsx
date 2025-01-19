"use client";

import Link from "next/link";
import {useState} from "react";
import {motion} from "framer-motion";
import {ArrowLeft, Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Card, CardContent} from "@/components/ui/card";
import {VStack} from "@chakra-ui/react";
import {useParams, useRouter} from "next/navigation";
import {
    useChaptersStore,
    useGeneratedStoryStore,
    useImageStore,
    useMiscConfigStore,
    useThemesStore
} from "@/lib/shared";
import {StoryAPI} from "@/lib/api";
import {useUser} from "@clerk/nextjs";

const StoryGenerator = new StoryAPI(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default function OutlinePage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter()
    const params = useParams();
    const imageStore = useImageStore();
    const chapterStore = useChaptersStore();
    const themesStore = useThemesStore();
    const miscStore = useMiscConfigStore();
    const generatedStoryStore = useGeneratedStoryStore();
    const user = useUser();
    const handleGenerate = () => {
        // router.push(
        //   `/create/${params.createId}/${
        //     params.createId === "ImgtoStory"
        //       ? "story"
        //       : params.createId === "ImgtoPoetry"
        //       ? "poetry"
        //       : "motivation"
        //   }`
        // );
        setIsGenerating(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 80) {
                    clearInterval(interval);
                    return prevProgress;
                }
                return prevProgress + 10;
            });

        }, 900);


        StoryGenerator.generateStory(
            themesStore.themes,
            imageStore.imageId,
            {
                title: miscStore.title,
                chapters: chapterStore.chapters
            },
            miscStore.size,
            miscStore.backstory,
            user.user?.primaryEmailAddress?.emailAddress ?? ""
        ).then((response) => {
            console.log(response);
            setIsGenerating(false);
            generatedStoryStore.setChapters(response.data.chapters);
            generatedStoryStore.setCoverArt(response.data.cover_art);
            router.push(`/create/${params.createId}/story`);

        });
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="p-4 border-b">
                <nav>
                    <Link href="/create">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Back
                        </Button>
                    </Link>
                </nav>
            </header>
            <main className="container mx-auto px-4 py-8 h-[80vh] overflow-scroll">
                <motion.h1
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    className="text-4xl font-bold text-center mb-8"
                >
                    {/*Chapter Outline*/}
                    {miscStore.title}
                </motion.h1>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    className="max-w-2xl mx-auto space-y-4"
                >
                    {chapterStore.chapters.map((card, index) => (
                        <Card key={`card-${card.chapter_title}`}>
                            <CardContent className="p-4">
                                <motion.div
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: index * 0.1}}
                                    className="flex items-start gap-4"
                                >
                                    <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg mb-1">{card.chapter_title}</h3>
                                        <p className="text-muted-foreground">{card.content}</p>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="mt-8 text-center"
                ></motion.div>
                <VStack>
                    <Button
                        size="lg"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="relative"
                    >
                        {isGenerating ? (
                            <>
                                Generating
                                <span
                                    className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                            </>
                        ) : (
                            <>
                                Generate
                                {progress === 100 && <Check className="ml-2 w-4 h-4"/>}
                            </>
                        )}
                    </Button>
                    {isGenerating && (
                        <div className="mt-4 max-w-md mx-auto">
                            <Progress value={progress} className="w-full"/>
                        </div>
                    )}
                </VStack>
            </main>
        </div>
    );
}