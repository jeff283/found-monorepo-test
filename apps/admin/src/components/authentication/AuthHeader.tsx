interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-2">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
        <span className="text-primary-foreground font-bold text-xl">F</span>
      </div>
      <h2 className="headline-1 text-base mt-1">{title}</h2>
      {subtitle && (
        <p className="caption text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
