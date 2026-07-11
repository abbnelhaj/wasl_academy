import type {
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderDecoratorFunction,
  RenderListItemFunction,
  RenderStyleFunction,
} from "@portabletext/editor";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export const renderStyle: RenderStyleFunction = (props) => {
  const style = props.schemaType.value;

  if (style === "h1") {
    return (
      <h1 className="mt-6 mb-3 text-3xl font-bold text-foreground">
        {props.children}
      </h1>
    );
  }
  if (style === "h2") {
    return (
      <h2 className="mt-5 mb-2 text-2xl font-bold text-foreground">
        {props.children}
      </h2>
    );
  }
  if (style === "h3") {
    return (
      <h3 className="mt-4 mb-2 text-xl font-semibold text-foreground">
        {props.children}
      </h3>
    );
  }
  if (style === "h4") {
    return (
      <h4 className="mt-3 mb-1 text-lg font-semibold text-foreground">
        {props.children}
      </h4>
    );
  }
  if (style === "blockquote") {
    return (
      <blockquote className="my-4 border-s-4 border-primary ps-4 text-muted-foreground italic">
        {props.children}
      </blockquote>
    );
  }

  return (
    <p className="my-2 leading-relaxed text-foreground">{props.children}</p>
  );
};

export const renderDecorator: RenderDecoratorFunction = (props) => {
  const decorator = props.value;

  if (decorator === "strong") {
    return (
      <strong className="font-semibold text-foreground">
        {props.children}
      </strong>
    );
  }
  if (decorator === "em") {
    return <em className="italic">{props.children}</em>;
  }
  if (decorator === "underline") {
    return <u className="underline underline-offset-2">{props.children}</u>;
  }
  if (decorator === "strike-through") {
    return <s className="line-through">{props.children}</s>;
  }
  if (decorator === "code") {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
        {props.children}
      </code>
    );
  }

  return <>{props.children}</>;
};

export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    const href = props.value?.href as string | undefined;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
      >
        {props.children}
      </a>
    );
  }

  return <>{props.children}</>;
};

export const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image") {
    const value = props.value as {
      asset?: { _ref?: string };
      caption?: string;
      alt?: string;
    };

    if (!value?.asset?._ref) {
      return (
        <div className="my-4 rounded-md border border-dashed p-4 text-center text-muted-foreground">
          الصورة غير موجودة
        </div>
      );
    }

    const imageUrl = urlFor({ asset: { _ref: value.asset._ref } })
      .width(800)
      .fit("max")
      .auto("format")
      .url();

    return (
      <figure className="my-6" contentEditable={false}>
        <div className="relative overflow-hidden rounded-md bg-muted">
          <Image
            src={imageUrl}
            alt={value.alt || "صورة داخل الدرس"}
            width={800}
            height={450}
            className="h-auto w-full object-contain"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return <div className="my-1">{props.children}</div>;
};

export const renderListItem: RenderListItemFunction = (props) => {
  const listType = props.schemaType.value;

  if (listType === "bullet") {
    return (
      <li className="my-1 ms-6 list-disc text-foreground">{props.children}</li>
    );
  }
  if (listType === "number") {
    return (
      <li className="my-1 ms-6 list-decimal text-foreground">
        {props.children}
      </li>
    );
  }

  return <li className="my-1 ms-6 text-foreground">{props.children}</li>;
};
