"use client";
import React, { useState, useEffect, useRef } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Bookmark, Share2, ArrowLeft, Copy } from 'lucide-react';
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ColorModeButton } from "@/components/ui/color-mode";
// import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {useGeneratedPoemStore} from "@/lib/shared";




const FloatingElement: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="absolute text-4xl text-primary/10 dark:text-primary/20 pointer-events-none"
    animate={{
      y: ["0%", "100%"],
      opacity: [0.7, 0, 0.7],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: Math.random() * 10 + 10,
      repeat: Infinity,
      repeatType: "reverse",
    }}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  >
    {children}
  </motion.div>
);

export default function Page() {
  const [fontSize, setFontSize] = useState(16);
//   const [focusMode, setFocusMode] = useState(false);
  const [focusedLine, setFocusedLine] = useState(0);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
//   const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const poemStore = useGeneratedPoemStore();
  const poetry = poemStore.poem;
  const wordCount = poetry.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  const poetryLines = poetry.split('\n');

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight } = containerRef.current;
        const lineHeight = scrollHeight / poetryLines.length;
        const currentLine = Math.floor(scrollTop / lineHeight);
        setFocusedLine(currentLine);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        (container as HTMLElement).removeEventListener('scroll', handleScroll);
      }
    };
  }, [poetryLines.length]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Poetry',
        text: poetry,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(poetry);
    toast({
      title: "Copied to clipboard",
      description: "The poem has been copied to your clipboard.",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingElement>📚</FloatingElement>
        <FloatingElement>✏️</FloatingElement>
        <FloatingElement>🍎</FloatingElement>
        <FloatingElement>🎒</FloatingElement>
        <FloatingElement>🖍️</FloatingElement>
      </div>

      <nav className="w-full fixed top-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 shadow-lg backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="text-lg font-medium">Poetry</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <BookOpen className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Font Size:</span>
                <Slider
                  value={[fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={({ value }: { value: number[] }) => setFontSize(value[0])}
                  className="w-32"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{fontSize}px</span>
              </div>

              <div className="flex items-center gap-2">
                <ColorModeButton />
                
              
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-zinc-700 dark:text-zinc-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="text-zinc-700 dark:text-zinc-300"
                >
                  <Copy className="h-5 w-5" />
                </Button>

               
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-20 w-full max-w-2xl"
      >
        <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900 mx-auto">
          <div 
            ref={containerRef}
            className={`prose dark:prose-invert max-w-none max-h-[70vh] overflow-y-auto`}
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
            }}
          >
            {poetryLines.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mb-4 text-neutral-600 dark:text-neutral-400 ${
                  index === focusedLine ? 'bg-primary/10 -mx-2 px-2 rounded' : ''
                }`}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </BackgroundGradient>
      </motion.div>

      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-primary/50"
        style={{ scaleX: scrollYProgress }}
      />

      
    </div>
  );
}

