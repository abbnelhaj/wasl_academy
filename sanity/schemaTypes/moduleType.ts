import { FolderIcon } from "@sanity/icons/Folder"
import { defineArrayMember, defineField, defineType } from "sanity"

export const moduleType = defineType({
  name: "module",
  title: "Module",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().error("Module title is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Module slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      description: "Lessons in the order they should appear inside the module.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "lesson" }],
        }),
      ],
      validation: (Rule) =>
        Rule.unique().warning("Each lesson can only appear once in a module"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      lessons: "lessons",
    },
    prepare({ title, lessons }) {
      const lessonCount = lessons?.length ?? 0

      return {
        title,
        subtitle: `${lessonCount} ${lessonCount === 1 ? "lesson" : "lessons"}`,
      }
    },
  },
})
