import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FoundlyButton from "@/components/authentication/FoundlyButton";

interface ReportDetailsFormProps {
  formData: {
    itemName: string;
    category: string;
    dateLost: string;
    locationLastSeen: string;
    location: string;
    detailedDescription: string;
  };
  categories: string[];
  onInputChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ReportDetailsForm({
  formData,
  categories,
  onInputChange,
  onBack,
  onSubmit,
}: ReportDetailsFormProps) {
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

        {/* Form Container */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 md:p-6 space-y-6">
          {/* Row 1: Item Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <Input
                type="text"
                placeholder="Enter Item name"
                value={formData.itemName}
                onChange={(e) => onInputChange("itemName", e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={formData.category} onValueChange={(value) => onInputChange("category", value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="Select a Category " />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Date Lost and Location Last Seen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Lost</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Enter Date Lost"
                  value={formData.dateLost}
                  onChange={(e) => onInputChange("dateLost", e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Last Seen</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter Location Last Seen"
                  value={formData.locationLastSeen}
                  onChange={(e) => onInputChange("locationLastSeen", e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Location and Detailed Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Textarea
                placeholder="Where exactly did you last see the item? (e.g., Terminal 5, Starbucks)"
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                className="bg-white border-gray-200 min-h-[120px] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <Textarea
                placeholder="Describe the item and any unique features."
                value={formData.detailedDescription}
                onChange={(e) => onInputChange("detailedDescription", e.target.value)}
                className="bg-white border-gray-200 min-h-[120px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <FoundlyButton
            as="button"
            type="button"
            onClick={onSubmit}
            className=""
          >
            Submit Report
          </FoundlyButton>
        </div>
      </div>
    </div>
  );
}
