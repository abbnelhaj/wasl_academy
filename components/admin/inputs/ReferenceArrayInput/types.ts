export interface ReferenceArrayInputProps {
  documentId: string;
  documentType: string;
  projectId: string;
  dataset: string;
  path: string;
  label: string;
  referenceType: string;
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
  _key?: string;
}

const UNTITLED_DOCUMENT_LABELS: Record<string, string> = {
  category: "تصنيف بدون عنوان",
  course: "كورس بدون عنوان",
  lesson: "درس بدون عنوان",
  module: "وحدة بدون عنوان",
};

export function getUntitledDocumentLabel(documentType: string) {
  return UNTITLED_DOCUMENT_LABELS[documentType] ?? "عنصر بدون عنوان";
}
