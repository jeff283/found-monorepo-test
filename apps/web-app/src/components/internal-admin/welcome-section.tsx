'use client'

import { useEffect, useState } from "react";
import { CalendarDays, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  userName: string;
  compact?: boolean;
}

export function WelcomeSection({ userName, compact }: WelcomeSectionProps) {
  const [greeting, setGreeting] = useState(getGreeting());
  const dateRange = "24 Jun 2025 - 24 Jun 2025"; // Use a constant instead of state

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-3" : "p-6"
      }`}
    >
      {/* Left side: Greeting */}
      <div className="flex items-baseline gap-2">
        <p className="text-foreground font-medium text-lg sm:text-xl md:text-2xl leading-snug">
          {greeting},
        </p>
        <p className="text-foreground font-bold text-lg sm:text-xl md:text-2xl leading-tight">
          {userName}
        </p>
      </div>

      {/* Right side: Date range & Export */}
      <div className="mt-4 sm:mt-0 flex items-center gap-2">
        {/* Date range box */}
        <div className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-md text-sm text-foreground cursor-pointer">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{dateRange}</span>
        </div>

        {/* Export button */}
        <Button
          variant="outline"
          className="text-sm h-8 px-4 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </section>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}
