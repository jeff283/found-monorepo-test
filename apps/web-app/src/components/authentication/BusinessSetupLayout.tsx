"use client";

import React from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessSetupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
  onBack?: () => void;
  showBackButton?: boolean;
}

const BusinessSetupLayout: React.FC<BusinessSetupLayoutProps> = ({
  children,
  currentStep,
  totalSteps = 3,
  stepNames = ["Organization", "Verification", "Complete"],
  onBack,
  showBackButton = true,
}) => {
  const currentYear = new Date().getFullYear();

  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header & Progress Container */}
      <div className="sticky top-0 z-50">
        {/* Header - Full Width */}
        <div className="bg-white/95  border-b border-[#FAFAFB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 sm:gap-4">
                {showBackButton && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium hidden sm:inline">
                      Back
                    </span>
                  </button>
                )}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-[#00B5C3] rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      F
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    Foundly
                  </span>
                </div>
              </div>

              <button className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-[#00B5C3] transition-colors group">
                <Phone className="w-4 h-4 group-hover:scale-105 transition-transform" />
                <span className="text-sm font-medium hidden sm:inline">
                  Contact support
                </span>
                <span className="text-xs font-medium sm:hidden">Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Floating Menu */}
        <div className="relative mt-8 px-4 sm:px-6 pb-4">
          <div className="flex justify-center">
            <div className="bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-8 py-3 sm:py-4 shadow-lg border border-[#00B5C3]/20 ring-1 ring-[#00B5C3]/10">
              <div className="flex items-center justify-center space-x-3 sm:space-x-6">
                {Array.from({ length: totalSteps }, (_, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  const stepName = stepNames[index] || `Step ${stepNumber}`;

                  return (
                    <div key={stepNumber} className="flex items-center">
                      {/* Mobile: Only circles */}
                      <div className="flex items-center sm:hidden">
                        <div
                          className={`
                            relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200
                            ${
                              isCompleted
                                ? "bg-[#00B5C3] text-white shadow-md shadow-[#00B5C3]/25"
                                : isCurrent
                                ? "bg-[#00B5C3] text-white shadow-lg shadow-[#00B5C3]/30 ring-2 ring-[#00B5C3]/20 ring-offset-2 ring-offset-white"
                                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            stepNumber
                          )}
                        </div>
                      </div>

                      {/* Desktop: Circles with labels */}
                      <div className="hidden sm:flex items-center space-x-3">
                        {/* Step Circle */}
                        <div
                          className={`
                            relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200
                            ${
                              isCompleted
                                ? "bg-[#00B5C3] text-white shadow-md shadow-[#00B5C3]/25"
                                : isCurrent
                                ? "bg-[#00B5C3] text-white shadow-lg shadow-[#00B5C3]/30 ring-2 ring-[#00B5C3]/20 ring-offset-2 ring-offset-white"
                                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            stepNumber
                          )}
                        </div>

                        {/* Step Name */}
                        <div className="flex flex-col">
                          <span
                            className={`
                              text-sm font-medium transition-colors duration-200
                              ${
                                isCurrent
                                  ? "text-[#00B5C3] font-semibold"
                                  : isCompleted
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {stepName}
                          </span>
                          {isCurrent && (
                            <span className="text-xs text-[#00B5C3]/70 mt-0.5 font-medium">
                              Current step
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connector Line */}
                      {stepNumber < totalSteps && (
                        <div className="mx-2 sm:mx-4">
                          <div
                            className={`
                              w-6 sm:w-12 h-0.5 transition-all duration-300 rounded-full
                              ${
                                stepNumber < currentStep
                                  ? "bg-[#00B5C3] shadow-sm"
                                  : "bg-gray-200"
                              }
                            `}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {/* Content Card */}
        <div className="bg-white rounded-xl border border-[#F7F7F7] overflow-hidden my-6 sm:my-8">
          <div className="p-6 sm:p-8">{children}</div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear}, All Rights Reserved &nbsp; | &nbsp;
            <a
              href="/policies"
              className="hover:text-[#00B5C3] transition-colors"
            >
              Privacy and policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSetupLayout;
