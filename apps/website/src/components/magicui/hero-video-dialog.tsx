"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="aspect-video w-full rounded-xl border border-white/10 shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 sm:size-20 md:size-24 lg:size-28 items-center justify-center rounded-full bg-white/20 backdrop-blur-[6px] border border-white/30 shadow-md group-hover:scale-105 transition-transform duration-200 ease-out">
            <div className="flex size-10 sm:size-12 md:size-14 lg:size-16 items-center justify-center rounded-full bg-gradient-to-b from-[#00B5C3] to-[#0095a9] shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-200 ease-out">
              <Play
                className="size-5 sm:size-6 md:size-7 lg:size-8 text-white"
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 lg:p-8"
          >
            {/* Close button positioned outside the video container */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 rounded-full bg-white/90 p-2 sm:p-3 md:p-4 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-lg"
              onClick={() => setIsVideoOpen(false)}
            >
              <XIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-900" />
            </motion.button>

            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl h-[50vw] max-h-[70vh] sm:h-[45vw] sm:max-h-[75vh] md:h-[500px] lg:h-[600px] xl:h-[700px] min-h-[300px] sm:min-h-[400px] rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 shadow-xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative z-[1] h-full w-full overflow-hidden rounded-2xl">
                <iframe
                  src={videoSrc}
                  className="h-full w-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{ minHeight: 200 }}
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}