"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandInput,
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

export type NewLocation = {
  floor: string;
  type: string;
  id: string;
  locationName: string;
  address?: string;
  state?: string;
  city?: string;
  institutionLinked?: string;
  status: "Active" | "Inactive";
};

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["building", "desk", "office", "kiosk", "zone"]),
  status: z.enum(["active", "inactive"]),
  parentId: z.string().optional(), // only required for desk/office (we’ll validate manually)
  floor: z.string().optional(),
  room: z.string().optional(),
});

// Mock buildings for the parent picker
const mockBuildings = [
  { id: "bldg_wilson", name: "Wilson Commons" },
  { id: "bldg_carlson", name: "Carlson Library" },
  { id: "bldg_admin", name: "Administration Block" },
];

export function AddLocationDialog({
  onCreated,
}: {
  onCreated: (row: NewLocation) => void;
}) {
  const [open, setOpen] = useState(false);
  const [buildings, setBuildings] = useState(mockBuildings);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "desk",
      status: "active",
      parentId: undefined,
      floor: "",
      room: "",
    },
  });

  const watchType = form.watch("type");

  // extra client-side rule: desk/office should have a parent building
  useEffect(() => {
    const t = watchType;
    if (t === "building") form.setValue("parentId", undefined);
  }, [watchType, form]);

  async function onSubmit(values: z.infer<typeof schema>) {
    if ((values.type === "desk" || values.type === "office") && !values.parentId) {
      form.setError("parentId", {
        message: "Parent building is required for this type",
        type: "validate",
      });
      return;
    }

    // MOCK “create” request
    const id = `#${Math.floor(200 + Math.random() * 900)}`;
    const newRow: NewLocation = {
      id,
      locationName:
        values.type === "building" ? values.name : values.name,
      address: "535 W 114th St",
      state: "NY",
      city: "New York",
      institutionLinked: `${1 + (Math.floor(Math.random() * 3))} linked`,
      status: values.status === "active" ? "Active" : "Inactive",
      type: values.type,
      floor: values.floor ?? "",
    };

    // In real life:
    // const res = await fetch("/api/locations", { method: "POST", body: JSON.stringify({...}) })
    // const created = await res.json()

    onCreated(newRow);
    toast.success("Location created", {
      description:
        values.type === "building"
          ? `Building “${values.name}” added`
          : `Location “${values.name}” added under building`,
    });
    setOpen(false);
    form.reset({ type: "desk", status: "active" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
          <DialogDescription>
            Create a location within your institution (building, desk, office, kiosk or zone).
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder={form.getValues("type") === "building" ? "e.g. Wilson Commons" : "e.g. Info Desk"}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(v: LocationType) => form.setValue("type", v)}
            >
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="desk">Desk</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="kiosk">Kiosk</SelectItem>
                <SelectItem value="zone">Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(v: "active" | "inactive") => form.setValue("status", v)}
            >
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Parent (for desk/office) */}
          {(watchType === "desk" || watchType === "office") && (
            <div className="col-span-1 sm:col-span-2">
              <Label>Parent building</Label>
              <BuildingCombobox
                buildings={buildings}
                value={form.watch("parentId") ?? ""}
                onChange={(id) => form.setValue("parentId", id)}
                onCreate={(name) => {
                  const id = `bldg_${name.toLowerCase().replace(/\s+/g, "_")}`;
                  const newBldg = { id, name };
                  setBuildings((prev) => [...prev, newBldg]);
                  form.setValue("parentId", id);
                  toast.success("Building created", { description: `“${name}”` });
                }}
              />
              {form.formState.errors.parentId && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.parentId.message as string}</p>
              )}
            </div>
          )}

          {/* Floor */}
          <div>
            <Label htmlFor="floor">Floor (optional)</Label>
            <Input id="floor" placeholder="e.g. 1" {...form.register("floor")} />
          </div>

          {/* Room */}
          <div>
            <Label htmlFor="room">Room (optional)</Label>
            <Input id="room" placeholder="e.g. Circulation" {...form.register("room")} />
          </div>

          <DialogFooter className="col-span-1 sm:col-span-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white" disabled={form.formState.isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Building Combobox (searchable + creatable) ---------- */

function BuildingCombobox({
  buildings,
  value,
  onChange,
  onCreate,
}: {
  buildings: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  onCreate: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = buildings.find((b) => b.id === value) || null;
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return buildings;
    return buildings.filter((b) => b.name.toLowerCase().includes(s));
  }, [q, buildings]);

  const canCreate =
    q.trim().length > 0 &&
    !buildings.some((b) => b.name.toLowerCase() === q.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected ? selected.name : "Select building..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search building..." value={q} onValueChange={setQ} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {filtered.map((b) => (
                <CommandItem
                  key={b.id}
                  onSelect={() => {
                    onChange(b.id);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  {b.name}
                  {value === b.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}

              {canCreate && (
                <CommandItem
                  className="text-primary"
                  onSelect={() => {
                    onCreate(q.trim());
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create “{q.trim()}”
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
