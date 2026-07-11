"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { TutorMessages } from "./TutorMessages";

export function TutorChat() {
  const [inputValue, setInputValue] = useState("");

  const { clearError, error, messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "أهلًا، أنا مساعد وصل. اسألني عن الكورس المناسب لك أو عن درس تريد الرجوع له.",
          },
        ],
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    clearError();
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <TutorMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-card p-5">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm leading-6">
            تعذر تشغيل المساعد الآن. الوضع المجاني يعتمد على البحث المحلي، أما
            الشات الذكي فيحتاج تفعيل مزود AI من الإعدادات.
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <input
            aria-label="رسالتك إلى مساعد وصل"
            className="
              w-full rounded-md border border-input bg-background px-4 py-3
              pl-12 text-base text-foreground transition-all
              placeholder:text-muted-foreground
              focus:border-primary focus:outline-none focus:ring-3
              focus:ring-primary/20 disabled:cursor-not-allowed
              disabled:opacity-50
            "
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ماذا تريد أن تتعلم؟"
            ref={inputRef}
            type="text"
            value={inputValue}
          />
          <button
            aria-label="إرسال الرسالة"
            className="
              -translate-y-1/2 absolute top-1/2 left-2 rounded-md bg-primary
              p-2.5 text-primary-foreground transition-colors
              hover:bg-primary/90 disabled:cursor-not-allowed
              disabled:opacity-50
            "
            disabled={isLoading || !inputValue.trim()}
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </button>
        </form>
        <p className="mt-3 text-center text-muted-foreground text-xs">
          الإجابات للمساعدة التعليمية وليست بديلًا عن متابعة الدروس.
        </p>
      </div>
    </div>
  );
}
