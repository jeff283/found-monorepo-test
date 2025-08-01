import { Marquee } from "@/components/magicui/marquee";
import images from "@/constants/images";
import Image from "next/image";

const leftColumnImages = [
  {
    src: images.parcelBoxes,
    alt: "Parcel boxes",
  },
  {
    src: images.suitcase,
    alt: "Suitcase",
  },
  {
    src: images.bagWithPhone,
    alt: "Bag with phone",
  },
];

const rightColumnImages = [
  {
    src: images.phoneOnBench,
    alt: "Phone on benhc",
  },
  {
    src: images.headphones,
    alt: "Headphones",
  },
  {
    src: images.backpack,
    alt: "Backpack",
  },
];

export function HeroSectionMarquee() {
  return (
    <div className="relative flex h-[calc(100vh-theme(spacing.24))] w-full flex-row items-center justify-center overflow-hidden gap-2 px-4">
      {/* Left column (normal direction) */}
      <Marquee
        pauseOnHover
        vertical
        className="flex-1 h-full [--duration:40s] gap-2"
      >
        {leftColumnImages.map((img, i) => (
          <Image
            key={img.alt + i}
            src={img.src}
            alt={img.alt}
            className="w-full aspect-[0.9143] object-cover rounded-2xl mb-2"
          />
        ))}
      </Marquee>
      {/* Right column (reverse direction) */}
      <Marquee
        reverse
        pauseOnHover
        vertical
        className="flex-1 h-full [--duration:40s] gap-2"
      >
        {rightColumnImages.map((img, i) => (
          <Image
            key={img.alt + i}
            src={img.src}
            alt={img.alt}
            className="w-full aspect-[0.8888] object-cover rounded-2xl mb-2"
          />
        ))}
      </Marquee>
      {/* Gradient overlays */}
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div> */}
    </div>
  );
}
