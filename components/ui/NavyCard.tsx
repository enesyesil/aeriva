import React from "react";

interface NavyCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function NavyCard({ children, className = "" }: NavyCardProps) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "linear-gradient(180deg, #1f3050 0%, #152238 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 6px 0 0 #0a1122, 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}
