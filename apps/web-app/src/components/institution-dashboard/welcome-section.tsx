import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  userName: string;
  compact?: boolean;
}

export function WelcomeSection({ userName, compact }: WelcomeSectionProps) {
  const [greeting, setGreeting] = useState(getGreeting());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-3" : "p-6"
      }`}
    >
      {/* Greeting and Name on one line */}
      <div className="flex items-baseline gap-2">
        <span className="text-gray-900 font-medium text-lg sm:text-xl md:text-2xl leading-snug">
          {greeting},
        </span>
        <span className="text-gray-900 font-bold text-lg sm:text-xl md:text-2xl leading-tight">
          {userName}
        </span>
      </div>

      {/* CTA Buttons side by side */}
      <div
        className={`mt-3 sm:mt-0 flex ${
          compact ? "gap-2 flex-col sm:flex-row sm:items-center" : "gap-3"
        }`}
      >
        <Button
          className={`bg-cyan-500 ${
            compact ? "h-7 px-3 text-xs" : "h-8 px-4 text-sm"
          }`}
          onClick={() => router.push("/students/report-lost")}
        >
          Report Lost
        </Button>
        <Button
          className={`bg-cyan-500 ${
            compact ? "h-7 px-3 text-xs" : "h-8 px-4 text-sm"
          }`}
        >
          Check Records
        </Button>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}
