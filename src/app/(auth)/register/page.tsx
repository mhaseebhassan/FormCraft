"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { registerSchema } from "@/lib/validations";
import type { z } from "zod";

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const { register, handleSubmit, formState } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const strength = useMemo(() => [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length, [password]);

  async function onSubmit(values: RegisterValues) {
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      toast.error(body.error ?? "Registration failed");
      return;
    }
    await signIn("credentials", { redirect: false, email: values.email, password: values.password });
    toast.success("Welcome to FormCraft");
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-background md:grid-cols-2">
      <section className="flex flex-col justify-center p-8 md:p-14">
        <div className="max-w-lg">
          <div className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"><span className="grid h-11 w-11 place-items-center rounded-lg bg-primary">F</span>FormCraft</div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Launch forms, collect answers, understand every response</h1>
          <p className="mt-5 text-text-secondary">A focused builder for teams that need polished public forms and clean response operations.</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-white">Create account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input label="Full name" leftIcon={<User className="h-4 w-4" />} error={formState.errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" leftIcon={<Mail className="h-4 w-4" />} error={formState.errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" leftIcon={<Lock className="h-4 w-4" />} rightIcon={<Eye className="h-4 w-4" />} error={formState.errors.password?.message} {...register("password", { onChange: (event) => setPassword(String(event.target.value)) })} />
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((item) => <span key={item} className={cn("h-2 rounded bg-slate-700", item < strength && "bg-primary")} />)}
            </div>
            <Input label="Confirm password" type="password" leftIcon={<Lock className="h-4 w-4" />} error={formState.errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" fullWidth loading={formState.isSubmitting}>Create account</Button>
          </form>
          <p className="mt-5 text-center text-sm text-text-secondary">Already registered? <Link href="/login" className="text-indigo-300 hover:text-white">Log in</Link></p>
        </Card>
      </section>
    </main>
  );
}
