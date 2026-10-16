// Dev helper: print the top retrieved chunks for a few queries.
import { retrieve } from "@/lib/rag/retrieve";

const queries = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "Where does Saif work now and what did he build there?",
      "Is he open to remote roles?",
      "What is the p95 latency of InsightFlow?",
      "Has he used Kubernetes?",
      "What did he do at Ayanlabs?",
      "How can I contact him?",
    ];

async function main() {
  for (const q of queries) {
    const hits = await retrieve(q);
    console.log(`\n${q}\n  ${hits.map((h) => h.id).join("\n  ")}`);
  }
}
main();
