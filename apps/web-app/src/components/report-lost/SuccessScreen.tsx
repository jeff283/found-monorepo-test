import { Check, ArrowRight } from "lucide-react";
import FoundlyButton from "@/components/authentication/FoundlyButton";

interface SuccessScreenProps {
  referenceId: string;
  onTrackReport: () => void;
  onReportAnother: () => void;
  onBackToWebsite: () => void;
}

export default function SuccessScreen({
  referenceId,
  onTrackReport,
  onReportAnother,
  onBackToWebsite,
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-2 sm:px-4 md:px-8 py-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-screen-sm sm:max-w-screen-md md:max-w-[900px] lg:max-w-[1100px] p-4 sm:p-6 md:p-10 lg:p-14 space-y-6 sm:space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-100 rounded-full flex items-center justify-center">
            <Check className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Thanks, We&apos;ve filed your lost item alert.</h1>
          <p className="text-gray-500">
            We&apos;ll notify you by email or SMS once
            <br />
            there&apos;s a match.
          </p>
        </div>

        {/* Reference ID */}
        <div className="text-center space-y-1 sm:space-y-2">
          <p className="text-sm text-gray-500">Reference id</p>
          <p className="text-xl font-bold text-gray-900">{referenceId}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <FoundlyButton onClick={onTrackReport} className="w-full">
            Track Report
            {/* <Check className="h-4 w-4" /> */}
          </FoundlyButton>

          <button
            onClick={onReportAnother}
            className="w-full text-cyan-500 hover:text-cyan-600 font-medium flex items-center justify-center gap-2 py-3"
          >
            Report Another Item
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Back to Website */}
        <div className="text-center pt-4">
          <button onClick={onBackToWebsite} className="text-gray-600 hover:text-gray-800 font-medium underline">
            Back to website
          </button>
        </div>
      </div>
    </div>
  );
}
