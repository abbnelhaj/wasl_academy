import { BookIcon } from "@sanity/icons/Book"
import { CreditCardIcon } from "@sanity/icons/CreditCard"
import { UserIcon } from "@sanity/icons/User"
import { defineArrayMember, defineField, defineType } from "sanity"

const accessOptions = [
  { title: "Free", value: "free" },
  { title: "Paid", value: "paid" },
]

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "details", title: "Details", icon: BookIcon, default: true },
    { name: "pricing", title: "Pricing", icon: CreditCardIcon },
    { name: "modules", title: "Modules" },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (Rule) => [
        Rule.required().error("Course title is required"),
        Rule.max(100).warning("Keep course titles concise for better display"),
      ],
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
      validation: (Rule) => Rule.required().error("Course slug is required"),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "details",
      validation: (Rule) =>
        Rule.max(140).warning("Short subtitles work better on course cards"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "details",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      group: "details",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "accessType",
      title: "Access Type",
      type: "string",
      group: "pricing",
      description: "Free courses are open to everyone. Paid courses require a purchase.",
      options: {
        list: accessOptions,
        layout: "radio",
      },
      initialValue: "free",
      validation: (Rule) =>
        Rule.required().error("Choose whether this course is free or paid"),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "pricing",
      description: "Required only for paid courses.",
      hidden: ({ parent }) => parent?.accessType !== "paid",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const accessType = (context.parent as { accessType?: string })?.accessType

          if (accessType !== "paid") {
            return true
          }

          if (typeof value !== "number" || value <= 0) {
            return "Paid courses need a price greater than 0"
          }

          return true
        }),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "pricing",
      hidden: ({ parent }) => parent?.accessType !== "paid",
      options: {
        list: [
          { title: "Saudi Riyal", value: "SAR" },
          { title: "US Dollar", value: "USD" },
        ],
      },
      initialValue: "SAR",
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      group: "pricing",
      description:
        "Later this connects the course to Stripe. Leave it empty while designing content.",
      hidden: ({ parent }) => parent?.accessType !== "paid",
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      group: "modules",
      description: "Course modules in order.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "module" }],
        }),
      ],
      validation: (Rule) => [
        Rule.unique().error("Each module can only appear once in a course"),
        Rule.min(1).warning("Add at least one module to your course"),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      description: "Feature this course on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
      initialValue: "beginner",
    }),
    defineField({
      name: "completedBy",
      title: "Completed By",
      type: "array",
      group: "completion",
      description: "Clerk user IDs for users who completed the entire course.",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      thumbnail: "thumbnail",
      accessType: "accessType",
      price: "price",
      currency: "currency",
      modules: "modules",
      featured: "featured",
    },
    prepare({ title, thumbnail, accessType, price, currency, modules, featured }) {
      const moduleCount = modules?.length ?? 0
      const accessLabel =
        accessType === "paid" ? `${price ?? 0} ${currency ?? "SAR"}` : "Free"
      const featuredLabel = featured ? " • Featured" : ""

      return {
        title: `${accessType === "paid" ? "💳" : "🆓"} ${title || "Untitled Course"}`,
        subtitle: `${moduleCount} ${moduleCount === 1 ? "module" : "modules"} • ${accessLabel}${featuredLabel}`,
        media: thumbnail || BookIcon,
      }
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Recently Updated",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
})
