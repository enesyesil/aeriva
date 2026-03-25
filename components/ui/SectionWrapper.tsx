import RevealOnScroll from "./RevealOnScroll";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  dark = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 px-6 md:px-8 ${
        dark ? "bg-navy text-white" : ""
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>{children}</RevealOnScroll>
      </div>
    </section>
  );
}
