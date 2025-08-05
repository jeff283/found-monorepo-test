import { ArrowLeft, Check } from "lucide-react";
import FoundlyButton from "@/components/authentication/FoundlyButton";

interface NoMatchScreenProps {
  onBackToDashboard: () => void;
}

// When all the items have been rejected

export default function NoMatchScreen({ onBackToDashboard }: NoMatchScreenProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 sm:px-4 md:px-8 py-4 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-screen-sm sm:max-w-screen-md md:max-w-[900px] lg:max-w-[1100px] p-4 sm:p-6 md:p-10 lg:p-14 space-y-6 sm:space-y-8 text-center">
        {/* Back Navigation */}
        <div className="flex items-center text-left text-sm text-gray-600 cursor-pointer mb-2" onClick={onBackToDashboard}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="font-medium">Report lost</span>
        </div>

        {/* Illustration Placeholder */}
        <div className="w-20 h-20 bg-[#EDF9FA] rounded-lg mx-auto" />

        {/* Main Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">We couldn’t match your item yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            But don’t worry! We’ve saved your report and will alert you if a similar item is found.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <FoundlyButton onClick={onBackToDashboard} className="w-full sm:w-auto px-6">
            Back to Dashboard
            <Check className="ml-2 h-4 w-4" />
          </FoundlyButton>

          <button
            onClick={onBackToDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#EDF9FA] text-cyan-600 font-medium"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
