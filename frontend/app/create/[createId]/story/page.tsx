"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Menu,
  BookOpen,
  ChevronRight,
  Home,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { ColorModeButton } from "@/components/ui/color-mode";

import {useGeneratedStoryStore} from "@/lib/shared";



export default function StoryViewer() {
  const  data = useGeneratedStoryStore();
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const nextChapter = () => {
    if (selectedChapter < data.chapters.length - 1) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const previousChapter = () => {
    if (selectedChapter > 0) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  return (
    <div className="flex h-auto bg-background">
      {/* Left Side - Fixed Image */}
      <div className="w-1/2 h-auto relative">
        <div className="fixed w-1/2 h-full">
          <Image
            src={data.cover_art}
            alt="Story illustration"
            layout="fill"
            objectFit="cover"
            className={cn(
              "transition-transform duration-500",
              isImageEnlarged ? "scale-110" : "scale-100"
            )}
            onClick={() => setIsImageEnlarged(!isImageEnlarged)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Chapter Navigation Overlay */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white">
            <Button
              variant="secondary"
              className=" text-white"
              onClick={previousChapter}
              disabled={selectedChapter === 0}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              className=" text-white"
              onClick={nextChapter}
              disabled={selectedChapter === data.chapters.length - 1}
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Scrollable Content */}
      <div className="w-1/2 h-auto">
        {/* Navigation Bar */}
        <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="py-4">
                      <h2 className="text-lg font-semibold mb-4">Chapters</h2>
                      <ScrollArea className="">
                        {data.chapters.map((chapter, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-left mb-2",
                                selectedChapter === index && ""
                              )}
                              onClick={() => setSelectedChapter(index)}
                            >
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {chapter.title}
                            </Button>
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center space-x-4">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Chapter {selectedChapter + 1}
                </span>
                <ColorModeButton/>
              </div>
            </div>
          </div>
        </nav>

        {/* Story Content */}
        <div className="px-8 py-6 ">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${selectedChapter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">
                  {data.chapters[selectedChapter].title}
                </h1>
                <div className="h-1 w-20  bg-blue-500 rounded-full" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-lg p-6 shadow-lg border"
              >
                <p className="text-card-foreground leading-relaxed">
                  {data.chapters[selectedChapter].content}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
