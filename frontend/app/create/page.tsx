"use client";

import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import { VStack } from "@chakra-ui/react";

export default function CreateStory() {
  const cardData = [
    {
      name: "Image to Story",
      icon: "✍️",
      description: "Transform your images into engaging stories.",
      url: "/ImgtoStory",
    },
    {
      name: "Image to Poetry",
      icon: "🖋️",
      description: "Create stunning poetry from your images.",
      url: "/ImgtoPoetry",
    },
    {
      name: "Image to Motivational Quote",
      icon: "📚📖",
      description: "Generate inspiring quotes from images.",
      url: "/ImgtoMotivation",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 h-full">
      <BackgroundBeamsWithCollision className="h-full">
        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                Create with AI
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
            </div>
            <p className="text-base sm:text-lg text-gray-300">
              Discover the power of AI in creativity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-1 h-full">
            {cardData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <Link href={`/create${card.url}`}>
                  <CardContainer className="inter-var">
                    <CardBody className="bg-gray-800 relative group/card hover:bg-gray-700 transition-colors duration-300 dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 flex flex-col justify-between">
                      <div>
                        <CardItem translateZ="100" className="w-full mb-4">
                          <span className="text-4xl sm:text-5xl">
                            {card.icon}
                          </span>
                        </CardItem>
                        <CardItem
                          translateZ="50"
                          className="text-xl font-bold text-white mb-2"
                        >
                          {card.name}
                        </CardItem>
                        <CardItem
                          as="p"
                          translateZ="60"
                          className="text-gray-300 text-sm"
                        >
                          {card.description}
                        </CardItem>
                      </div>
                      <CardItem translateZ="30" className="mt-4">
                        <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-300">
                          Try Now
                        </button>
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </Link>
              </motion.div>
            ))}
          </div>

          <VStack>
            <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
            </Link>
          </VStack>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
