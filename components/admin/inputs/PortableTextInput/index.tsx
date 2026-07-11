"use client";

import {
  EditorProvider,
  keyGenerator,
  type PortableTextBlock,
  PortableTextEditable,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImage } from "@/lib/actions/images";
import {
  renderAnnotation,
  renderBlock,
  renderDecorator,
  renderListItem,
  renderStyle,
} from "./renderFunctions";
import { schemaDefinition } from "./schema";
import { Toolbar } from "./Toolbar";

interface PortableTextInputProps extends DocumentHandle {
  path: string;
  label: string;
}

function PortableTextInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  );
}

function PortableTextInputField({
  path,
  label,
  ...handle
}: PortableTextInputProps) {
  const { data: contentData } = useDocument<PortableTextBlock[] | null>({
    ...handle,
    path,
  });
  const editContent = useEditDocument<PortableTextBlock[] | null>({
    ...handle,
    path,
  });

  const [editorKey, setEditorKey] = useState(0);

  // يمنع إعادة تركيب المحرر أثناء الكتابة، ويتركها للتغييرات الخارجية فقط.
  const pendingMutationCountRef = useRef(0);
  const lastContentLengthRef = useRef<number | null>(null);

  useEffect(() => {
    const currentLength = contentData?.length ?? 0;
    const lastLength = lastContentLengthRef.current;

    if (pendingMutationCountRef.current > 0) {
      pendingMutationCountRef.current--;
      lastContentLengthRef.current = currentLength;
      return;
    }

    if (lastLength !== null && lastLength !== currentLength) {
      setEditorKey((k) => k + 1);
    }

    lastContentLengthRef.current = currentLength;
  }, [contentData]);

  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingImageAssetId, setPendingImageAssetId] = useState<string | null>(
    null,
  );

  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if (result.error) {
          setUploadError(result.error);
          return;
        }

        if (result.assetId) {
          setPendingImageAssetId(result.assetId);
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "تعذر رفع الصورة");
      } finally {
        setIsUploading(false);
      }

      e.target.value = "";
    },
    [],
  );

  const handleInsertImage = useCallback(() => {
    if (!pendingImageAssetId) return;

    const currentContent = contentData || [];

    const imageBlock: PortableTextBlock = {
      _type: "image",
      _key: keyGenerator(),
      asset: {
        _type: "reference",
        _ref: pendingImageAssetId,
      },
      caption: imageCaption || undefined,
      alt: imageAlt || undefined,
    } as unknown as PortableTextBlock;

    const idx = insertionIndex ?? currentContent.length;
    const newContent = [
      ...currentContent.slice(0, idx),
      imageBlock,
      ...currentContent.slice(idx),
    ];

    pendingMutationCountRef.current++;
    editContent(newContent);

    setEditorKey((k) => k + 1);

    setShowImageModal(false);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
    setInsertionIndex(null);
  }, [
    pendingImageAssetId,
    imageCaption,
    imageAlt,
    contentData,
    editContent,
    insertionIndex,
  ]);

  const handleOpenImageModal = useCallback((index: number) => {
    setInsertionIndex(index);
    setShowImageModal(true);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
    setInsertionIndex(null);
  }, []);

  const handleMutation = useCallback(
    (event: { type: string; value?: PortableTextBlock[] }) => {
      if (event.type === "mutation" && event.value !== undefined) {
        pendingMutationCountRef.current++;
        editContent(event.value);
      }
    },
    [editContent],
  );

  const initialValue = contentData || undefined;

  return (
    <div className="space-y-2" dir="rtl">
      <Label className="text-foreground">{label}</Label>

      <div className="overflow-hidden rounded-md border bg-card shadow-sm">
        <EditorProvider
          key={editorKey}
          initialConfig={{
            schemaDefinition,
            initialValue,
          }}
        >
          <EventListenerPlugin on={handleMutation} />
          <Toolbar onInsertImage={handleOpenImageModal} />
          <div className="max-h-[500px] min-h-[200px] overflow-y-auto p-4 focus-within:ring-1 focus-within:ring-primary/30">
            <PortableTextEditable
              className="max-w-none outline-none"
              renderStyle={renderStyle}
              renderDecorator={renderDecorator}
              renderBlock={renderBlock}
              renderListItem={renderListItem}
              renderAnnotation={renderAnnotation}
              renderPlaceholder={() => (
                <span className="pointer-events-none text-muted-foreground">
                  ابدأ كتابة محتوى الدرس في وصل...
                </span>
              )}
            />
          </div>
        </EditorProvider>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-md border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                إضافة صورة لمحتوى الدرس
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCloseImageModal}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="إغلاق نافذة إضافة الصورة"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {!pendingImageAssetId ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full cursor-pointer rounded-md border-2 border-dashed bg-transparent p-8 text-center transition-colors hover:border-primary/50 ${
                  isUploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mx-auto mb-2 h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      جاري الرفع...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      اضغط لرفع صورة
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPEG أو PNG أو GIF أو WebP بحد أقصى 10MB
                    </p>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">
                    تم رفع الصورة بنجاح
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      الوصف الظاهر أسفل الصورة (اختياري)
                    </Label>
                    <Input
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="اكتب وصفًا مختصرًا..."
                      className="mt-1 border-input bg-card text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      النص البديل للصورة
                    </Label>
                    <Input
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="صف الصورة للمستخدمين وقارئات الشاشة..."
                      className="mt-1 border-input bg-card text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPendingImageAssetId(null);
                      fileInputRef.current?.click();
                    }}
                    className="flex-1"
                  >
                    اختيار صورة أخرى
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInsertImage}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    إدراج الصورة
                  </Button>
                </div>
              </div>
            )}

            {uploadError && (
              <p className="mt-3 text-sm text-destructive">{uploadError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortableTextInput(props: PortableTextInputProps) {
  return (
    <Suspense fallback={<PortableTextInputFallback label={props.label} />}>
      <PortableTextInputField {...props} />
    </Suspense>
  );
}
