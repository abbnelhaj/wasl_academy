"use client";

import MuxPlayer from "@mux/mux-player-react";
import { VideoOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getMuxSignedTokens } from "@/lib/actions/mux";
import { cn } from "@/lib/utils";

interface MuxVideoPlayerProps {
  playbackId: string | null | undefined;
  title?: string;
  className?: string;
  onEnded?: () => void;
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

export function MuxVideoPlayer({
  playbackId,
  title,
  className,
  onEnded,
}: MuxVideoPlayerProps) {
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [signingError, setSigningError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokens(null);
    setTokenError(null);
    setSigningError(null);

    if (!playbackId) {
      setIsLoading(false);
      return;
    }

    async function fetchTokens() {
      try {
        const result = await getMuxSignedTokens(playbackId as string);
        if (
          result.playbackToken &&
          result.thumbnailToken &&
          result.storyboardToken
        ) {
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          });
        } else if (result.error) {
          setSigningError(result.error);
        }
      } catch {
        setSigningError("تعذر تجهيز صلاحية تشغيل الفيديو.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-md border bg-card shadow-sm",
          className,
        )}
      >
        <div className="px-6 text-center">
          <span className="mx-auto mb-3 flex size-16 items-center justify-center rounded-md bg-primary/10 text-primary">
            <VideoOff className="size-8" />
          </span>
          <p className="text-sm leading-7 text-muted-foreground">
            لم يتم رفع فيديو لهذا الدرس بعد.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-md border bg-card shadow-sm",
          className,
        )}
      >
        <div className="px-6 text-center">
          <span className="mx-auto mb-3 flex size-16 animate-pulse items-center justify-center rounded-md bg-primary/10 text-primary">
            <VideoOff className="size-8" />
          </span>
          <p className="text-sm leading-7 text-muted-foreground">
            نجهّز الفيديو...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-card shadow-sm",
        className,
      )}
    >
      <MuxPlayer
        accentColor="#3b82f6"
        autoPlay={false}
        className="aspect-video w-full overflow-hidden rounded-md bg-black"
        playbackId={playbackId}
        streamType="on-demand"
        tokens={tokens ?? undefined}
        metadata={{
          video_title: title ?? "درس من Wasl Academy",
        }}
        onEnded={onEnded}
        onError={() => {
          setTokenError(signingError ?? "تعذر تشغيل الفيديو حالياً.");
        }}
      />
      {tokenError ? (
        <p className="px-4 py-3 text-sm leading-7 text-muted-foreground">
          {tokenError}
        </p>
      ) : null}
    </div>
  );
}
