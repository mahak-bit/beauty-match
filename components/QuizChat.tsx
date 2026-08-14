"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

type Path = "skin" | "hair" | "both";

const PATH_OPENERS: Record<Path, string> = {
  skin: "I want help with my skin.",
  hair: "I want help with my hair.",
  both: "I want help with both my skin and my hair.",
};

export default function QuizChat() {
  const [path, setPath] = useState<Path | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function choosePath(p: Path) {
    setPath(p);
    sendMessage({ text: PATH_OPENERS[p] });
  }

  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  // ---- Step 0: path picker ----
  if (!path) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">
          Step 1
        </span>
        <h1 className="font-display text-4xl mt-4 mb-10 text-[var(--ink)]">
          What are you shopping for?
        </h1>
        <div className="grid gap-4">
          <PathButton label="Skin" desc="Cleansers, serums, moisturizers, SPF" onClick={() => choosePath("skin")} />
          <PathButton label="Hair" desc="Shampoo, scalp care, styling, treatments" onClick={() => choosePath("hair")} />
          <PathButton label="Both" desc="Full routine across skin and hair" onClick={() => choosePath("both")} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] bg-[var(--ink)] text-[var(--bg)] rounded-2xl rounded-br-sm px-4 py-3"
                : "mr-auto max-w-[85%] bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl rounded-bl-sm px-4 py-3"
            }
          >
            {m.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="whitespace-pre-wrap leading-relaxed text-sm">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-searchProducts" && part.state === "output-available") {
                const output = part.output as {
                  results: Array<{ id: string; name: string; brandName: string; shortDescription?: string | null }>;
                  count: number;
                };
                return (
                  <div key={i} className="mt-3 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold-deep)]">
                      {output.count} matches found
                    </span>
                    {output.results.slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="block rounded-lg border border-[var(--hairline)] p-3 hover:border-[var(--gold)] transition-colors"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-[var(--muted)]">{p.brandName}</span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1">{p.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
        {status === "streaming" && (
          <div className="mr-auto max-w-[85%] bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl rounded-bl-sm px-4 py-3">
            <span className="font-mono text-xs text-[var(--muted)]">thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          className="flex-1 bg-[var(--surface)] border border-[var(--hairline)] rounded-full px-5 py-3 text-sm text-[var(--ink)] focus:border-[var(--gold)] outline-none"
        />
        <button
          type="submit"
          className="w-11 h-11 rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center hover:bg-[var(--gold-deep)] transition-colors"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function PathButton({
  label,
  desc,
  onClick,
}: {
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-[var(--hairline)] px-6 py-5 hover:border-[var(--gold)] hover:bg-[var(--surface)] transition-colors"
    >
      <div className="font-display italic text-2xl text-[var(--ink)]">{label}</div>
      <div className="text-sm text-[var(--muted)] mt-1">{desc}</div>
    </button>
  );
}
