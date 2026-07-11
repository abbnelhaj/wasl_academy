"use client";

import MuxPlayer from "@mux/mux-player-react";
import MuxUploader from "@mux/mux-uploader-react";
import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { Loader2, RefreshCw, Trash2, Upload, XCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createMuxUploadUrl,
  getMuxSignedTokens,
  getMuxUploadStatus,
} from "@/lib/actions/mux";

interface MuxVideoInputProps extends DocumentHandle {
  path: string;
  label: string;
}

interface MuxVideoAsset {
  _type: "reference";
  _ref: string;
}

interface MuxVideo {
  _type: "mux.video";
  asset?: MuxVideoAsset;
}

interface MuxAssetData {
  playbackId?: string;
  status?: string;
  data?: {
    duration?: number;
    aspect_ratio?: string;
  };
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

type UploadState = "idle" | "uploading" | "processing" | "ready" | "error";

const MUX_UPLOADER_THEME = {
  "--uploader-font-family": "inherit",
  "--uploader-background-color": "transparent",
  "--uploader-border-color": "transparent",
  "--button-background-color": "var(--primary)",
  "--button-hover-background-color":
    "color-mix(in srgb, var(--primary) 88%, var(--foreground))",
  "--button-active-background-color":
    "color-mix(in srgb, var(--primary) 82%, var(--background))",
  "--progress-bar-fill-color": "var(--primary)",
  "--overlay-background-color":
    "color-mix(in srgb, var(--background) 78%, transparent)",
} as React.CSSProperties;

function MuxVideoInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function MuxVideoInputField({ path, label, ...handle }: MuxVideoInputProps) {
  const { data: videoData } = useDocument<MuxVideo>({
    ...handle,
    path,
  });
  const editVideo = useEditDocument<MuxVideo | null>({
    ...handle,
    path,
  });

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [assetData, setAssetData] = useState<MuxAssetData | null>(null);

  const video = videoData as MuxVideo | null;
  const assetRef = video?.asset?._ref;
  const hasVideo = Boolean(assetRef);
  const playbackId = assetData?.playbackId;
  const duration = assetData?.data?.duration;

  useEffect(() => {
    if (assetRef && !assetData) {
      import("@/sanity/lib/client").then(({ client }) => {
        client
          .fetch<MuxAssetData>(`*[_id == $id][0]{ playbackId, status, data }`, {
            id: assetRef,
          })
          .then(setAssetData)
          .catch(console.error);
      });
    }
  }, [assetRef, assetData]);

  async function initializeUpload() {
    setError(null);
    const result = await createMuxUploadUrl();
    if (result.error) {
      setError(result.error);
      return;
    }
    setUploadUrl(result.uploadUrl);
    setUploadId(result.uploadId);
  }

  useEffect(() => {
    async function init() {
      setError(null);
      const result = await createMuxUploadUrl();
      if (result.error) {
        setError(result.error);
        return;
      }
      setUploadUrl(result.uploadUrl);
      setUploadId(result.uploadId);
    }

    if ((!hasVideo || isReplacing) && !uploadUrl) {
      init();
    }
  }, [hasVideo, uploadUrl, isReplacing]);

  useEffect(() => {
    if (playbackId && !tokens) {
      getMuxSignedTokens(playbackId).then((result) => {
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
        }
      });
    }
  }, [playbackId, tokens]);

  function handleUploadStart() {
    setUploadState("uploading");
    setError(null);
  }

  async function handleUploadSuccess() {
    if (!uploadId) return;

    setUploadState("processing");

    const pollInterval = setInterval(async () => {
      const status = await getMuxUploadStatus(uploadId);

      if (status.error) {
        setError(status.error);
        setUploadState("error");
        clearInterval(pollInterval);
        return;
      }

      if (status.status === "ready" && status.sanityAssetId) {
        editVideo({
          _type: "mux.video",
          asset: {
            _type: "reference",
            _ref: status.sanityAssetId,
          },
        });

        setUploadState("ready");
        clearInterval(pollInterval);
      } else if (status.status === "errored") {
        setError("فشلت معالجة الفيديو");
        setUploadState("error");
        clearInterval(pollInterval);
      }
    }, 2000);

    setTimeout(() => clearInterval(pollInterval), 300000);
  }

  function handleUploadError() {
    setError("فشل رفع الفيديو");
    setUploadState("error");
  }

  function handleRemove() {
    editVideo(null);
    setUploadState("idle");
    setUploadUrl(null);
    setUploadId(null);
    setError(null);
    setTokens(null);
    setAssetData(null);
    setIsReplacing(false);
  }

  function handleRetry() {
    setUploadState("idle");
    setUploadUrl(null);
    setUploadId(null);
    setError(null);
    initializeUpload();
  }

  function handleReplace() {
    setIsReplacing(true);
    setUploadUrl(null);
    setUploadId(null);
    initializeUpload();
  }

  function handleCancelReplace() {
    setIsReplacing(false);
    setUploadUrl(null);
    setUploadId(null);
    setUploadState("idle");
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (hasVideo && !isReplacing) {
    return (
      <div className="space-y-3" dir="rtl">
        <Label>{label}</Label>
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="relative">
            {playbackId && tokens ? (
              <MuxPlayer
                playbackId={playbackId}
                tokens={tokens}
                streamType="on-demand"
                autoPlay={false}
                className="w-full aspect-video"
                accentColor="var(--primary)"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="border-t px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  جاهز للدرس
                </span>
                {duration && (
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(duration)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplace}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-3.5 w-3.5 me-1" />
                  استبدال
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 me-1" />
                  إزالة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isReplacing) {
    return (
      <div className="space-y-2" dir="rtl">
        <div className="flex items-center justify-between gap-3">
          <Label>{label}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelReplace}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            إلغاء
          </Button>
        </div>
        <div className="overflow-hidden rounded-md border bg-card">
          {uploadUrl ? (
            <MuxUploader
              endpoint={uploadUrl}
              onUploadStart={handleUploadStart}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              style={MUX_UPLOADER_THEME}
              className="mux-uploader-dark"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mb-2 h-8 w-8 animate-spin" />
              <p className="text-sm">جاري تجهيز الرفع...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (uploadState === "processing") {
    return (
      <div className="space-y-2" dir="rtl">
        <Label>{label}</Label>
        <div className="rounded-md border bg-card p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
            <p className="font-medium text-foreground">
              جاري تجهيز فيديو الدرس...
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              قد تستغرق العملية بضع دقائق
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (uploadState === "error" || error) {
    return (
      <div className="space-y-2" dir="rtl">
        <Label>{label}</Label>
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <XCircle className="mb-3 h-10 w-10 text-destructive" />
            <p className="font-medium text-foreground">تعذر رفع الفيديو</p>
            <p className="mt-1 text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 me-1.5" />
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-md border bg-card">
        {uploadUrl ? (
          <MuxUploader
            endpoint={uploadUrl}
            onUploadStart={handleUploadStart}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            style={MUX_UPLOADER_THEME}
            className="mux-uploader-dark"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
            <p className="text-sm">جاري تجهيز الرفع...</p>
          </div>
        )}
      </div>
      {uploadState === "uploading" && (
        <p className="text-xs text-muted-foreground">
          جاري رفع فيديو الدرس... لا تغلق هذه الصفحة.
        </p>
      )}
    </div>
  );
}

export function MuxVideoInput(props: MuxVideoInputProps) {
  return (
    <Suspense fallback={<MuxVideoInputFallback label={props.label} />}>
      <MuxVideoInputField {...props} />
    </Suspense>
  );
}
