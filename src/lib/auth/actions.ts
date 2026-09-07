"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "./password";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "./session";
import { logAudit } from "@/lib/audit";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";

const signUpSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export interface AuthFormState {
  error?: string;
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, email, password } = parsed.data;

  const existing = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ name, email: email.toLowerCase(), passwordHash, role: "SALES_REP" })
    .returning();

  const token = await createSessionToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
  await setSessionCookie(token);
  await logAudit({ actorId: user.id, action: "Created", entityType: "User", entity: user.name, severity: "WARNING" });
  await sendWelcomeEmail(user.email, user.name);

  redirect("/dashboard");
}

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
  if (!user) {
    return { error: "Invalid email or password" };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await logAudit({ actorId: user.id, action: "Failed login", entityType: "Session", entity: user.email, severity: "CRITICAL" });
    return { error: "Invalid email or password" };
  }

  const token = await createSessionToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
  await setSessionCookie(token);
  await logAudit({ actorId: user.id, action: "Logged in", entityType: "Session", entity: user.email, severity: "INFO" });

  redirect("/dashboard");
}

export async function signOutAction() {
  const { getSession } = await import("./session");
  const session = await getSession();
  if (session) {
    await logAudit({ actorId: session.userId, action: "Logged out", entityType: "Session", entity: session.email, severity: "INFO" });
  }
  await clearSessionCookie();
  redirect("/sign-in");
}

const forgotPasswordSchema = z.object({ email: z.string().email() });

export async function forgotPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState & { sent?: boolean }> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email.toLowerCase()) });
  // Always report success, even if the account doesn't exist, so this can't be used to enumerate emails.
  if (user) {
    const { createResetToken } = await import("./session");
    const token = await createResetToken(user.id);
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    await sendPasswordResetEmail(user.email, `${baseUrl}/reset-password?token=${token}`);
  }
  return { sent: true };
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { verifyResetToken } = await import("./session");
  const payload = await verifyResetToken(parsed.data.token);
  if (!payload) {
    return { error: "This reset link is invalid or has expired." };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, payload.userId));
  await logAudit({ actorId: payload.userId, action: "Updated", entityType: "User", entity: "password reset", severity: "WARNING" });

  redirect("/sign-in");
}
