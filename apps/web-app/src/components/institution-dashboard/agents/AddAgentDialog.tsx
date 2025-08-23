"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  getLocations,
  type GetLocationsResponse,
  type LocationWithRelations,
} from "@/server/actions/institution/query-locations";
import {
  getAvailableMembers,
  GetAvailableMembersResponse,
  addAgent,
} from "@/server/actions/institution/query-agents";
import { useQuery, useMutation } from "@tanstack/react-query";
// import {}

type LocationType = "building" | "desk" | "office" | "kiosk" | "zone";

/* ------------ Form schema ------------- */
const schema = z.object({
  userClerkId: z.string().min(1, "Member is required"),
  locationId: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof schema>;

/* =========================
   AddAgentDialog
   ========================= */
export function AddAgentDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userClerkId: "",
      locationId: "",
    },
  });

  const {
    data: locationsData,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useQuery<GetLocationsResponse>({
    queryKey: ["locations"],
    queryFn: () => getLocations({ getAll: true }),
  });
  const locations = locationsData?.data?.locations ?? [];

  const {
    data: membersData,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery<GetAvailableMembersResponse>({
    queryKey: ["available-members"],
    queryFn: () => getAvailableMembers(),
  });

  const members = membersData?.data?.members ?? [];

  // Add agent mutation
  const addAgentMutation = useMutation({
    mutationFn: async (data: FormValues) =>
      addAgent({
        userMemberClerkId: data.userClerkId,
        locationId: data.locationId,
      }),
    onSuccess: (response) => {
      const selectedMember = members.find(
        (m) => m.userClerkId === response?.data?.userClerkId
      );
      toast.success("Agent added successfully!", {
        description: `Invitation sent to ${selectedMember?.email || "the selected member"}`,
        duration: 4000,
      });

      // Reset form
      form.reset();

      // Close dialog
      if (isControlled) {
        onOpenChange?.(false);
      } else {
        setInternalOpen(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to add agent", {
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await addAgentMutation.mutateAsync(values);
  };

  return (
    <Dialog
      open={isControlled ? open : internalOpen}
      onOpenChange={isControlled ? onOpenChange! : setInternalOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary text-white rounded-lg flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
          <DialogDescription>
            Add a new staff member to your institution.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Hierarchical Empty States */}
          {membersLoading || locationsLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : membersError || locationsError ? (
            <div className="flex items-center justify-center py-8 text-sm text-red-500">
              Failed to load data. Please try again.
            </div>
          ) : members.length === 0 ? (
            // No members - show only members empty state
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                No available members found
              </div>
              <div className="text-xs text-muted-foreground max-w-xs">
                All organization members are already assigned as agents, or
                there are no members in your organization yet.
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Close dialog and redirect to members page
                  if (isControlled) {
                    onOpenChange?.(false);
                  } else {
                    setInternalOpen(false);
                  }
                  window.location.href = "/institution/members";
                }}
              >
                Invite Members
              </Button>
            </div>
          ) : locations.length === 0 ? (
            // Has members but no locations - show only locations empty state
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                No locations found
              </div>
              <div className="text-xs text-muted-foreground max-w-xs">
                You need to create locations before you can assign agents to
                them.
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Close dialog and redirect to locations page
                  if (isControlled) {
                    onOpenChange?.(false);
                  } else {
                    setInternalOpen(false);
                  }
                  window.location.href = "/institution/locations";
                }}
              >
                Manage Locations
              </Button>
            </div>
          ) : (
            // Both members and locations exist - show the form
            <>
              {/* Member Selection */}
              <div>
                <Label className="mb-1 block">Select Member</Label>
                <Select
                  value={form.watch("userClerkId")}
                  onValueChange={(value) => form.setValue("userClerkId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a member to add as agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem
                        key={member.userClerkId}
                        value={member.userClerkId}
                      >
                        <div className="flex items-center gap-2">
                          {member.avatarUrl && (
                            <Image
                              src={member.avatarUrl}
                              alt={member.name || "User"}
                              className="w-4 h-4 rounded-full"
                              width={16}
                              height={16}
                            />
                          )}
                          <span>{member.name || member.email}</span>
                          {member.email && member.name && (
                            <span className="text-xs text-muted-foreground">
                              ({member.email})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.userClerkId && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.userClerkId.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <Label className="mb-1 block">Location</Label>
                <LocationCombobox
                  locations={locations}
                  value={form.watch("locationId")}
                  onChange={(id) => form.setValue("locationId", id)}
                />
                {form.formState.errors.locationId && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.locationId.message}
                  </p>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (isControlled) {
                  onOpenChange?.(false);
                } else {
                  setInternalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={
                form.formState.isSubmitting ||
                addAgentMutation.isPending ||
                members.length === 0 ||
                locations.length === 0
              }
            >
              {addAgentMutation.isPending ? "Adding..." : "+ Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   LocationCombobox
   - Searchable + Grouped by type
   ========================= */

function LocationCombobox({
  locations,
  value,
  onChange,
}: {
  locations: LocationWithRelations[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo<LocationWithRelations | null>(
    () => locations.find((l) => l.id === value) ?? null,
    [locations, value]
  );

  // Filter by name or building
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((l) => {
      const nameHit = l.name.toLowerCase().includes(q);
      const buildingHit = (l.building?.name || "").toLowerCase().includes(q);
      return nameHit || buildingHit;
    });
  }, [locations, query]);

  const byType: Record<LocationType, LocationWithRelations[]> = useMemo(() => {
    const types: LocationType[] = [
      "building",
      "desk",
      "office",
      "kiosk",
      "zone",
    ];

    // Create a properly typed map for grouping locations by type
    const map: Record<LocationType, LocationWithRelations[]> = types.reduce(
      (acc, t) => {
        acc[t] = [];
        return acc;
      },
      {} as Record<LocationType, LocationWithRelations[]>
    );

    for (const l of filtered) {
      const typeCode = (l.type?.code as LocationType) || "desk";
      if (map[typeCode]) {
        map[typeCode].push(l);
      }
    }

    return map;
  }, [filtered]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected
            ? selected.building
              ? `${selected.building.name} — ${selected.name}`
              : selected.name
            : "Select a location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0">
        {/* Search + List */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search locations (name or building)..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[280px]">
            <CommandEmpty>No locations found.</CommandEmpty>

            {/* Grouped results by type */}
            {(
              ["building", "desk", "office", "kiosk", "zone"] as LocationType[]
            ).map((t) => {
              const items = byType[t];
              if (!items.length) return null;
              return (
                <CommandGroup key={t} heading={t.toUpperCase()}>
                  {items.map((l) => (
                    <CommandItem
                      key={l.id}
                      disabled={l.status === "inactive"}
                      onSelect={() => {
                        onChange(l.id);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="flex w-full items-center gap-2">
                        <span
                          className={`truncate ${l.status === "inactive" ? "opacity-50" : ""}`}
                        >
                          {l.building
                            ? `${l.building.name} — ${l.name}`
                            : l.name}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {l.type?.code || t}
                        </span>
                      </div>
                      {value === l.id && <Check className="ml-2 h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
