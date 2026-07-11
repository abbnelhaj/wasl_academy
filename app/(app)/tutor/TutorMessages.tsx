"use client";

import type { UIMessage } from "ai";
import { CheckCircle2, Loader2, Search, Sparkles, User } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTutor } from "./TutorContext";

interface TutorMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

interface ToolCallPart {
  type: string;
  toolName?: string;
  toolCallId?: string;
  args?: Record<string, unknown>;
  input?: Record<string, unknown>;
  result?: unknown;
  output?: unknown;
  state?: "partial-call" | "call" | "result" | "input-available";
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) {
    return "";
  }

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("\n");
}

function getToolParts(message: UIMessage): ToolCallPart[] {
  if (!message.parts || message.parts.length === 0) {
    return [];
  }

  return message.parts
    .filter((part) => part.type.startsWith("tool-"))
    .map((part) => part as unknown as ToolCallPart);
}

function getToolDisplayName(toolName: string): string {
  const toolNames: Record<string, string> = {
    searchCourses: "البحث في الكورسات",
  };

  return toolNames[toolName] || toolName;
}

function getLineKey(line: string, seenKeys: Map<string, number>) {
  const baseKey = line.trim() || "empty-line";
  const occurrence = seenKeys.get(baseKey) ?? 0;

  seenKeys.set(baseKey, occurrence + 1);

  return `${baseKey}-${occurrence}`;
}

export function TutorMessages({ messages, isLoading }: TutorMessagesProps) {
  return (
    <>
      {messages.map((message) => {
        const content = getMessageText(message);
        const toolParts = getToolParts(message);
        const hasContent = content.length > 0;
        const hasTools = toolParts.length > 0;

        if (!hasContent && !hasTools) {
          return null;
        }

        return (
          <div className="space-y-3" key={message.id}>
            {hasTools &&
              toolParts.map((toolPart, idx) => (
                <ToolCallUI
                  key={`tool-${message.id}-${toolPart.toolCallId ?? idx}`}
                  toolPart={toolPart}
                />
              ))}

            {hasContent && (
              <div
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md",
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-card text-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="size-5" />
                  ) : (
                    <User className="size-5" />
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[85%] rounded-md px-4 py-3 text-base leading-7",
                    message.role === "assistant"
                      ? "border bg-card text-card-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  <MessageContent content={content} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div className="rounded-md border bg-card px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToolCallUI({ toolPart }: { toolPart: ToolCallPart }) {
  const toolName = toolPart.toolName || toolPart.type.replace("tool-", "");
  const displayName = getToolDisplayName(toolName);
  const isComplete =
    toolPart.state === "result" ||
    toolPart.result !== undefined ||
    toolPart.output !== undefined;
  const input = toolPart.args ?? toolPart.input;
  const searchQuery =
    toolName === "searchCourses" && input?.query
      ? String(input.query)
      : undefined;

  return (
    <div className="flex gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <Search className="size-5" />
      </div>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md border px-4 py-3 text-base",
          isComplete
            ? "border-emerald-500/20 bg-emerald-500/10"
            : "border-primary/20 bg-primary/10",
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
        ) : (
          <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
        )}
        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium",
              isComplete ? "text-emerald-700" : "text-primary",
            )}
          >
            {isComplete ? `اكتمل ${displayName}` : `${displayName}...`}
          </span>
          {searchQuery && (
            <span className="text-muted-foreground text-sm">
              البحث عن: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const seenKeys = new Map<string, number>();

  return (
    <div className="space-y-2">
      {lines.map((line) => {
        const trimmedLine = line.trim();
        const lineKey = getLineKey(line, seenKeys);

        if (!trimmedLine) {
          return <div className="h-2" key={lineKey} />;
        }

        if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
          return (
            <p className="flex gap-2" key={lineKey}>
              <span aria-hidden="true">•</span>
              <span>
                <InlineText text={trimmedLine.slice(2)} />
              </span>
            </p>
          );
        }

        return (
          <p key={lineKey}>
            <InlineText text={trimmedLine} />
          </p>
        );
      })}
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  const { closeChat } = useTutor();
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match = markdownLinkPattern.exec(text);

  while (match) {
    const [fullMatch, label, href] = match;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      href.startsWith("/") ? (
        <Link
          className="font-semibold underline underline-offset-4"
          href={href}
          key={`${href}-${match.index}`}
          onClick={closeChat}
        >
          {label}
        </Link>
      ) : (
        <a
          className="font-semibold underline underline-offset-4"
          href={href}
          key={`${href}-${match.index}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {label}
        </a>
      ),
    );

    lastIndex = match.index + fullMatch.length;
    match = markdownLinkPattern.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
