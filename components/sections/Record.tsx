import { experience } from "@/content/profile";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Months since year 0, so roles can be placed on one axis. */
function monthIndex(label: string, now: Date) {
  if (label === "Present") return now.getFullYear() * 12 + now.getMonth();
  const [mon, year] = label.split(" ");
  return Number(year) * 12 + MONTHS.indexOf(mon);
}

/**
 * Months in production: a timeline plot of every role on one date axis, and beside it the slip that adds
 * up to the total. Everything is computed from the role dates in content/profile.ts at build time, so
 * the plot and the slip always agree.
 */
export function Record() {
  const now = new Date();
  const rows = experience
    .map((job) => {
      const start = monthIndex(job.start, now);
      const end = monthIndex(job.end, now);
      return {
        label: job.company.replace(/ (LLC|Pvt\. Ltd\.)$/, ""),
        group: /intern/i.test(job.role) ? "Internships" : "Full-time roles",
        start,
        end,
        // Both the first and the last month count.
        months: end - start + 1,
      };
    })
    .sort((a, b) => a.start - b.start);
  const total = rows.reduce((sum, r) => sum + r.months, 0);
  const groups = ["Full-time roles", "Internships"].map((name) => ({ name, rows: rows.filter((r) => r.group === name).reverse() }));
  const asOf = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // The axis runs from January of the first year to the end of the current month.
  const axisStart = Math.floor(rows[0].start / 12) * 12;
  const axisEnd = monthIndex("Present", now) + 1;
  const span = axisEnd - axisStart;
  const pct = (m: number) => `${((m - axisStart) / span) * 100}%`;
  const years: number[] = [];
  for (let y = axisStart / 12; y * 12 < axisEnd; y++) years.push(y);

  return (
    <section aria-labelledby="record-heading" className="ink-field">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pt-32 lg:pb-36">
        <div data-reveal className="lg:col-span-7">
          <h2 id="record-heading" className="condensed part-title">
            Months in production
          </h2>
          <p className="mt-5 max-w-[44ch]">
            Every month I have spent writing code that real users run, from my first internship to today: {total}{" "}
            months, as of {asOf}.
          </p>

          <figure className="mt-14">
            <figcaption className="sr-only">
              Timeline of roles: {rows.map((r) => `${r.label}, ${r.months} months`).join(". ")}.
            </figcaption>
            <div aria-hidden="true" className="space-y-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <p className="num flex justify-between gap-3 text-step-0">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-muted">{r.months} months</span>
                  </p>
                  <div className="relative mt-1.5 h-4 bg-surface">
                    <div className="absolute inset-y-0 bg-accent" style={{ left: pct(r.start), width: pct(axisStart + r.months) }} />
                  </div>
                </div>
              ))}
              <div className="num relative h-6 text-step-0 text-muted">
                {years.map((y) => (
                  <span key={y} className="absolute top-1 -translate-x-0" style={{ left: pct(y * 12) }}>
                    {y}
                  </span>
                ))}
              </div>
            </div>
          </figure>
        </div>

        <div data-reveal className="lg:col-span-4 lg:col-start-9">
          <div className="edge-zigzag num bg-sheet px-6 pt-7 pb-6 text-step-1 text-[var(--page-ink)] [--edge:var(--sheet)]">
            {groups.map((g) => (
              <div key={g.name} className="mb-6">
                <p className="font-bold">{g.name}</p>
                <ul className="mt-2 space-y-2">
                  {g.rows.map((r) => (
                    <li key={r.label} className="flex items-baseline gap-2">
                      <span>{r.label}</span>
                      <span aria-hidden="true" className="mb-1 flex-1 border-b-4 border-dotted border-[var(--page-muted)]" />
                      <span>{r.months}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="flex items-baseline justify-between bg-[var(--page-ink)] px-3 py-2.5 font-bold text-[var(--sheet)]">
              <span>Total</span>
              <span>{total} months</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
