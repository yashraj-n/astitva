import React from "react";
import {
  IconBrandGithub,
  IconDownload,
  IconHome,
} from "@tabler/icons-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { VStack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
export default function FlotingNav({}) {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },

    {
      title: "Mode",
      icon: <ColorModeButton />,
      href: "#",
    },

    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Download PDF",
      icon: (
        <IconDownload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <VStack m={4}>
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </VStack>
  );
}
