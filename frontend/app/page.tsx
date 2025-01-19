"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useUser } from "@clerk/nextjs";

export default function Home() {
 const {   isLoaded , isSignedIn} = useUser()

  

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
       
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center p-6"
        >
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200">
            Astitva
          </h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href={isLoaded && isSignedIn ? "/dashboard" : "/create"}>{isLoaded && isSignedIn ? "Dashboard" : "Start for Free"}</Link>
            </Button>
            <ColorModeButton />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center px-4 mt-20 text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6"
          >
            Transform Images into Stories
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12"
          >
            Unleash the power of AI to convert your images into captivating
            narratives. Upload any image and watch as our platform weaves a
            unique story around it.
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href={"/create"}>
            <Button size="lg" className="text-lg px-8 py-4">
              Start Creating
            </Button>
            </Link>
          </motion.div>
        </main>

        {/* Features Section */}
        <section className="mt-24 px-4 mb-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-12"
          >
            How It Works
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Upload",
                description:
                  "Choose any image you'd like to turn into a story.",
              },
              {
                title: "Process",
                description:
                  "Our AI analyzes the image and generates a unique narrative.",
              },
              {
                title: "Enjoy",
                description:
                  "Read, share, and bring your images to life with compelling stories.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

