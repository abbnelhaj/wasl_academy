import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  isFullScreen?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

function LoadingSpinner({
  text,
  size = "md",
  isFullScreen = false,
  className,
}: LoadingSpinnerProps) {
  return (
    <output
      aria-label={text ?? "جار التحميل"}
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-3",
        isFullScreen && "min-h-screen p-8",
        className,
      )}
    >
      <Spinner className={cn(sizeStyles[size], "text-primary")} />
      {text && (
        <span
          className={cn(
            "font-medium text-muted-foreground tracking-normal",
            textSizeStyles[size],
          )}
        >
          {text}
        </span>
      )}
    </output>
  );
}

export default LoadingSpinner;
