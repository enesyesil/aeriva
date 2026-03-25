interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-8 py-3 text-[13px] font-medium tracking-widest uppercase rounded-full cursor-pointer select-none";
  const variants = {
    primary:
      "text-white bg-navy shadow-[0_6px_0_0_#060d1a,0_10px_30px_rgba(0,0,0,0.30)] hover:shadow-[0_3px_0_0_#060d1a,0_5px_18px_rgba(0,0,0,0.25)] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#060d1a,0_1px_6px_rgba(0,0,0,0.15)] active:translate-y-[4px] transition-all duration-150",
    outline:
      "border border-white/40 text-white hover:bg-white/10 transition-all duration-400",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
