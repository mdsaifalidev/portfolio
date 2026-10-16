import {
  APICallError,
  RetryError,
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { z } from "zod";
import { profile } from "@/content/profile";
import { checkRateLimit, visitorId } from "@/lib/ratelimit";
import { CHAT_MODEL, google, THINKING_LEVEL } from "@/lib/rag/gemini";
import { buildInstructions } from "@/lib/rag/prompt";
import { retrieve } from "@/lib/rag/retrieve";
import { MAX_INPUT_CHARS, type ChatMessage, type Source } from "@/lib/rag/types";

export const maxDuration = 30;

/** Only the latest turns go to the model: enough for follow-ups, bounded cost. */
const HISTORY = 6;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.object({ type: z.string() }).loose()),
      }),
    )
    .min(1)
    .max(100),
});

const DAILY_LIMIT_MESSAGE = `The assistant has reached its daily limit - please try again tomorrow, or email Saif at ${profile.email}.`;
const BUSY_MESSAGE = `The assistant is busy right now - please try again in a minute, or email Saif at ${profile.email}.`;

/** Gemini quota errors (per-minute or per-day) arrive as 429s, possibly wrapped in a RetryError. */
function isQuotaError(err: unknown) {
  const cause = RetryError.isInstance(err) ? err.lastError : err;
  return APICallError.isInstance(cause) && cause.statusCode === 429;
}

// Plain-text errors: the chat transport surfaces the response body as the error message.
const fail = (status: number, message: string) =>
  new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

const textOf = (m: Pick<ChatMessage, "parts">) =>
  m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "That request didn't look right. Please try again.");

  const messages = parsed.data.messages.slice(-HISTORY) as ChatMessage[];
  const userTurns = messages.filter((m) => m.role === "user");
  const question = userTurns.length ? textOf(userTurns[userTurns.length - 1]) : "";
  if (!question) return fail(400, "Please type a question.");
  if (question.length > MAX_INPUT_CHARS) {
    return fail(400, `Please keep questions under ${MAX_INPUT_CHARS} characters.`);
  }

  // The eval script may skip rate limiting, but only outside production.
  const evalBypass =
    process.env.NODE_ENV !== "production" &&
    !!process.env.EVAL_TOKEN &&
    req.headers.get("x-eval-token") === process.env.EVAL_TOKEN;
  const limit = evalBypass ? "ok" : await checkRateLimit(visitorId(req.headers));
  if (limit === "visitor") {
    return fail(
      429,
      `You've asked a lot of questions in a short time - please wait a minute. You can also email Saif at ${profile.email}.`,
    );
  }
  if (limit === "budget") return fail(429, DAILY_LIMIT_MESSAGE);

  // Retrieve with the previous question too, so follow-ups like "tell me more" still find context.
  const query = userTurns.slice(-2).map(textOf).join("\n");
  let context: Awaited<ReturnType<typeof retrieve>>;
  try {
    context = await retrieve(query);
  } catch (err) {
    console.error("[chat] retrieval failed", err);
    return fail(503, `The assistant is unavailable right now. Please email Saif at ${profile.email}.`);
  }
  const sources: Source[] = context.map((c, i) => ({ n: i + 1, title: c.title, url: c.url }));

  const result = streamText({
    model: google()(CHAT_MODEL),
    instructions: buildInstructions(context),
    messages: await convertToModelMessages(messages),
    temperature: 0.2,
    maxOutputTokens: 600,
    // Quota errors don't clear in seconds; one retry covers transient blips without long waits.
    maxRetries: 1,
    providerOptions: { google: { thinkingConfig: { thinkingLevel: THINKING_LEVEL } } },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      messageMetadata: ({ part }) => (part.type === "start" ? { sources } : undefined),
      onError: (err) => {
        console.error("[chat] generation failed", err);
        if (isQuotaError(err)) return BUSY_MESSAGE;
        return `Sorry - I couldn't answer that right now. Please try again, or email Saif at ${profile.email}.`;
      },
    }),
  });
}
