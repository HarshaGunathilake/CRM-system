"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPasswordAction, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState = {};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

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
          <CardTitle className="text-base">Choose a new password</CardTitle>
          <CardDescription>Your reset link is valid for 1 hour.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="token" value={token} />
            <div className="grid gap-1.5">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" placeholder="At least 8 characters" required autoComplete="new-password" />
            </div>
            {!token && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                This reset link is missing its token. Request a new one.
              </p>
            )}
            {state.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={pending || !token} className="mt-1 w-full">
              {pending ? "Saving..." : "Set new password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
