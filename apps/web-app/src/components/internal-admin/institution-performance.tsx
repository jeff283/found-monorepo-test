'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface InstitutionData {
  name: string
  location: string
  avatar: string
  lastActivity: string
  foundItems: number
  agents: number
  statOrder?: ('lastActivity' | 'foundItems' | 'agents')[]
}

const mockInstitutions: InstitutionData[] = [
  {
    name: 'Lumière Grand Hotel',
    location: 'Nairobi, Kenya',
    avatar: '/avatars/avatar-1.webp',
    lastActivity: '1 Hour',
    foundItems: 24,
    agents: 24,
    statOrder: ['lastActivity', 'foundItems', 'agents'],
  },
  {
    name: 'Lumière Grand Hotel',
    location: 'Nairobi, Kenya',
    avatar: '/avatars/avatar-2.webp',
    lastActivity: '1 Hour',
    foundItems: 24,
    agents: 24,
    statOrder: ['foundItems', 'lastActivity', 'agents'],
  },
]

const statLabels: Record<string, string> = {
  lastActivity: 'Last Activity',
  foundItems: 'Found Items',
  agents: 'Agents',
}

export function InstitutionPerformance() {
  return (
    <div className="bg-white rounded-xl border border-muted p-4 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-black">Institution performance</h2>
          <p className="text-[12px] text-muted-foreground mt-1 opacity-60">
            Recent institutions performance
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Institution Cards */}
      <div className="flex flex-col gap-3">
        {mockInstitutions.map((inst, index) => (
          <div
            key={index}
            className="bg-white border border-muted rounded-lg p-3"
          >
            {/* Top row: Avatar + name + location */}
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={inst.avatar}
                alt={inst.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black leading-tight">
                  {inst.name}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight opacity-40">
                  {inst.location}
                </span>
              </div>
            </div>

            {/* Stat row: dynamically ordered */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              {inst.statOrder?.map((key) => {
                return (
                  <div key={key}>
                    <div className="font-medium text-[11px] text-muted-foreground mb-1 opacity-40">{statLabels[key]}</div>
                    <div className="text-base text-black">{inst[key]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
