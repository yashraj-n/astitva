"use client";
import React, {useEffect} from "react";
import Header from "../AppComponents/Header";
import {PlusCircle, Activity,} from "lucide-react";
import {motion} from "framer-motion";
import {useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import {CardBody, CardContainer, CardItem} from "@/components/ui/3d-card";
import {HStack} from "@chakra-ui/react";
import {StoredAPI} from "@/lib/api";
import {useChaptersStore, useGeneratedPoemStore, useGeneratedStoryStore, useMiscConfigStore} from "@/lib/shared";
import {useRouter} from "next/navigation";


interface Stored {
    type: string;
    title: string;
    img: string;
    content: string;
}

const StoredManager = new StoredAPI(process.env.NEXT_PUBLIC_BACKEND_URL!);
export default function Page() {
    const {user, isLoaded} = useUser();
    const [data, setData] = React.useState<Stored[]>([]);
    const [counts, setCounts] = React.useState({stories: 0, poems: 0});


    const router = useRouter();

    const chapterStore = useGeneratedStoryStore();
    const poemStore = useGeneratedPoemStore();
    const miscStore = useMiscConfigStore();

    const cardData = [
        {
            name: "Image to Story",
            icon: "✍️",
            description: "Transform your images into engaging stories.",
            url: "create/ImgtoStory",
            count: counts.stories,
        },
        {
            name: "Image to Poetry",
            icon: "🖋️",
            description: "Create stunning poetry from your images.",
            url: "create/ImgtoPoetry",
            count: counts.poems,
        },
        {
            name: "Image to Caption",
            icon: "📚📖",
            description: "Generate Caption from images.",
            url: "create/ImgtoCaption",
            count: 4,
        },
    ];
    useEffect(() => {
        if (isLoaded) {
            StoredManager.getAllSaved(user?.primaryEmailAddress?.emailAddress ?? "").then((data) => {
                console.log(data);
                data.stories.forEach((story) => {
                    setData((prev) => [...prev, {
                        type: "Story",
                        title: story.title,
                        img: story.image ?? "",
                        content: story.content
                    }]);
                });
                data.poems.forEach((poem) => {
                    const poemContent = JSON.parse(poem.content);
                    setData((prev) => [...prev, {
                        type: "Poem",
                        title: (poemContent.poem.slice(0, 40) ?? "No Poem Found") + "...",
                        img: "https://d2eehagpk5cl65.cloudfront.net/img/wp-content/uploads/2024/04/AI-Bullshit-Makes-Poets-Mad.jpg",
                        content: poem.content
                    }]);
                });

                setCounts({stories: data.stories.length, poems: data.poems.length});

            });
        }

    }, [isLoaded]);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header/>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Welcome back, {user?.firstName}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {`   Ready to bring your next idea to life?`}
                        </p>
                    </div>
                    <Link href={"/create"}>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4"/>
                            New Creation
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {cardData.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{y: 50, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.5, delay: 0.2 * index}}

                        >
                            <Link href={feature.url}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {feature.name}
                                        </CardTitle>
                                        <span className="text-2xl">{feature.icon}</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{feature.count}</div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <Tabs defaultValue="activity" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="activity" className="gap-2">
                            <Activity className="h-4 w-4"/>
                            Recent Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-8">
                                    <HStack w={"100%"} overflow={"auto"}>
                                        {data.map((activity) => (
                                            <div onClick={() => {
                                                const parsed = JSON.parse(activity.content);
                                                if (activity.type === "Story") {
                                                    console.log(parsed);
                                                    chapterStore.setChapters(parsed);
                                                    chapterStore.setCoverArt(activity.img);
                                                    miscStore.setTitle(activity.title);
                                                    router.push(`/create/ImgtoStory/story`);
                                                } else {
                                                    console.log(parsed);
                                                    router.push(`/create/ImgtoPoetry/poetry`);
                                                    poemStore.setPoem(parsed.poem);
                                                }

                                            }}>
                                                <CardContainer className="inter-var">
                                                    <CardBody
                                                        className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                                                        <CardItem
                                                            translateZ="50"
                                                            className="text-xl font-bold text-neutral-600 dark:text-white"
                                                        >
                                                            {activity.title}
                                                        </CardItem>
                                                        <CardItem translateZ="100" className="w-full mt-4">
                                                            <Image
                                                                src={activity.img}
                                                                height="1000"
                                                                width="1000"
                                                                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                                                alt="thumbnail"
                                                            />
                                                        </CardItem>
                                                        <div className="flex justify-between items-center mt-20">

                                                        </div>
                                                    </CardBody>
                                                </CardContainer>
                                            </div>
                                        ))}
                                    </HStack>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Your content creation analytics and trends will appear here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="library">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Library</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Your saved and generated content will be displayed here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
