import { defineSchema } from "@portabletext/editor";

// يطابق بنية حقل محتوى الدرس في Sanity بدون تغيير شكل البيانات المخزنة.
export const schemaDefinition = defineSchema({
  styles: [
    { name: "normal", title: "نص عادي" },
    { name: "h1", title: "عنوان 1" },
    { name: "h2", title: "عنوان 2" },
    { name: "h3", title: "عنوان 3" },
    { name: "h4", title: "عنوان 4" },
    { name: "blockquote", title: "اقتباس" },
  ],

  decorators: [
    { name: "strong", title: "غامق" },
    { name: "em", title: "مائل" },
    { name: "underline", title: "تحته خط" },
    { name: "strike-through", title: "مشطوب" },
    { name: "code", title: "كود" },
  ],

  lists: [
    { name: "bullet", title: "قائمة نقطية" },
    { name: "number", title: "قائمة مرقمة" },
  ],

  annotations: [
    {
      name: "link",
      title: "رابط",
      fields: [
        {
          name: "href",
          title: "الرابط",
          type: "string",
        },
      ],
    },
  ],

  blockObjects: [
    {
      name: "image",
      title: "صورة",
      fields: [
        {
          name: "asset",
          title: "الملف",
          type: "object",
        },
        {
          name: "caption",
          title: "الوصف",
          type: "string",
        },
        {
          name: "alt",
          title: "النص البديل",
          type: "string",
        },
      ],
    },
  ],

  inlineObjects: [],
});
