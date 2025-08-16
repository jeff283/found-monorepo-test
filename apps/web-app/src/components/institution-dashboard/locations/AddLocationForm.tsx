"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronsUpDown, Check, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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

/* ------------ Row type returned to the table ------------- */
export type NewLocation = {
  id: string;
  locationName: string;
  type: string;
  floor?: string;
  room?: string;
  staffLinked?: string;
  status: "Active" | "Inactive";
};

/* ------------ Form schema ------------- */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["building", "desk", "office", "kiosk", "zone"], {
    error: "Type is required",
  }),
  status: z.enum(["active", "inactive"], {
    error: "Status is required",
  }),
  parentId: z.string().optional(),
  floor: z.string().optional(),
  room: z.string().optional(),
  staffLinked: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

/* ------------ Mock buildings for the parent picker ------------- */
const mockBuildings = [
  { id: "bldg_wilson", name: "Wilson Commons" },
  { id: "bldg_carlson", name: "Carlson Library" },
  { id: "bldg_admin", name: "Administration Block" },
];

export function AddLocationForm({
  onCreated,
}: {
  onCreated: (row: NewLocation) => void;
}) {
  const [buildings, setBuildings] = useState(mockBuildings);

  // toggles for optional fields
  const [showFloor, setShowFloor] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "desk", status: "active" },
  });

  const type = form.watch("type");

  useEffect(() => {
    if (type === "building") form.setValue("parentId", undefined);
  }, [type, form]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!showFloor) form.setValue("floor", undefined);
    if (!showRoom) form.setValue("room", undefined);

    if ((values.type === "desk" || values.type === "office") && !values.parentId) {
      form.setError("parentId", { type: "validate", message: "Parent building is required" });
      return;
    }

    const id = `#${Math.floor(200 + Math.random() * 900)}`;
    const newRow: NewLocation = {
      id,
      locationName: values.name,
      type: values.type,
      floor: values.floor,
      room: values.room,
      staffLinked: values.staffLinked ?? "1 linked",
      status: values.status === "active" ? "Active" : "Inactive",
    };

    onCreated(newRow);

    toast.success("Location created", {
      description:
        values.type === "building"
          ? `Building “${values.name}” added`
          : `Location “${values.name}” added`,
    });

    form.reset({ type: "desk", status: "active" });
    setShowFloor(false);
    setShowRoom(false);
  };

  return (
    <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Name */}
      <div>
        <Label htmlFor="name" className="mb-1 block">Name</Label>
        <Input
          id="name"
          className="h-10 w-full min-w-[220px] sm:min-w-[320px] max-w-lg"
          placeholder={type === "building" ? "e.g. Wilson Commons" : "e.g. Info Desk"}
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">Type</Label>
          <Select
            value={form.watch("type")}
            onValueChange={(v: FormValues["type"]) => form.setValue("type", v)}
          >
            <SelectTrigger className="h-10">
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

        <div>
          <Label className="mb-1 block">Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(v: FormValues["status"]) => form.setValue("status", v)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Parent building (only for desk/office) */}
      {(type === "desk" || type === "office") && (
        <div className="scroll-mt-24">
          <Label className="mb-1 block">Parent building</Label>
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
            <p className="text-xs text-red-500 mt-1">
              {form.formState.errors.parentId.message as string}
            </p>
          )}
        </div>
      )}

      {/* Optional meta – shown only when toggled */}
      <div className="space-y-3">
        {/* Toggle row */}
        <div className="flex flex-wrap gap-2">
          {!showFloor ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowFloor(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add floor
            </Button>
          ) : null}

          {!showRoom ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowRoom(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add room
            </Button>
          ) : null}
        </div>

        {/* Dynamic inputs (appear only when toggled) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showFloor && (
            <div className="min-w-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="floor" className="mb-1 block">Floor</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  onClick={() => {
                    setShowFloor(false);
                    form.setValue("floor", undefined);
                  }}
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
              <Input
                id="floor"
                className="h-10 w-full max-w-xs"
                inputMode="numeric"
                placeholder="e.g. 1"
                {...form.register("floor")}
              />
            </div>
          )}

          {showRoom && (
            <div className="min-w-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="room" className="mb-1 block">Room</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  onClick={() => {
                    setShowRoom(false);
                    form.setValue("room", undefined);
                  }}
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
              <Input
                id="room"
                className="h-10 w-full max-w-xs"
                placeholder="e.g. Circulation"
                {...form.register("room")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 pb-2">
        <Button type="submit" className="bg-primary text-white h-10">
          Save
        </Button>
      </div>
    </form>
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
        <Button variant="outline" role="combobox" className="w-full justify-between h-10">
          {selected ? selected.name : "Select building..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Match trigger width; bump z-index to stay above Sheet overlay */}
      <PopoverContent className="z-[60] p-0 w-[--radix-popover-trigger-width] max-w-[calc(100vw-2rem)]">
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
