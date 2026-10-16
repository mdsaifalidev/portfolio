import { capabilities } from "@/content/profile";
import { isVisible } from "@/lib/content";

/**
 * Characteristics, as a datasheet sets them: a real table. Each domain lists what was shipped in it
 * (with a link to the proof) and the tools used.
 */
export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-heading" className="mx-auto max-w-[90rem] scroll-mt-4 px-5 pt-28 pb-28 sm:px-8 lg:px-12 lg:pt-40 lg:pb-36">
      <div data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="capabilities-heading" className="condensed part-title lg:col-span-6">
          Characteristics
        </h2>
        <p className="max-w-[44ch] lg:col-span-5 lg:col-start-8">
          Ten domains, and for each one what I actually shipped in it. Follow a line to the role, project or case
          study that proves it.
        </p>
      </div>

      <div className="mt-14">
        <table className="block w-full border-collapse text-left md:table">
          <thead className="hidden md:table-header-group">
            <tr className="bg-text text-bg">
              <th scope="col" className="w-[24%] px-4 py-3 font-bold">
                Domain
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Shipped
              </th>
              <th scope="col" className="w-[30%] px-4 py-3 font-bold">
                Tools
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {capabilities.map((c) => (
              <tr key={c.domain} className="block border-b border-border py-3 align-top md:table-row md:py-0" /* real table rows, taste-skill-ignore */>
                <th scope="row" className="block px-0 pt-2 pb-2 font-normal md:table-cell md:px-4 md:py-5">
                  <h3 className="font-bold">{c.domain}</h3>
                </th>
                <td className="block px-0 py-1 md:table-cell md:px-4 md:py-5">
                  <ul className="space-y-1.5">
                    {c.evidence.filter(isVisible).map((e) => (
                      <li key={e.text}>
                        {e.href ? (
                          <a
                            href={e.href}
                            {...(e.href.startsWith("http") && { target: "_blank", rel: "noreferrer noopener" })}
                            className="link"
                          >
                            {e.text}
                          </a>
                        ) : (
                          e.text
                        )}
                        {e.draft && <span className="ml-2 text-step-0 font-semibold text-warn">Draft</span>}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="block px-0 pt-2 pb-3 text-muted md:table-cell md:px-4 md:py-5">{c.tools.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
