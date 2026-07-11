"use client";

import {
  type DocumentHandle,
  useDocument,
  useDocumentProjection,
  useDocuments,
  useEditDocument,
} from "@sanity/sdk-react";
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ReferenceInputProps extends DocumentHandle {
  path: string;
  label: string;
  referenceType: string;
  placeholder?: string;
}

interface SanityReference {
  _type: "reference";
  _ref: string;
}

function ReferenceInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function ReferenceOption({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: "{ title }",
  });

  return <>{(data as { title?: string })?.title || "مستند بدون عنوان"}</>;
}

function ReferenceInputField({
  path,
  label,
  referenceType,
  placeholder,
  projectId,
  dataset,
  ...handle
}: ReferenceInputProps) {
  const { data: currentRef } = useDocument<SanityReference | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });
  const editRef = useEditDocument<SanityReference | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });

  const { data: availableDocuments } = useDocuments({
    documentType: referenceType,
    projectId,
    dataset,
  });

  const currentRefId = (currentRef as SanityReference)?._ref ?? "";

  const handleChange = (documentId: string | null) => {
    if (documentId === null || documentId === "__none__") {
      editRef(null);
    } else {
      editRef({
        _type: "reference",
        _ref: documentId,
      });
    }
  };

  return (
    <div className="space-y-2" dir="rtl">
      <Label htmlFor={path}>{label}</Label>
      <Select value={currentRefId || "__none__"} onValueChange={handleChange}>
        <SelectTrigger id={path} className="w-full">
          <SelectValue placeholder={placeholder ?? "اختر..."} />
        </SelectTrigger>
        <SelectContent dir="rtl">
          <SelectItem value="__none__">
            <span className="text-muted-foreground">بدون اختيار</span>
          </SelectItem>
          {availableDocuments?.map((doc) => (
            <SelectItem key={doc.documentId} value={doc.documentId}>
              <Suspense fallback={doc.documentId}>
                <ReferenceOption {...doc} />
              </Suspense>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ReferenceInput(props: ReferenceInputProps) {
  return (
    <Suspense fallback={<ReferenceInputFallback label={props.label} />}>
      <ReferenceInputField {...props} />
    </Suspense>
  );
}
