"use client";

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterDropdown, FilterValues } from "@/components/found-items/FilterDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronDown, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// ---------------- ZOD SCHEMA ----------------
const reportSchema = z.object({
  itemName: z.string().min(2, "Item name is required").max(50, "Max 50 chars"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().max(250, "Max 250 characters").optional(),
  storageRef: z.string().optional(),
  image: z.instanceof(File).optional(),
  claimStatus: z.string().min(1, "Claim status is required"),
});

type ReportForm = z.infer<typeof reportSchema>;

type TableHeaderProps = {
  onFilterApply: (filters: FilterValues) => void;
  onSearch?: (searchTerm: string) => void;
  reportOpen?: boolean;
  setReportOpen?: (open: boolean) => void;
};

export function TableHeader({
  onFilterApply,
  onSearch,
  reportOpen: controlledReportOpen,
  setReportOpen: controlledSetReportOpen,
}: TableHeaderProps) {
  const recordCount = 12;
  const [keepOpen, setKeepOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      itemName: "",
      category: "",
      location: "",
      description: "",
      storageRef: "",
      image: undefined,
      claimStatus: "Unclaimed",
    },
  });

  function onSubmit(values: ReportForm) {
    console.log(values);

    toast.success("Item logged successfully ✅", {
      description: `${values.itemName} has been added to records.`,
    });

    if (keepOpen) {
      form.reset();
    } else {
      form.reset();
      handleDialogOpenChange(false);
    }
  }

  function onError(errors: FieldErrors<ReportForm>) {
    console.error("Validation errors:", errors);

    const firstError = Object.values(errors)[0];
    toast.error("Error: Please check the form", {
      description: firstError?.message || "Some fields are missing or invalid.",
    });
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  }

  // Use controlled state if provided
  const [uncontrolledReportOpen, setUncontrolledReportOpen] = useState(false);
  const dialogOpen =
    typeof controlledReportOpen === "boolean" ? controlledReportOpen : uncontrolledReportOpen;
  const handleDialogOpenChange =
    typeof controlledSetReportOpen === "function" ? controlledSetReportOpen : setUncontrolledReportOpen;

  return (
    <div className="w-full max-w-[1286px] mx-auto mb-4 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title and Count */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Records</h2>
          <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md text-sm">
            {recordCount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
          {/* Search */}
          <form
            className="relative w-full sm:w-64"
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search records"
          >
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search records"
              className="pl-8 pr-3 py-2 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search records"
            />
            <button
              type="submit"
              className="absolute right-2 top-2.5 text-cyan-600 hover:text-cyan-800"
              aria-label="Submit search"
              tabIndex={0}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Sort */}
          <Button
            variant="ghost"
            className="border border-input bg-background text-foreground px-3 flex items-center justify-center"
          >
            Sort by <span className="font-medium ml-1">Recents</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          {/* Filter */}
          <FilterDropdown onApply={onFilterApply} />

          {/* Report Item */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border px-4 flex items-center justify-center"
                onClick={() => handleDialogOpenChange(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Report Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Report Found Item
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="flex flex-col gap-4 mt-3"
              >
                {/* Item Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g. Black Backpack"
                    {...form.register("itemName")}
                  />
                  {form.formState.errors.itemName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.itemName.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category">Item Category</Label>
                  <Select
                    onValueChange={(val) => form.setValue("category", val)}
                    defaultValue={form.getValues("category")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="documents">Documents / IDs</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location">Location Found</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Library, Terminal 5, Starbucks"
                    {...form.register("location")}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details (color, size, unique marks...)"
                    rows={3}
                    maxLength={250}
                    {...form.register("description")}
                  />
                  <span className="text-xs text-muted-foreground">
                    {form.watch("description")?.length || 0}/250 characters
                  </span>
                </div>

                {/* Storage Reference */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="storageRef">Storage Reference (optional)</Label>
                  <Input
                    id="storageRef"
                    placeholder="Locker #12, Shelf B3"
                    {...form.register("storageRef")}
                  />
                </div>

                {/* Keep Open Toggle */}
                <div className="flex items-center gap-2">
                  <Switch checked={keepOpen} onCheckedChange={setKeepOpen} />
                  <Label className="text-sm text-muted-foreground">
                    Check this to submit multiple reports
                  </Label>
                </div>

                <DialogFooter className="mt-2">
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4">
                    Submit Report
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
