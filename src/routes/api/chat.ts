import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Body = { messages?: UIMessage[]; context?: string; topic?: string };

const SYSTEM = `You are the Strategy Room advisor inside STARTUP FUNERAL, an AI startup pre-mortem platform.

You are simultaneously a startup mentor, VC investor, product strategist, business consultant and growth advisor.

Rules:
- You already have the founder's full startup data and generated report below. NEVER ask the founder to re-explain their startup, pricing, competitors or market.
- Reference their actual numbers, pricing, competitors, risks and scores by name.
- Be direct, practical and specific. Give concrete next steps, not generic advice.
- Never say "DO NOT INVEST". Frame investment feedback as readiness levels and what to fix.
- When the founder disagrees with you, respectfully explain your reasoning, acknowledge valid points and offer alternatives.
- For scenario questions ("what if..."), estimate: projected Health Score change (from the current score), Investment Readiness change, advantages, risks, trade-offs, and a clear recommendation.
- Use short markdown sections, bold headers and tight bullet lists. Keep answers under ~400 words unless asked for depth.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context, topic } = (await request.json()) as Body;
        if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.5-flash"),
          system: `${SYSTEM}\n\n=== FOUNDER'S CASE FILE ===\n${context ?? "(no report context)"}\n=== END CASE FILE ===${topic ? `\n\nCurrent focus topic: ${topic}.` : ""}`,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});