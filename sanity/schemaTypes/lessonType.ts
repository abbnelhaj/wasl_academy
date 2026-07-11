import { PlayIcon } from "@sanity/icons/Play";
import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "video", title: "Video" },
    { name: "content", title: "Content" },
    { name: "access", title: "Access" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required().error("Lesson title is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Lesson slug is required"),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "details",
    }),
    defineField({
      name: "durationMinutes",
      title: "Duration in Minutes",
      type: "number",
      group: "details",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "video",
      title: "Video File",
      type: "mux.video",
      group: ["content", "video"],
      description: "Upload or select a video for this lesson.",
    }),
    defineField({
      name: "content",
      title: "Lesson Content",
      type: "array",
      group: "content",
      description: "Additional lesson content, notes, or resources.",
      of: [
        defineArrayMember({
          type: "block",
        }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description: "Important for accessibility and SEO.",
            }),
          ],
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: "isFreePreview",
      title: "Free Preview",
      type: "boolean",
      group: "access",
      description:
        "Allow visitors to watch this lesson even when the parent course is paid.",
      initialValue: false,
    }),
    defineField({
      name: "completedBy",
      title: "Completed By",
      type: "array",
      group: "completion",
      description: "Clerk user IDs for users who completed this lesson.",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      duration: "durationMinutes",
      isFreePreview: "isFreePreview",
    },
    prepare({ title, duration, isFreePreview }) {
      const previewLabel = isFreePreview ? "Free preview" : "Locked by course";
      const durationLabel = duration ? `${duration} min` : "No duration";

      return {
        title,
        subtitle: `${durationLabel} • ${previewLabel}`,
      };
    },
  },
});
