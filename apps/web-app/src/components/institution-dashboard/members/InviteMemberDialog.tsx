"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  inviteMember,
  InviteMemberResponse,
} from "@/server/actions/institution/query-members";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* =========================
   InviteMemberDialog
   ========================= */

// Simple schema without domain validation (handled on backend)
const schema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["org:member", "org:admin"]),
});

type FormValues = z.infer<typeof schema>;

export function InviteMemberDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";

  const queryClient = useQueryClient();
  const { user } = useUser();

  // Get email domain from current user
  const emailDomain = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    return email ? email.split("@")[1] : null;
  }, [user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: "org:member",
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async (data: FormValues) => inviteMember(data),
    onSuccess: (response: InviteMemberResponse) => {
      if (response.success) {
        const message = response.data?.invited
          ? `Invitation sent to ${form.getValues("email")}`
          : `${form.getValues("email")} has been added to the organization`;

        toast.success("Member invited successfully!", {
          description: message,
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

        // Invalidate queries to refresh the members list
        queryClient.invalidateQueries({ queryKey: ["members"] });
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
      } else {
        toast.error("Failed to invite member", {
          description: response.error,
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to invite member", {
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await inviteMemberMutation.mutateAsync(values);
  };

  return (
    <Dialog
      open={isControlled ? open : internalOpen}
      onOpenChange={isControlled ? onOpenChange! : setInternalOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary text-white rounded-lg flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a new member to your organization. They will receive an email
            invitation to join.
          </DialogDescription>
        </DialogHeader>

        {emailDomain && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800 font-medium">
                Domain Restriction
              </p>
            </div>
            <p className="text-sm text-blue-700 mt-1 ml-4">
              Only users with{" "}
              <span className="font-semibold">@{emailDomain}</span> email
              addresses can be invited to this organization.
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-1 block">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={
                emailDomain
                  ? `Enter @${emailDomain} email address`
                  : "Enter email address"
              }
              className="w-full"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label className="mb-1 block">Role</Label>
            <Select
              value={form.watch("role")}
              onValueChange={(value) =>
                form.setValue("role", value as "org:member" | "org:admin")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="org:member">Member</SelectItem>
                <SelectItem value="org:admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

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
                form.formState.isSubmitting || inviteMemberMutation.isPending
              }
            >
              {inviteMemberMutation.isPending
                ? "Inviting..."
                : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
