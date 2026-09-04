import Image from "next/image";

/**
 * The wordmark PNG is white-on-transparent (brand file, public/brand/naic-logo.png),
 * so it needs a dark chip behind it — #00004d matches the navy the logo sits on
 * across nationalaiconsortium.org.
 */
export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Image
      src="/brand/naic-logo.png"
      alt="National AI Consortium"
      width={387}
      height={103}
      priority
      className={`w-auto rounded-lg bg-[#00004d] px-2.5 py-1.5 ring-1 ring-white/10 ${className}`}
    />
  );
}
