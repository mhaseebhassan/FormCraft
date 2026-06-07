"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert, Upload, User } from "lucide-react";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  async function saveProfile() {
    await fetch("/api/user/me", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
    toast.success("Profile updated");
  }
  async function changePassword() {
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    const response = await fetch("/api/user/password", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
    if (!response.ok) { toast.error("Password change failed"); return; }
    toast.success("Password updated");
  }
  async function deleteAccount() {
    if (deleteText !== "DELETE MY ACCOUNT") return;
    await fetch("/api/user", { method: "DELETE" });
    await signOut({ callbackUrl: "/?deleted=true" });
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Settings</h2><p className="text-sm text-text-secondary">Manage profile, password, subscription, and account deletion.</p></div>
      <Card>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white"><User className="h-5 w-5 text-primary" />Profile</h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/20 text-2xl font-bold text-indigo-200">{initials(name || data?.user?.name)}</div>
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>Upload photo</Button>
          <div className="flex-1"><Input label="Name" value={name} onChange={(event) => setName(event.target.value)} /></div>
          <Input label="Email" value={data?.user?.email ?? ""} readOnly helperText="Managed by your sign-in provider when using Google OAuth." />
          <Button onClick={saveProfile}>Save changes</Button>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 font-semibold text-white">Password</h3>
        <div className="grid gap-4 md:grid-cols-4"><Input label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><Input label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><Input label="Confirm new password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /><Button className="self-end" onClick={changePassword}>Save password</Button></div>
      </Card>
      <Card>
        <h3 className="font-semibold text-white">Subscription</h3>
        <p className="mt-2 text-sm text-text-secondary">Current plan: Free. Pro includes unlimited forms, unlimited responses, file uploads, and removal of FormCraft branding.</p>
        <Button className="mt-4">Upgrade to Pro</Button>
      </Card>
      <Card className="border-danger/40">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-red-200"><ShieldAlert className="h-5 w-5" />Danger Zone</h3>
        <p className="text-sm text-text-secondary">Delete Account removes all forms, responses, and notifications.</p>
        <Button className="mt-4" variant="danger" onClick={() => setDeleteOpen(true)}>Delete Account</Button>
      </Card>
      <ConfirmModal isOpen={deleteOpen} title="Delete account" message="Type DELETE MY ACCOUNT in the field behind this modal before confirming. This action is permanent." confirmLabel="Delete Account" confirmVariant="danger" onConfirm={deleteAccount} onCancel={() => setDeleteOpen(false)} />
      {deleteOpen ? <div className="fixed bottom-6 left-1/2 z-[70] w-[min(420px,calc(100vw-32px))] -translate-x-1/2"><Input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="DELETE MY ACCOUNT" /></div> : null}
    </div>
  );
}
