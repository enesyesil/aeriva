import Link from "next/link";

interface BrandLockupProps {
  href: string;
  inverse?: boolean;
  compact?: boolean;
}

export default function BrandLockup({
  href,
  inverse = false,
  compact = false,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      className={`brand-lockup ${inverse ? "text-white" : "text-ink"}`}
      aria-label="Dauvena Cosmetics home"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif tracking-[-0.045em] ${compact ? "text-[1.55rem]" : "text-[1.85rem]"}`}
        >
          Dauvena
        </span>
        <span className="mt-1 pl-[0.12em] text-[0.48rem] font-semibold tracking-[0.42em] uppercase opacity-60">
          Cosmetics
        </span>
      </span>
    </Link>
  );
}
