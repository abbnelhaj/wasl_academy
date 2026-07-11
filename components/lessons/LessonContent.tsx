import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

function getHref(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "href" in value &&
    typeof value.href === "string"
  ) {
    return value.href;
  }

  return null;
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-4 mt-8 text-3xl font-bold text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 text-xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-foreground">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-8 text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-r-4 border-primary bg-primary/5 px-4 py-3 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-inside list-decimal space-y-2 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = getHref(value);

      if (!href) {
        return <>{children}</>;
      }

      const isInternal = href.startsWith("/");

      return (
        <a
          className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          href={href}
          rel={isInternal ? undefined : "noopener noreferrer"}
          target={isInternal ? undefined : "_blank"}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const imageUrl = urlFor(value).width(1200).auto("format").url();

      return (
        <figure className="my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <Image
              alt={value.alt || "Lesson image"}
              className="object-contain"
              fill
              src={imageUrl}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface LessonContentProps {
  content: TypedObject[] | null | undefined;
}

export function LessonContent({ content }: LessonContentProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
