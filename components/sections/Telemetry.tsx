import Link from "next/link";
import { TelemetryPanel } from "@/components/telemetry/TelemetryPanel";

/** The test log: a live count of the visits this page has had, different for every visitor. */
export function Telemetry() {
  return (
    <section id="telemetry" aria-labelledby="telemetry-heading" className="scroll-mt-4 bg-surface">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-28 sm:px-8 lg:px-12 lg:pt-32 lg:pb-36">
        <h2 id="telemetry-heading" data-reveal className="condensed part-title">
          Visitors to this page
        </h2>
        <div className="mt-10">
          <TelemetryPanel />
        </div>
        <p className="mt-12 max-w-[60ch] text-step-0 text-muted">
          Anonymous, country-level counts. No cookies, and IP addresses are never stored.{" "}
          <Link href="/privacy" className="link text-text">
            What is collected
          </Link>
        </p>
      </div>
    </section>
  );
}
