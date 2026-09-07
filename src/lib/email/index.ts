import "server-only";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!isSmtpConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends an email via SMTP when credentials are configured in .env. When they
 * are not, the email is logged to the console and saved to
 * .local-emails/<timestamp>-<to>.html so the flow can still be reviewed and
 * tested end-to-end without a real mail provider.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const from = process.env.SMTP_FROM || "CRM <no-reply@crmapp.io>";
  const client = getTransporter();

  if (!client) {
    console.log(`[email:dev-mode] Would send "${subject}" to ${to}`);
    try {
      const dir = path.join(process.cwd(), ".local-emails");
      await fs.mkdir(dir, { recursive: true });
      const fileName = `${Date.now()}-${to.replace(/[^a-z0-9@.]/gi, "_")}.html`;
      await fs.writeFile(path.join(dir, fileName), html, "utf8");
    } catch (err) {
      console.error("Failed to save dev-mode email to disk", err);
    }
    return { delivered: false, mode: "dev-log" as const };
  }

  try {
    await client.sendMail({ from, to, subject, html, text });
    return { delivered: true, mode: "smtp" as const };
  } catch (err) {
    console.error("Failed to send email via SMTP", err);
    return { delivered: false, mode: "error" as const };
  }
}

function emailShell(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px;background:#f4f5f7;font-family:Segoe UI,Arial,sans-serif;color:#1a1d23;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="background:#0f172a;padding:20px 28px;">
        <span style="color:#ffffff;font-size:16px;font-weight:600;">Nimbus CRM</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="font-size:18px;margin:0 0 12px;">${title}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid #e5e7eb;">
        <span style="font-size:12px;color:#6b7280;">You're receiving this because you have an account on Nimbus CRM.</span>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = emailShell(
    `Welcome, ${name}!`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Your Nimbus CRM account has been created. You can sign in any time to manage your leads, contacts, and deals.</p>`
  );
  return sendEmail({
    to,
    subject: "Welcome to Nimbus CRM",
    html,
    text: `Welcome, ${name}! Your Nimbus CRM account has been created.`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = emailShell(
    "Reset your password",
    `<p style="font-size:14px;line-height:1.6;color:#374151;">We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
     <p style="margin:24px 0;"><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Reset password</a></p>
     <p style="font-size:12px;color:#6b7280;">If you didn't request this, you can safely ignore this email.</p>`
  );
  return sendEmail({
    to,
    subject: "Reset your Nimbus CRM password",
    html,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function sendNotificationDigestEmail(to: string, name: string, items: string[]) {
  const html = emailShell(
    `Hi ${name}, here's what's new`,
    `<ul style="font-size:14px;line-height:1.8;color:#374151;padding-left:18px;margin:0;">${items
      .map((i) => `<li>${i}</li>`)
      .join("")}</ul>`
  );
  return sendEmail({
    to,
    subject: "Your Nimbus CRM notification digest",
    html,
    text: items.join("\n"),
  });
}
