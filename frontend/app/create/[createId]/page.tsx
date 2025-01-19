"use client";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import React, {useState, useEffect} from "react";
import {ArrowLeft, X} from "lucide-react";
import Link from "next/link";
import {Progress} from "@/components/ui/progress";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import {FileUpload} from "@/components/ui/file-upload";
import {useRouter, useParams} from "next/navigation";
import {CaptionAPI, PoemAPI, StoryAPI} from "@/lib/api";
import {
    useChaptersStore, useGeneratedCaptionStore, useGeneratedPoemStore,
    useImageStore,
    useMiscConfigStore,
    useThemesStore,
} from "@/lib/shared";
import {Textarea} from "@/components/ui/textarea";
import {useUser} from "@clerk/nextjs";

interface MoodOption {
    id: string;
    color: string;
}

interface FileUploadComponentProps {
    previews: string[];
    handleFileUpload: (files: File[]) => void;
    removeFile: (index: number) => void;
}

interface MoodSelectionComponentProps {
    moods: MoodOption[];
    selectedMood: string[] | null;
    setSelectedMood: React.Dispatch<React.SetStateAction<string[] | null>>;
    setColor: React.Dispatch<React.SetStateAction<string | null>>;
}

interface StoryLengthSelectionComponentProps {
    storyLength: string | null;
    setStoryLength: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ProgressBarProps {
    loading: boolean;
    progress: number;
}


const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
                                                                     previews,
                                                                     handleFileUpload,
                                                                     removeFile,
                                                                 }) =>
    previews.length === 0 ? (
        <FileUpload onChange={handleFileUpload}/>
    ) : (
        <motion.div
            className="w-full h-full flex justify-center items-center"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {opacity: 0, scale: 0.9},
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {staggerChildren: 0.1},
                },
            }}
        >
            {previews.map((preview, index) => (
                <motion.div
                    key={index}
                    className="relative group w-[300px] h-[300px] flex items-center justify-center overflow-hidden"
                    whileHover={{scale: 1.05}}
                >
                    <Image
                        src={preview}
                        width={300}
                        height={300}
                        alt={`Preview ${index + 1}`}
                        className="object-cover rounded-lg"
                    />
                    <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4 text-white"/>
                    </button>
                </motion.div>
            ))}
        </motion.div>
    );

const BackstoryInput = ({
                            setValue,
                        }: {
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Give your Sktech an Backstory</h3>
            <Textarea
                placeholder="he was all alone..."
                onChange={(e) => setValue(e.target.value)}
                className="min-h-[100px]"
            />
        </div>
    );
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const MoodSelectionComponent: React.FC<MoodSelectionComponentProps> = ({
                                                                           moods,
                                                                           selectedMood,
                                                                           setSelectedMood,
                                                                           setColor,
                                                                       }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select a mood</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moods.map((mood) => (
                <motion.div
                    key={mood.id}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Card
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-lg bg-gradient-to-r",
                            mood.color,
                            selectedMood?.includes(mood.id)
                                ? "ring-2 ring-primary"
                                : "hover:ring-1 hover:ring-primary/50"
                        )}
                        onClick={() => {
                            setSelectedMood((prev) =>
                                prev?.includes(mood.id)
                                    ? prev.filter((id) => id !== mood.id)
                                    : [...(prev || []), mood.id]
                            );
                            setColor(mood.color);
                        }}
                    >
                        <h4 className="font-semibold text-center">{capitalize(mood.id)}</h4>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
);

const SettingsSelection: React.FC<MoodSelectionComponentProps> = ({
                                                                      moods,
                                                                      selectedMood,
                                                                      setSelectedMood,
                                                                      setColor,
                                                                  }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select a poem setting</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moods.map((mood) => (
                <motion.div
                    key={mood.id}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Card
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-lg bg-gradient-to-r",
                            mood.color,
                            selectedMood?.includes(mood.id)
                                ? "ring-2 ring-primary"
                                : "hover:ring-1 hover:ring-primary/50"
                        )}
                        onClick={() => {
                            setSelectedMood((prev) =>
                                prev?.includes(mood.id)
                                    ? prev.filter((id) => id !== mood.id)
                                    : [...(prev || []), mood.id]
                            );
                            setColor(mood.color);
                        }}
                    >
                        <h4 className="font-semibold text-center">{capitalize(mood.id)}</h4>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
);


const StoryLengthSelectionComponent: React.FC<
    StoryLengthSelectionComponentProps
> = ({storyLength, setStoryLength}) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Length of story</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Short", "Medium", "Long"].map((length) => (
                <motion.div
                    key={length}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <Card
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-lg",
                            storyLength === length.toLowerCase()
                                ? "ring-2 ring-primary"
                                : "hover:ring-1 hover:ring-primary/50"
                        )}
                        onClick={() => setStoryLength(length.toLowerCase())}
                    >
                        <div
                            className="h-32 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                            <h4 className="text-white font-semibold">{length}</h4>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
);

