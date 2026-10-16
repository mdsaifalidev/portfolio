// Dev helper: time a direct streamText call to the configured chat model.
import { streamText } from "ai";
import { CHAT_MODEL, google } from "@/lib/rag/gemini";

async function main() {
  const model = process.argv[2] || CHAT_MODEL;
  const level = process.argv[3];
  const t0 = Date.now();
  const result = streamText({
    model: google()(model),
    prompt: "In one sentence: what is retrieval-augmented generation?",
    maxOutputTokens: 200,
    ...(level && { providerOptions: { google: { thinkingConfig: { thinkingLevel: level } } } }),
    timeout: 45_000,
  });
  let first = 0;
  let text = "";
  for await (const part of result.stream) {
    if (part.type === "text-delta") {
      first ||= Date.now() - t0;
      text += part.text ?? (part as { delta?: string }).delta ?? "";
    } else if (part.type === "error") {
      console.log("ERROR", part.error);
    } else if (part.type !== "text-start" && part.type !== "text-end") {
      console.log("part:", part.type);
    }
  }
  console.log(`${model} level=${level ?? "default"} first-token=${first}ms total=${Date.now() - t0}ms\n${text}`);
}
main().catch((e) => console.error("FAILED", e?.message ?? e));
