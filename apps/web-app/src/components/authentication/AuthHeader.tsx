import Image from 'next/image';
import images from '@/constants/images';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-2"> {/* Centered layout */}
      <Image
        src={images.logo}
        alt="Foundly Logo"
        className="mb-1"
        width={50}
        height={50}
      />
      <h2 className="headline-1 text-base mt-1">{title}</h2>
      {subtitle && (
        <p className="caption text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
