"use client";

import { Building2, Clock, CheckCircle, XCircle } from "lucide-react";
import { type InstitutionMetricsData } from "@/api/lib/types";

interface InstitutionMetricsProps {
  metrics: InstitutionMetricsData;
}

export function InstitutionMetricsCards({ metrics }: InstitutionMetricsProps) {
  const cards = [
    {
      title: "Total Applications",
      value: metrics.total_applications,
      description: "All submitted applications",
      color: "text-steel-blue-100",
      bgColor: "bg-steel-blue-50",
      icon: Building2,
    },
    {
      title: "Pending Review",
      value: metrics.pending_applications,
      description: "Awaiting admin approval",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: Clock,
    },
    {
      title: "Approved",
      value: metrics.approved_applications,
      description: "Successfully approved",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      icon: CheckCircle,
    },
    {
      title: "Rejected",
      value: metrics.rejected_applications,
      description: "Applications declined",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}
              >
                <IconComponent className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                {card.title}
              </p>
              <div className={`headline-1 ${card.color}`}>
                {card.value.toLocaleString()}
              </div>
              <p className="caption text-gray-600">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
