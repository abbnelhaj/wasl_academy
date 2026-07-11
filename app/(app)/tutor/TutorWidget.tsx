"use client";

import { useAuth } from "@clerk/nextjs";
import { MessageCircle, PanelRightClose, Sparkles } from "lucide-react";
import { TutorChat } from "./TutorChat";
import { TutorProvider, useTutor } from "./TutorContext";

function TutorPanel() {
  const { isOpen, closeChat, toggleChat } = useTutor();

  return (
    <>
      {/* Backdrop */}
      <button
        aria-label="إغلاق المساعد"
        className={`
          fixed inset-0 z-40 cursor-default bg-foreground/20 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={closeChat}
        type="button"
      />

      {/* Slide-out Panel */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-[440px]
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        dir="rtl"
      >
        <div
          className="
            flex h-full w-full flex-col border-l border-border bg-background
            shadow-2xl
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between border-b border-border bg-card
              px-5 py-4
            "
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <span className="-bottom-0.5 -right-0.5 absolute size-3 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  مساعد وصل
                </h3>
                <p className="text-muted-foreground text-sm">
                  اسأل عن الكورسات والدروس
                </p>
              </div>
            </div>
            <button
              aria-label="إغلاق المساعد"
              className="
                rounded-md p-2.5 text-muted-foreground transition-colors
                hover:bg-muted hover:text-foreground
              "
              onClick={closeChat}
              type="button"
            >
              <PanelRightClose className="size-5" />
            </button>
          </div>

          {/* Chat Content - Takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <TutorChat />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        aria-label="فتح مساعد وصل"
        className={`
          group fixed right-6 bottom-6 z-50 flex size-14 items-center
          justify-center rounded-full bg-primary text-primary-foreground
          shadow-lg shadow-primary/20 transition-all duration-300
          hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25
          ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        `}
        onClick={toggleChat}
        type="button"
      >
        <MessageCircle className="size-6 transition-transform group-hover:scale-110" />
      </button>
    </>
  );
}

export function TutorWidget() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <TutorProvider>
      <TutorPanel />
    </TutorProvider>
  );
}
