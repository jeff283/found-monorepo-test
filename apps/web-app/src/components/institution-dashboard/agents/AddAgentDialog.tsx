"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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


type LocationType = "building" | "desk" | "office" | "kiosk" | "zone";

type Location = {
  id: string;
  name: string;                
  type: LocationType;
  building?: string;           
  parentId?: string;            
  status?: "active" | "inactive";
};

// Mock Data
const seedLocations: Location[] = [
  { id: "bldg_wilson", name: "Wilson Commons", type: "building", status: "active" },
  { id: "desk_wilson_info", name: "Info Desk", type: "desk", building: "Wilson Commons", parentId: "bldg_wilson", status: "active" },

  { id: "bldg_carlson", name: "Carlson Library", type: "building", status: "active" },
  { id: "desk_carlson_circ", name: "Circulation Desk", type: "desk", building: "Carlson Library", parentId: "bldg_carlson", status: "active" },

  { id: "office_lnf", name: "Lost & Found Office", type: "office", building: "Campus Safety", status: "active" },
  { id: "zone_east_gate", name: "East Gate", type: "zone", status: "active" },
  { id: "zone_bus_stop_c", name: "Bus Stop C", type: "zone", status: "active" },
  { id: "kiosk_orient", name: "Orientation Kiosk", type: "kiosk", building: "Main Quad", status: "inactive" }, // example inactive
];

/* =========================
   AddAgentPopover
   ========================= */
export function AddAgentPopover() {
  const [open, setOpen] = useState(false);

  // form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>(seedLocations);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && role && selectedLocationId;

  async function handleSubmit() {
    const payload = {
      email,
      roleAtLocation: role,
      isPrimary: true,
      locationId: selectedLocationId,
    };

    // TODO: POST to your API
    console.log("Submitting Add Staff", payload);
    setOpen(false);

    // Sonner notification
    toast.success("Agent added successfully!", {
      description: `Invitation sent to ${email}`,
      duration: 4000,
    });

    // Clear form state
    setEmail("");
    setRole("");
    setSelectedLocationId(null);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-primary text-white rounded-lg flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Add Staff
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="rounded-xl w-[340px] sm:w-[420px] p-4 shadow-lg space-y-4 border bg-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Add Staff</div>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-w-[320px] sm:min-w-[380px]" // Increased width for better usability
            />
          </div>

          {/* Location combobox (searchable + creatable + grouped) */}
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <LocationCombobox
              locations={locations}
              value={selectedLocationId}
              onCreate={async (draft) => {
                // Simulate API create
                const newId = `loc_${draft.name.toLowerCase().replace(/\s+/g, "_")}`;
                const created: Location = {
                  id: newId,
                  name: draft.type === "building" ? draft.name : draft.name, // same name
                  type: draft.type,
                  building: draft.type === "building" ? undefined : draft.building || undefined,
                  parentId: draft.parentId || undefined,
                  status: "active",
                };
                setLocations((prev) => [...prev, created]);
                return created;
              }}
              onChange={(id) => setSelectedLocationId(id)}
            />
          </div>

          {/* Role select */}
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="clerk">Clerk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-2 gap-2">
          <Button variant="ghost" className="w-1/2" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="w-1/2 bg-primary text-white text-sm disabled:opacity-50"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            + Add Staff
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* =========================
   LocationCombobox
   - Searchable + Grouped by type
   - Creatable inline with type & building
   ========================= */
type CreateDraft = {
  name: string;
  type: LocationType;
  building?: string;
  parentId?: string;
};

function LocationCombobox({
  locations,
  value,
  onChange,
  onCreate,
}: {
  locations: Location[];
  value: string | null;
  onChange: (value: string) => void;
  onCreate: (draft: CreateDraft) => Promise<Location>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // mini create panel state
  const [createOpen, setCreateOpen] = useState(false);
  const [draftType, setDraftType] = useState<LocationType>("desk");
  const [draftName, setDraftName] = useState("");
  const [draftBuilding, setDraftBuilding] = useState<string>("");
  const [draftParentId, setDraftParentId] = useState<string>("");

  const selected = useMemo(
    () => locations.find((l) => l.id === value) ?? null,
    [locations, value]
  );

  // Filter by name or building
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((l) => {
      const nameHit = l.name.toLowerCase().includes(q);
      const buildingHit = (l.building || "").toLowerCase().includes(q);
      return nameHit || buildingHit;
    });
  }, [locations, query]);

  const byType: Record<LocationType, Location[]> = useMemo(() => {
    const types: LocationType[] = ["building", "desk", "office", "kiosk", "zone"];
    const map = Object.fromEntries(types.map((t) => [t, [] as Location[]])) as Record<LocationType, Location[]>;
    for (const l of filtered) map[l.type].push(l);
    return map;
  }, [filtered]);

  const canCreate = query.trim().length > 0 && !locations.some((l) =>
    (l.name.toLowerCase() === query.trim().toLowerCase()) &&
    // if desk/office and user typed a building prefix, we still let them create
    true
  );

  async function handleCreateSave() {
    const draft: CreateDraft = {
      name: draftName || query.trim(),
      type: draftType,
      building: draftType === "building" ? undefined : draftBuilding || undefined,
      parentId: draftParentId || undefined,
    };
    const created = await onCreate(draft);
    // Show toast for location creation
    toast.success(`Location "${created.name}" created successfully!`);
    // select it
    onChange(created.id);
    // reset and close
    setCreateOpen(false);
    setOpen(false);
    setQuery("");
    setDraftName("");
    setDraftBuilding("");
    setDraftParentId("");
    setDraftType("desk");
  }

  // Buildings list for parent selection
  const buildings = locations.filter((l) => l.type === "building");

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setCreateOpen(false); }}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected
            ? (selected.building ? `${selected.building} — ${selected.name}` : selected.name)
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
            {(["building","desk","office","kiosk","zone"] as LocationType[]).map((t) => {
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
                        <span className={`truncate ${l.status === "inactive" ? "opacity-50" : ""}`}>
                          {l.building ? `${l.building} — ${l.name}` : l.name}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {t}
                        </span>
                      </div>
                      {value === l.id && <Check className="ml-2 h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}

            {/* Creatable footer */}
            {canCreate && !createOpen && (
              <CommandGroup>
                <CommandItem
                  className="text-primary"
                  onSelect={() => {
                    setDraftName(query.trim());
                    setCreateOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create “{query.trim()}”
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>

        {/* Inline Create mini-form */}
        {createOpen && (
          <div className="border-t p-3 space-y-2">
            <div className="text-sm font-medium">Create new location</div>

            <div className="space-y-1">
              <label className="text-xs">Name</label>
              <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Info Desk" />
            </div>

            <div className="space-y-1">
              <label className="text-xs">Type</label>
              <Select value={draftType} onValueChange={(v) => setDraftType(v as LocationType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">Building</SelectItem>
                  <SelectItem value="desk">Desk</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="kiosk">Kiosk</SelectItem>
                  <SelectItem value="zone">Zone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Building/parent fields only if not a building */}
            {draftType !== "building" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs">Building (text label)</label>
                  <Input
                    value={draftBuilding}
                    onChange={(e) => setDraftBuilding(e.target.value)}
                    placeholder="e.g. Wilson Commons"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs">Parent Building (optional link)</label>
                  <Select
                    value={draftParentId}
                    onValueChange={setDraftParentId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select parent building (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {buildings.map((b) => (
                        <SelectItem value={b.id} key={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                className="w-1/2"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2 bg-primary text-white"
                disabled={!draftName.trim()}
                onClick={handleCreateSave}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
