import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const reportSchema = z.object({
  itemName: z.string().min(2, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  dateLost: z
    .string()
    .min(1, "Date lost is required")
    .refine(
      (val) => {
        if (!val) return false;
        const inputDate = new Date(val);
        const today = new Date();
        // Set time to 00:00:00 for both dates to compare only the date part
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return inputDate <= today;
      },
      { message: "Date cannot be in the future" }
    ),
  locationLastSeen: z.string().min(2, "Location last seen is required"),
  location: z.string().min(2, "Location is required"),
  detailedDescription: z.string().min(5, "Description is required"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

// Example backend submission function  
// async function submitReportToBackend(data: ReportFormValues) {
//   try {
//     const response = await fetch('/api/report-lost', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) throw new Error('Failed to submit report');
//     // handle success (e.g., show confirmation)
//   } catch (error) {
//     // handle error (e.g., show error message)
//   }
// }

// Usage: <ReportDetailsForm onSubmit={submitReportToBackend} ... />

export default function ReportDetailsForm({ categories, onBack, onSubmit }: { categories: string[]; onBack: () => void; onSubmit: (data: ReportFormValues) => void; }) {
  const { control, handleSubmit, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      itemName: "",
      category: "",
      dateLost: "",
      locationLastSeen: "",
      location: "",
      detailedDescription: "",
    },
  });

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
              <Controller
                name="itemName"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Item name"
                    className="bg-white border-gray-200"
                    {...field}
                  />
                )}
              />
              {errors.itemName && <p className="text-xs text-red-500 mt-1">{errors.itemName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
          </div>

          {/* Row 2: Date Lost and Location Last Seen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Lost</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Controller
                  name="dateLost"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      placeholder="Enter Date Lost"
                      className="pl-10 bg-white border-gray-200"
                      {...field}
                    />
                  )}
                />
                {errors.dateLost && <p className="text-xs text-red-500 mt-1">{errors.dateLost.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Last Seen</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Controller
                  name="locationLastSeen"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Location Last Seen"
                      className="pl-10 bg-white border-gray-200"
                      {...field}
                    />
                  )}
                />
                {errors.locationLastSeen && <p className="text-xs text-red-500 mt-1">{errors.locationLastSeen.message}</p>}
              </div>
            </div>
          </div>

          {/* Row 3: Location and Detailed Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Where exactly did you last see the item? (e.g., Terminal 5, Starbucks)"
                    className="bg-white border-gray-200 min-h-[120px] resize-none"
                    {...field}
                  />
                )}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <Controller
                name="detailedDescription"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Describe the item and any unique features."
                    className="bg-white border-gray-200 min-h-[120px] resize-none"
                    {...field}
                  />
                )}
              />
              {errors.detailedDescription && <p className="text-xs text-red-500 mt-1">{errors.detailedDescription.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <FoundlyButton
            as="button"
            type="button"
            onClick={handleSubmit(onSubmit)}
            className=""
          >
            Submit Report
          </FoundlyButton>
        </div>
      </div>
    </div>
  );
}
