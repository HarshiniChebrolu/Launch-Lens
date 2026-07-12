"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { StartupReport } from "@/types/report";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Improve my MVP",
  "Reduce development cost",
  "Improve business model",
  "Give investor questions",
  "Suggest marketing strategy",
];

export default function CopilotPanel({ report }: { report: StartupReport }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I am your Launch Lens Copilot. Ask me anything about this startup report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(question?: string) {
    const text = question || input;
    if (!text.trim()) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report, question: text, messages: nextMessages }),
      });

      const json = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: json.answer || "I could not generate an answer.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="copilotPanel">
      <div className="copilotHeader">
        <span>
          <Sparkles size={16} />
          Launch Lens Copilot
        </span>
        <p>Ask follow-up questions about this startup.</p>
      </div>

      <div className="suggestionChips">
        {suggestions.map((item) => (
          <button key={item} onClick={() => ask(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="chatBox">
        {messages.map((msg, index) => (
          <div key={index} className={`chatBubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {busy && <div className="chatBubble assistant">Thinking...</div>}
      </div>

      <div className="copilotInput">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask how to improve this startup..."
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
        />

        <button onClick={() => ask()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}