function generateRandomColor(): string {
    const generateHex = () =>
        Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0");
    return `#${generateHex()}${generateHex()}${generateHex()}`;
}

const ProgressBar: React.FC<ProgressBarProps> = ({loading, progress}) =>
    loading && (
        <div className="mt-6">
            <Progress value={progress} className="w-full"/>
        </div>
    );
const StoryGenerator = new StoryAPI(process.env.NEXT_PUBLIC_BACKEND_URL!);
const PoemGenerator = new PoemAPI(process.env.NEXT_PUBLIC_BACKEND_URL!);
const CaptionGenerator = new CaptionAPI(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default function Page() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(1);
    const [step, setStep] = useState(1);
    const [description, setDescription] = useState("");
    const [selectedMood, setSelectedMood] = useState<string[] | null>(null);
    const [storyLength, setStoryLength] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [setting, setSetting] = useState<string[] | null>([]);
    const [generatedSettings, setGeneratedSettings] = useState<MoodOption[]>([]);

    const [theme, setTheme] = useState<MoodOption[]>([]);
    const imageStore = useImageStore();
    const chapterStore = useChaptersStore();
    const router = useRouter();
    const themeStore = useThemesStore();
    const miscStore = useMiscConfigStore();
    const poemStore = useGeneratedPoemStore();
    const captionStore = useGeneratedCaptionStore();
    const params = useParams();
    const user = useUser()

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return newPreviews;
        });
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };

    const handleNext = () => {
        if (step === 1) {
            setLoading(true);
            setTimeout(() => {
                setProgress(Math.floor(Math.random() * 50) + 1);
            }, 400);
            if (params.createId === "ImgtoStory") {
                StoryGenerator.generateThemes(files[0]).then((response) => {
                    console.log("Themes", response);
                    imageStore.setImageId(response.data.file);
                    themeStore.setThemes(response.data.data.themes);
                    setTheme(
                        response.data.data.themes.map((theme: string) => ({
                            id: theme,
                            color: generateRandomColor(),
                        }))
                    );
                    setProgress(100);
                    setTimeout(() => {
                        setLoading(false);
                        setStep(2);
                    }, 500);
                });
            } else if (params.createId === "ImgtoPoetry") {
                PoemGenerator.generateThemes(files[0]).then((response) => {
                    console.log("Themes", response);
                    imageStore.setImageId(response.file);
                    themeStore.setThemes(response.data.themes);
                    setTheme(
                        response.data.themes.map((theme: string) => ({
                            id: theme,
                            color: generateRandomColor(),
                        }))
                    );
                    setProgress(100);
                    setTimeout(() => {
                        setLoading(false);
                        setStep(2);
                    }, 500);
                });
            } else {
                CaptionGenerator.generateThemes(files[0]).then((response) => {
                    console.log("Themes", response);
                    imageStore.setImageId(response.uid);
                    themeStore.setThemes(response.themes.themes);
                    setTheme(
                        response.themes.themes.map((theme: string) => ({
                            id: theme,
                            color: generateRandomColor(),
                        }))
                    );
                    setProgress(100);
                    setTimeout(() => {
                        setLoading(false);
                        setStep(2);
                    }, 500);
                })
            }
        } else if (step === 2) {
            if (params.createId === "ImgtoStory") {
                setStep(3);
            } else if (params.createId === "ImgtoPoetry") {

                setLoading(true);
                PoemGenerator.generatePoem(
                    imageStore.imageId,
                    selectedMood ?? [],
                    setting ?? [],
                    user.user?.primaryEmailAddress?.emailAddress ?? ""
                ).then((response) => {
                    console.log("Poem", response);
                    poemStore.setPoem(response.data.poem);
                    router.push(`/create/${params.createId}/poetry`);
                });
            } else {
                setLoading(true);
                CaptionGenerator.generateCaptions(
                    imageStore.imageId,
                    selectedMood ?? []
                ).then((response) => {
                        console.log("Captions", response);
                        captionStore.setCaptions(response.data.captions);

                        router.push(`/create/${params.createId}/motivation`);
                    }
                )
            }


        } else if (step === 3) {
            const storyData = {
                files,
                description,
                selectedMood,
                storyLength,
                color,
            };
            console.log("Generate", storyData);
            const fileId = imageStore.imageId;
            miscStore.setSize(storyLength ?? "medium");
            miscStore.setBackstory(description);

            setLoading(true);
            setProgress(0);
            setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress <= 80) {
                        return prevProgress + 10;
                    }
                    return prevProgress;
                });
            }, 700);
            if (params.createId === "ImgtoStory") {
                StoryGenerator.generateChapters(selectedMood ?? [], fileId).then(
                    (response) => {
                        console.log("Chapters", response);
                        setLoading(false);
                        chapterStore.setChapters(response.data.chapters);
                        miscStore.setTitle(response.data.title);

                        router.push(`/create/${params.createId}/Outline`);
                    }
                );
            } else if (params.createId === "ImgtoPoetry") {
                // PoemGenerator.gene
                alert("Poetry generation is not implemented yet.");
            } else {
            }
        }
    };

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    return (
        <motion.div
            className="min-h-screen"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.6}}
        >
            <div className="container max-w-4xl mx-auto px-4 py-8 z-100">
                <div className="mb-8">
                    <Link href="/create">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Back
                        </Button>
                    </Link>
                </div>

                <Card className="p-8 shadow-lg rounded-lg z-20">
                    <motion.div
                        className="text-center mb-8"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <h1 className="text-4xl font-extrabold">
                            Generate{" "}
                            {params.createId === "ImgtoStory"
                                ? "Story"
                                : params.createId === "ImgtoPoetry"
                                    ? "Poetry"
                                    : "Caption"}
                        </h1>
                        <p className="text-gray-400">
                            What would you like to create today?
                        </p>
                    </motion.div>

                    <div className="space-y-6 z-40">
                        {step === 1 && (
                            <FileUploadComponent
                                previews={previews}
                                handleFileUpload={handleFileUpload}
                                removeFile={removeFile}
                            />
                        )}

                        {step === 2 && (
                            <>
                                {params.createId === "ImgtoStory" ? (
                                    <BackstoryInput setValue={setDescription}/>
                                ) : (
                                    ""
                                )}
                                <MoodSelectionComponent
                                    moods={theme}
                                    selectedMood={selectedMood}
                                    setSelectedMood={setSelectedMood}
                                    setColor={setColor}
                                />
                                {params.createId === "ImgtoPoetry" && generatedSettings.length ? (
                                    <SettingsSelection moods={generatedSettings} selectedMood={setting}
                                                       setSelectedMood={setSetting!} setColor={setColor}/>
                                ) : (
                                    ""
                                )}
                            </>
                        )}

                        {step === 3 && (
                            <StoryLengthSelectionComponent
                                storyLength={storyLength}
                                setStoryLength={setStoryLength}
                            />
                        )}

                        <ProgressBar loading={loading} progress={progress}/>

                        <div className="mt-6 flex justify-center">
                            {step === 2 && params.createId === "ImgtoPoetry" && !generatedSettings.length ? (
                                <Button onClick={() => {
                                    setLoading(true);
                                    console.log(imageStore.imageId, selectedMood);
                                    PoemGenerator.generateSettings(
                                        imageStore.imageId,
                                        selectedMood ?? []
                                    ).then((response) => {
                                        console.log("Settings", response);
                                        setGeneratedSettings(response.data.settings.map((theme: string) => ({
                                            id: theme,
                                            color: generateRandomColor(),
                                        })));
                                        setLoading(false);

                                    });

                                }}
                                        disabled={loading}
                                >
                                    Generate Settings
                                </Button>
                            ) : (
                                <Button onClick={handleNext} disabled={loading}>
                                    {step === 1 ? "Upload Files" : step === 3 ? "Next" : "Generate"}
                                </Button>
                            )}


                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
