"use server";

import { projectTypes } from "@/content/services";
import { site } from "@/content/site";
import { fields, type ContactState, type Field } from "./state";

const MIN_FILL_MS = 3000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates an inquiry and forwards it to CONTACT_WEBHOOK_URL as JSON.
 *
 * Delivery is deliberately an integration boundary: point the webhook at
 * Zapier/Make, a CRM, Slack, or a route that sends email. Until it is set,
 * the visitor is told plainly that the inquiry was NOT delivered.
 */
export async function submitInquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    fields.map((f) => [f, String(formData.get(f) ?? "").trim().slice(0, 4000)]),
  ) as Record<Field, string>;

  // Spam: a hidden field people never see, and a minimum time to fill the form.
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "failed", message: "That didn't go through. Please wait a moment and send it again.", values };
  }

  const errors: Partial<Record<Field, string>> = {};
  if (!values.name) errors.name = "Enter your name.";
  if (!values.email) errors.email = "Enter your work email.";
  else if (!EMAIL.test(values.email)) errors.email = "Enter an email address like name@company.com.";
  if (!projectTypes.some((t) => t.value === values.projectType)) errors.projectType = "Choose a project type.";
  if (values.description.length < 20)
    errors.description = "Tell us a little more about the project — a couple of sentences is enough.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "invalid",
      message: `${Object.keys(errors).length === 1 ? "One field needs" : "Some fields need"} attention before sending.`,
      errors,
      values,
    };
  }

  const fallback = site.contactEmail ? ` Email ${site.contactEmail} instead.` : "";
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_WEBHOOK_URL is not set; inquiry not delivered:", values);
    }
    return {
      status: "unconfigured",
      message: `Your inquiry was not sent: online inquiries aren't connected yet.${fallback}`,
      values,
    };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, submittedAt: new Date().toISOString(), source: site.url }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return {
      status: "failed",
      message: `Your inquiry couldn't be delivered. Please try again in a minute.${fallback}`,
      values,
    };
  }

  return {
    status: "sent",
    message: "Inquiry sent. We'll reply by email with next steps.",
  };
}
