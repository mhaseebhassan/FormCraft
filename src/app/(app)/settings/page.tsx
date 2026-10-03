"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert, Sparkles, User, KeyRound, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { initials } from "@/lib/utils";

export default function SettingsPage() {
  const { data } = useSession();
  const toast = useToast();
  const [name, setName] = useState(data?.user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        toast.error("Invalid current password");
        return;
      }
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    if (deleteText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    await fetch("/api/user", { method: "DELETE" });
    await signOut({ callbackUrl: "/?deleted=true" });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Account Settings</h2>
        <p className="text-xs text-[#94a3b8]">
          Manage your personal details, credentials, subscription, and workspace.
        </p>
      </div>

      {/* Profile Card */}
      <Card padding="md">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <User className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Profile Details</h3>
        </div>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 font-mono text-xl font-bold text-violet-200">
            {initials(name || data?.user?.name)}
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
            />
            <Input
              label="Email Address"
              value={data?.user?.email ?? ""}
              readOnly
              helperText="Associated authentication email"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button size="sm" loading={savingProfile} onClick={saveProfile}>
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Security & Password */}
      <Card padding="md">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <KeyRound className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Security & Password</h3>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button size="sm" variant="secondary" loading={savingPassword} onClick={changePassword}>
            Update Password
          </Button>
        </div>
      </Card>

      {/* Subscription Tier */}
      <Card padding="md">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Subscription & Plan</h3>
          </div>
          <Badge variant="cyan">Pro Active</Badge>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>FormCraft Pro Architecture</span>
            </div>
            <p className="mt-1 text-xs text-[#94a3b8]">
              Includes unlimited active forms, custom webhook payloads, CSV exports, and zero branding.
            </p>
          </div>
          <Button size="sm" variant="outline">
            Manage Billing
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="md" className="border-red-500/25 bg-red-950/10">
        <div className="flex items-center gap-2.5 pb-4 border-b border-red-500/20">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-200">Danger Zone</h3>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">Delete Workspace Account</p>
            <p className="text-xs text-[#94a3b8]">
              Permanently delete all forms, response databases, and account tokens.
            </p>
          </div>
          <Button size="sm" variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Permanently Delete Account"
        message="Type DELETE in the box below to permanently remove your account and all associated forms."
        confirmLabel="Confirm Deletion"
        confirmVariant="danger"
        onConfirm={deleteAccount}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteText("");
        }}
      >
        <div className="mt-4">
          <Input
            placeholder="Type DELETE to confirm"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
