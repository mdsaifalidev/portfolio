import { track } from "@vercel/analytics";

/** The custom events the PRD tracks. Keep names stable - they're keys in the Vercel dashboard. */
export type AnalyticsEvent =
  | "resume_download"
  | "chat_open"
  | "chat_message"
  | "contact_submit"
  | "project_link_click"
  | "palette_open";

/** No-op outside Vercel deployments; never throws. */
export function trackEvent(name: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {}
}
