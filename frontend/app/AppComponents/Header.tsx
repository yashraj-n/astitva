"use client"
import { ColorModeButton } from '@/components/ui/color-mode'
import React from 'react'
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
export default function Header() {
  return (
    <div>
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
              <UserButton/>
            </Button>
            <ColorModeButton />
          </div>
        </motion.header>
    </div>
  )
}
