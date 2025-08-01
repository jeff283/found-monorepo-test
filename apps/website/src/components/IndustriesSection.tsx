'use client';

import {
  GraduationCap,
  Building2,
  Plane,
  Hotel,
  CalendarDays,
  Bus,
} from 'lucide-react';

type Industry = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const industries: Industry[] = [
  {
    icon: <GraduationCap className="text-[#38BDF8]" size={20} />,
    title: 'Universities & Schools',
    description: 'Simplify campus-wide lost & found management.',
  },
  {
    icon: <Building2 className="text-[#38BDF8]" size={20} />,
    title: 'Corporate Offices',
    description: 'Offer a reliable recovery system for staff and visitors.',
  },
  {
    icon: <Plane className="text-[#38BDF8]" size={20} />,
    title: 'Airports & Transit',
    description: 'Track and recover items efficiently across busy terminals.',
  },
  {
    icon: <Hotel className="text-[#38BDF8]" size={20} />,
    title: 'Hotels & Hospitality',
    description: 'Enhance guest trust with secure, front-desk–friendly tools.',
  },
  {
    icon: <CalendarDays className="text-[#38BDF8]" size={20} />,
    title: 'Event Venues',
    description: 'Handle large volumes of items during events with ease.',
  },
  {
    icon: <Bus className="text-[#38BDF8]" size={20} />,
    title: 'Bus & Public Terminals',
    description: 'Support mobile teams with real-time item tracking.',
  },
];

export default function IndustriesSection() {
  return (
    <section className="bg-background py-16 px-4 md:px-8">
      {/* Heading Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-secondary text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Tailored for High–Traffic <br className="hidden md:block" /> Environments
          </h2>
        </div>
        <p className="text-muted-foreground text-base max-w-md leading-relaxed">
          Foundly supports a wide range of organizations where lost items are a daily operational challenge.
        </p>
      </div>

      {/* Industry Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((item, i) => (
          <div
            key={i}
            className="w-full max-w-[433px] h-auto bg-[#FCFCFC] rounded-[32px] p-5 flex gap-4 items-start"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-base text-secondary mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
