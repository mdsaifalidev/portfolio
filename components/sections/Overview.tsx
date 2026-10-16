// The datasheet's features: four results from production systems, each traceable to a role below.
const features = [
  { value: "~30%", note: "less manual information retrieval, multi-tenant RAG platform" },
  { value: "-20%", note: "p95 REST API latency in production, from indexing and query work" },
  { value: "6+", note: "microservices over RabbitMQ, shipped to Kubernetes on AWS EKS" },
  { value: "80%+", note: "test coverage, with ~60% less manual release effort" },
];

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="mx-auto max-w-[90rem] px-5 pt-28 pb-28 sm:px-8 lg:px-12 lg:pt-36 lg:pb-36">
      <div data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="overview-heading" className="condensed part-title lg:col-span-7">
          Measured, not claimed
        </h2>
        <p className="max-w-[34ch] lg:col-span-3 lg:col-start-10">
          Four results from production systems I designed or shipped. Each one comes from a role below and from my
          resume.
        </p>
      </div>

      <div data-reveal className="mt-16 lg:mt-20">
        <table className="w-full border-collapse bg-surface text-left">
          <caption className="sr-only">Features: measured results</caption>
          <tbody>
            {features.map((f) => (
              <tr key={f.value} className="border-b border-border last:border-0" /* real table rows, taste-skill-ignore */>
                <td className="num px-5 py-5 align-baseline text-step-3 leading-none font-bold tracking-[-0.03em]">{f.value}</td>
                <th scope="row" className="px-5 py-5 align-baseline text-step-1 font-normal sm:text-step-2 sm:leading-tight">
                  {f.note}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
