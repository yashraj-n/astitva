"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HoverEffect = ({
  items,
  className,
}: {
  items: string[]
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item}
          className="relative group block h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle className="min-h-[200px]">{item}</CardTitle>
            <CardFooter item={item} />
          </Card>
        </div>
      ))}
    </div>
  );
};

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg h-full w-full p-4 overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-all duration-200 ease-in-out group-hover:border-gray-300 dark:group-hover:border-gray-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-200",
        className
      )}
    >
      {children}
    </h4>
  );
};



const CardFooter = ({ item }: { item: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareItem = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item,
          url: item,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.log("Error sharing: " + error));
    } else {
      copyToClipboard(item);
    }
  };

  return (
    <div className="flex justify-end mt-4 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          copyToClipboard(item);
        }}
        className="text-xs"
      >
        {copied ? (
          <Check className="w-3 h-3 mr-1" />
        ) : (
          <span className="mr-1">Copy</span>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          shareItem();
        }}
        className="text-xs"
      >
        <Share2 className="w-3 h-3 mr-1" />
        <span>Share</span>
      </Button>
    </div>
  );
};
