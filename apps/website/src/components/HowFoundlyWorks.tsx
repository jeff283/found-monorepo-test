'use client'

import {
  BrainCog,
  BriefcaseBusiness,
  BadgeCheck,
  Network,
} from 'lucide-react'
import FoundlyButton from './FoundlyButton'

export default function HowFoundlyWorks() {
  const features = [
    {
      icon: <BrainCog className="w-7 h-7 text-primary" />,
      title: 'AI-Driven Accuracy',
      description:
        'Smart matching engine connects lost reports with found items quickly, even with vague or incomplete data.',
      bg: 'bg-card',
    },
    {
      icon: <BriefcaseBusiness className="w-7 h-7 text-primary" />,
      title: 'Operational Efficiency',
      description:
        'Reduce manual workload with automated notifications, centralized dashboards, and streamlined item workflows.',
      bg: 'bg-background',
    },
    {
      icon: <BadgeCheck className="w-7 h-7 text-primary" />,
      title: 'Secure & Verified ',
      description:
        'Ensure only rightful owners reclaim items using ID verification, receipts, and fraud detection protocols.',
      bg: 'bg-card',
    },
    {
      icon: <Network className="w-7 h-7 text-primary" />,
      title: 'Scalable & Integrable',
      description:
        'Deploy across multiple locations, with seamless integrations into your existing systems (CRMs, helpdesks, etc.).',
      bg: 'bg-background',
    },
  ]

  return (
    <section className="bg-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <p className="caption text-muted-foreground mb-2">
          {/* <span className="text-2xl font-bold align-middle mr-1">•</span>
          <span className="text-lg md:text-xl font-semibold align-middle">
            How Foundly Works
          </span> */}
        </p>
        <h2 className="title-3 text-secondary mb-10 text-center">
          Smarter Lost & Found, Built for
          <span className="block md:inline" /> Modern Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl ${feature.bg} flex flex-col items-start p-6 h-full`}
            >
              <h3 className="headline-2 text-secondary mb-10 text-left w-full">
                {feature.title}
              </h3>
              <div className="mb-14 mt-4 flex justify-start items-center w-full">
                {feature.icon}
              </div>
              <p className="body-1 text-muted-foreground text-left w-full mt-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <FoundlyButton
            text="Contact us"
            href="#footer"
            className="px-8 py-3"
          />
        </div>
      </div>
    </section>
  )
}