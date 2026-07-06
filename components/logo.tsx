import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/logos/wasl_logo.svg"
      alt="Wasl Academy"
      width={120}
      height={40}
      priority
      className="h-9 w-auto"
    />
  );
}
