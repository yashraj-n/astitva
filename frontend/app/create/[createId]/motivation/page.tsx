"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import React from "react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box } from "@chakra-ui/react";
import {useGeneratedCaptionStore} from "@/lib/shared";

export default function Page() {
  const captionStore = useGeneratedCaptionStore();
  const captions = captionStore.captions;
  return (
    <div>
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <BookOpen className="h-5 w-5" />
              <ColorModeButton />
            </div>
          </div>
        </div>
      </nav>
      <Box p={3}>
        <HoverEffect items={captions} />
      </Box>
    </div>
  );
}


