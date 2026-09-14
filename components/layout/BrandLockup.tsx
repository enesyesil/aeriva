import Image from "next/image";
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
      className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`}
      aria-label="Dauvena Cosmetics home"
    >
      <span
        className={`brand-reference-logo ${
          inverse ? "brand-reference-logo--inverse" : "brand-reference-logo--dark"
        }`}
        aria-hidden="true"
      >
        <Image
          src="/images/brand/dauvena-logo-transparent.png"
          alt=""
          width={2118}
          height={742}
          priority
          draggable={false}
        />
      </span>
    </Link>
  );
}
