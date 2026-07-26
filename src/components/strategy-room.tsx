import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const TOPICS = [
  "Pivot Advice",
  "Growth Strategy",
  "Investor Readiness",
  "Competitor Response",
  "Pricing Strategy",
  "Product Roadmap",
  "Hiring Plan",
  "Fundraising",
];

const STARTERS = [
  "What should I fix first this week?",
  "What if I doubled my pricing?",
  "How do I answer my biggest investor objection?",
  "What if I pivoted to a different segment?",
];

function textOf(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

export function StrategyRoom({
  investigationId,
  userId,
  context,
  initialMessages,
}: {
  investigationId: string;
  userId: string;
  context: string;
  initialMessages: UIMessage[];
}) {
  const [topic, setTopic] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const savedIds = useRef(new Set(initialMessages.map((m) => m.id)));

  const { messages, sendMessage, status, error } = useChat({
    id: investigationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages: msgs }) => ({
        body: { messages: msgs, context, topic },
      }),
    }),
    onError: (e) => toast.error(e.message || "The advisor is unavailable right now."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, [investigationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (busy) return;
    const unsaved = messages.filter((m) => !savedIds.current.has(m.id) && textOf(m));
    if (unsaved.length === 0) return;
    unsaved.forEach((m) => savedIds.current.add(m.id));
    void (async () => {
      const { error: dbError } = await supabase.from("strategy_messages").insert(
        unsaved.map((m) => ({
          investigation_id: investigationId,
          user_id: userId,
          role: m.role,
          content: textOf(m),
          topic,
        })),
      );
      if (dbError) {
        unsaved.forEach((m) => savedIds.current.delete(m.id));
        console.error(dbError);
      }
    })();
  }, [messages, busy, investigationId, userId, topic]);

  async function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    await sendMessage({ text: value });
    inputRef.current?.focus();
  }

  return (
    <div className="surface-card flex h-[72vh] flex-col overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b border-border/70 p-4">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(topic === t ? null : t)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              topic === t
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-elevated text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-lg py-10 text-center">
            <h3 className="font-display text-lg font-semibold">Your advisor already read the file</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask anything about strategy, pricing, competitors or fundraising — no need to
              re-explain your startup.
            </p>
            <div className="mt-6 grid gap-2 text-left">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-elevated"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap">{textOf(m)}</p>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none prose-headings:font-display prose-strong:text-foreground">
                  <ReactMarkdown>{textOf(m)}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Thinking through your case file…
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive">Something went wrong. Try sending again.</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(input);
        }}
        className="flex items-end gap-3 border-t border-border/70 p-4"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit(input);
            }
          }}
          placeholder={topic ? `Ask about ${topic.toLowerCase()}…` : "Ask your advisor anything…"}
          maxLength={2000}
          className="max-h-40 min-h-12 resize-none bg-elevated"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} className="size-12 shrink-0 rounded-xl">
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  );
}