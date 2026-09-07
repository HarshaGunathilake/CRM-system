"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState & { sent?: boolean } = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Nimbus CRM</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reset your password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.sent ? (
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-foreground">
              If an account exists for that email, a reset link is on its way.
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@company.com" required autoComplete="email" />
              </div>
              {state.error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
              )}
              <Button type="submit" disabled={pending} className="mt-1 w-full">
                {pending ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
