"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Globe, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { loginSchema } from "@/lib/validations";
import type { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { register, handleSubmit, formState } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    const result = await signIn("credentials", { redirect: false, email: values.email, password: values.password });
    if (result?.error) {
      toast.error("Wrong email or password");
      return;
    }
    toast.success("Welcome back");
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-background md:grid-cols-2">
      <section className="flex flex-col justify-center p-8 md:p-14">
        <div className="max-w-lg">
          <div className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"><span className="grid h-11 w-11 place-items-center rounded-lg bg-primary">F</span>FormCraft</div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Build forms that people actually fill out</h1>
          <div className="mt-8 space-y-4">
            {["Drag-and-drop builder with every field type", "Conversational and classic public forms", "Responses, analytics, exports, and notifications"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-text-secondary"><Sparkles className="h-5 w-5 text-primary" />{item}</div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-white">Log in</h2>
          <p className="mt-2 text-sm text-text-secondary">Continue building and analyzing your forms.</p>
          <Button className="mt-6" fullWidth variant="outline" leftIcon={<Globe className="h-4 w-4" />} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Continue with Google</Button>
          <div className="my-6 flex items-center gap-3 text-xs text-text-secondary"><span className="h-px flex-1 bg-border" />or continue with email<span className="h-px flex-1 bg-border" /></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" leftIcon={<Mail className="h-4 w-4" />} error={formState.errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" leftIcon={<Lock className="h-4 w-4" />} rightIcon={<Eye className="h-4 w-4" />} error={formState.errors.password?.message} {...register("password")} />
            <Button type="submit" fullWidth loading={formState.isSubmitting}>Log in</Button>
          </form>
          <p className="mt-5 text-center text-sm text-text-secondary">No account? <Link href="/register" className="text-indigo-300 hover:text-white">Create one</Link></p>
        </Card>
      </section>
    </main>
  );
}
