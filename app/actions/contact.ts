"use server";

import { headers } from "next/headers";
import { profile } from "@/content/profile";
import { contactSchema, type ContactField } from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/email";
import { checkContactLimit, visitorId } from "@/lib/ratelimit";

export type { ContactField };

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back on error so the form keeps what the visitor typed. */
  values?: Partial<Record<ContactField, string>>;
};

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never see this field. Pretend it worked so bots don't retry.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "Thanks - your message is on its way." };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  if (!(await checkContactLimit(visitorId(await headers())))) {
    return {
      status: "error",
      message: `You've sent a few messages already - please try again later, or email ${profile.email} directly.`,
      values,
    };
  }

  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("[contact] send failed", err);
    return {
      status: "error",
      message: `Sorry, your message couldn't be sent. Please email ${profile.email} directly.`,
      values,
    };
  }

  return { status: "success", message: "Thanks - your message is on its way. Saif will reply by email." };
}
