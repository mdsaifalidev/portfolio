"use client";

import { CheckCircle2, Send, TriangleAlert } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { sendContact, type ContactField, type ContactState } from "@/app/actions/contact";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MAX_MESSAGE = 2000;
const initial: ContactState = { status: "idle" };

const inputClass =
  "mt-2 block w-full border-b-2 border-transparent bg-surface px-4 py-3 text-step-1 text-text placeholder:text-muted focus:border-accent focus:outline-none aria-invalid:border-warn";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: ContactField;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`contact-${id}`} className="font-semibold text-text">
        {label}
      </label>
      {children}
      {error && (
        <p id={`contact-${id}-error`} className="mt-1.5 text-step-0 font-semibold text-warn">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const [messageLength, setMessageLength] = useState(0);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") trackEvent("contact_submit");
  }, [state]);

  const describedBy = (id: ContactField) => (errors[id] ? `contact-${id}-error` : undefined);

  return (
    // React resets the form after each action; inputs fall back to `defaultValue`, which echoes
    // the visitor's text after an error and is empty after success.
    <form action={action} onReset={(e) => {
        const message = e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement | null;
        setMessageLength(message?.defaultValue.length ?? 0);
      }} noValidate className="space-y-6">

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            enterKeyHint="next"
            required
            maxLength={100}
            defaultValue={state.values?.name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            enterKeyHint="next"
            required
            maxLength={200}
            defaultValue={state.values?.email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE}
          defaultValue={state.values?.message}
          onChange={(e) => setMessageLength(e.target.value.length)}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          placeholder="What role or project do you have in mind?"
          className={cn(inputClass, "resize-y")}
        />
        <p className="num mt-1.5 text-right text-step-0 text-muted">
          {messageLength}/{MAX_MESSAGE}
        </p>
      </Field>

      {/* Honeypot - hidden from people and assistive tech; bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"> {/* off-screen honeypot, taste-skill-ignore */}
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="pressable inline-flex min-h-12 items-center gap-2 bg-accent px-6 font-semibold text-accent-ink hover:opacity-90 disabled:opacity-60"
        >
          <Send className="size-4" aria-hidden="true" />
          {pending ? "Sending..." : "Send message"}
        </button>

        <p role="status" aria-live="polite">
          {state.status === "success" && (
            <span className="inline-flex items-center gap-1.5 text-accent">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {state.message}
            </span>
          )}
          {state.status === "error" && (
            <span className="inline-flex items-center gap-1.5 text-warn">
              <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
              {state.message}
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
