// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";

interface FoundItem {
  itemName: string;
  itemNumber: string;
  foundAt: string;
  date: string;
  description: string;
  status: string;
  matchPercentage: number;
}

interface FoundMatchesListProps {
  foundItems: FoundItem[];
  onBack: () => void;
  onClaim: (itemNumber: string) => void;
  onReject: (itemNumber: string) => void;
}

export default function FoundMatchesList({
  foundItems,
  onBack,
  onClaim,
  onReject,
}: FoundMatchesListProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-2 sm:px-4 md:px-8 py-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-screen-sm sm:max-w-screen-md md:max-w-[900px] lg:max-w-[1100px] p-4 sm:p-6 md:p-10 lg:p-14 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-base sm:text-lg font-medium">Report lost</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">We Found Possible Matches</h1>
        </div>

        {/* Found Items */}
        <div className="space-y-4 sm:space-y-6">
          {foundItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items were found matching your description.</p>
              <p className="text-gray-400 text-sm mt-2">We&apos;ll notify you if a match is found later.</p>
            </div>
          ) : (
            foundItems.map((item) => (
              <div key={item.itemNumber} className="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Match Percentage */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-cyan-600">{item.matchPercentage}%</span>
                  </div>

                  {/* Item Details */}
                    <div className="flex-1 space-y-2 sm:space-y-2">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{item.itemName}</h2>

                      {/* Confidence Label */}
                      {(() => {
                        let label = '';
                        let color = '';
                        if (item.matchPercentage >= 90) {
                          label = 'Very Strong Match';
                          color = 'text-green-600 bg-green-100';
                        } else if (item.matchPercentage >= 70) {
                          label = 'Potential Match';
                          color = 'text-orange-600 bg-orange-100';
                        } else {
                          label = 'Weak Match';
                          color = 'text-gray-600 bg-gray-100';
                        }
                        return (
                          <div className={`inline-block px-3 py-1 rounded-full font-semibold mb-1 text-sm sm:text-base ${color}`}
                            title={`This match is based on an AI confidence score of ${item.matchPercentage}%.`}>
                            {label} ({item.matchPercentage}%)
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">Found at</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{item.foundAt}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">Date</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{item.date}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Description</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{item.description}</p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Status</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{item.status}</p>
                      </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <Button
                    onClick={() => onClaim(item.itemNumber)}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 sm:py-3 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Check className="h-4 w-4" />
                    This is My Item
                  </Button>
                  <Button
                    onClick={() => onReject(item.itemNumber)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 py-2 sm:py-3 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <X className="h-4 w-4" />
                    Not My Item
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
