"use client";

import type { PortableTextBlock } from "@portabletext/editor";
import { useEditor } from "@portabletext/editor";
import {
  type ExtendDecoratorSchemaType,
  type ExtendListSchemaType,
  type ExtendStyleSchemaType,
  type ToolbarDecoratorSchemaType,
  type ToolbarListSchemaType,
  type ToolbarStyleSchemaType,
  useDecoratorButton,
  useListButton,
  useStyleSelector,
  useToolbarSchema,
} from "@portabletext/toolbar";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Type,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
  onInsertImage: (insertIndex: number) => void;
}

const extendStyle: ExtendStyleSchemaType = (style) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    normal: Type,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    blockquote: Quote,
  };

  return {
    ...style,
    icon: icons[style.name] || Type,
  };
};

const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    strong: Bold,
    em: Italic,
    underline: Underline,
    "strike-through": Strikethrough,
    code: Code,
  };

  const icon = icons[decorator.name];
  if (icon) {
    return {
      ...decorator,
      icon,
      title: "",
    };
  }

  return decorator;
};

const extendList: ExtendListSchemaType = (list) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    bullet: List,
    number: ListOrdered,
  };

  return {
    ...list,
    icon: icons[list.name] || List,
    title: "",
  };
};

function DecoratorButton({
  schemaType,
}: {
  schemaType: ToolbarDecoratorSchemaType;
}) {
  const button = useDecoratorButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      title={schemaType.name}
      aria-label={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

function ListButton({ schemaType }: { schemaType: ToolbarListSchemaType }) {
  const button = useListButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      title={schemaType.name}
      aria-label={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

function StyleSelector({
  styles,
}: {
  styles: readonly ToolbarStyleSchemaType[];
}) {
  const mutableStyles = [...styles];
  const selector = useStyleSelector({ schemaTypes: mutableStyles });
  const activeStyleName = selector.snapshot.context.activeStyle;
  const activeStyle = styles.find((s) => s.name === activeStyleName);

  return (
    <Select
      value={activeStyle?.name || "normal"}
      onValueChange={(value) => {
        if (!value) return;
        selector.send({ type: "toggle", style: value });
      }}
    >
      <SelectTrigger className="h-8 w-[130px] border-input bg-card text-sm text-foreground">
        <SelectValue placeholder="النمط" />
      </SelectTrigger>
      <SelectContent className="border bg-popover text-popover-foreground">
        {styles.map((style) => {
          const Icon = style.icon as React.ComponentType<{
            className?: string;
          }>;
          return (
            <SelectItem
              key={style.name}
              value={style.name}
              className="focus:bg-accent focus:text-accent-foreground"
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {style.title || style.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function Toolbar({ onInsertImage }: ToolbarProps) {
  const toolbarSchema = useToolbarSchema({
    extendStyle,
    extendDecorator,
    extendList,
  });

  const editor = useEditor();

  const handleInsertImage = () => {
    const snapshot = editor.getSnapshot();
    const value = snapshot.context.value as PortableTextBlock[] | undefined;
    const selection = snapshot.context.selection;

    let insertIndex = value?.length || 0;

    if (selection && value) {
      const focusPath = selection.focus.path;
      const firstSegment = focusPath[0];
      const focusBlockKey =
        typeof firstSegment === "object" &&
        firstSegment !== null &&
        "_key" in firstSegment
          ? (firstSegment._key as string)
          : undefined;
      if (focusBlockKey) {
        const currentIndex = value.findIndex(
          (block) => block._key === focusBlockKey,
        );
        if (currentIndex !== -1) {
          insertIndex = currentIndex + 1;
        }
      }
    }

    onInsertImage(insertIndex);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded-t-md border-b bg-muted/40 p-2"
      dir="rtl"
    >
      {toolbarSchema.styles && toolbarSchema.styles.length > 0 && (
        <>
          <StyleSelector styles={toolbarSchema.styles} />
          <div className="mx-1 h-6 w-px bg-border" />
        </>
      )}

      {toolbarSchema.decorators?.map((decorator) => (
        <DecoratorButton key={decorator.name} schemaType={decorator} />
      ))}

      {toolbarSchema.decorators && toolbarSchema.decorators.length > 0 && (
        <div className="mx-1 h-6 w-px bg-border" />
      )}

      {toolbarSchema.lists?.map((list) => (
        <ListButton key={list.name} schemaType={list} />
      ))}

      {toolbarSchema.lists && toolbarSchema.lists.length > 0 && (
        <div className="mx-1 h-6 w-px bg-border" />
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleInsertImage}
        className="h-8 px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="إدراج صورة"
        aria-label="إدراج صورة داخل محتوى الدرس"
      >
        <ImagePlus className="h-4 w-4 me-1" />
        <span className="text-xs">صورة</span>
      </Button>
    </div>
  );
}
