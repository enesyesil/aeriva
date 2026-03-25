"use client";

import React from "react";

interface Button3DProps {
  variant?: "navy" | "white";
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}

const styles = {
  navy: {
    color: "#ffffff",
    background: "linear-gradient(180deg, #1b2a4a 0%, #0f1a30 100%)",
    border: "1px solid rgba(27,42,74,0.9)",
    boxShadow:
      "0 6px 0 0 #060d1a, 0 10px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
    hoverShadow:
      "0 3px 0 0 #060d1a, 0 5px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
    hoverBg: "linear-gradient(180deg, #243558 0%, #14203d 100%)",
    activeShadow:
      "0 0px 0 0 #060d1a, 0 1px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  white: {
    color: "#1b2a4a",
    background: "linear-gradient(180deg, #ffffff 0%, #f0ece8 100%)",
    border: "1px solid rgba(255,255,255,0.9)",
    boxShadow:
      "0 5px 0 0 #a09080, 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,1)",
    hoverShadow:
      "0 2px 0 0 #a09080, 0 4px 14px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,1)",
    hoverBg: "linear-gradient(180deg, #f5f5f5 0%, #e8e4e0 100%)",
    activeShadow:
      "0 0px 0 0 #a09080, 0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
  },
};

export default function Button3D({
  variant = "navy",
  href,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  children,
}: Button3DProps) {
  const s = styles[variant];

  const baseClass = `inline-block text-center text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  const inlineStyle: React.CSSProperties = {
    color: s.color,
    background: s.background,
    borderRadius: "9999px",
    padding: "12px 28px",
    border: s.border,
    boxShadow: s.boxShadow,
    transform: "translateY(-2px)",
    transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
  };

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.transform = "translateY(0px)";
      el.style.boxShadow = s.hoverShadow;
      el.style.background = s.hoverBg;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.transform = "translateY(-2px)";
      el.style.boxShadow = s.boxShadow;
      el.style.background = s.background;
    },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.transform = "translateY(2px)";
      el.style.boxShadow = s.activeShadow;
    },
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.transform = "translateY(0px)";
      el.style.boxShadow = s.hoverShadow;
    },
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={baseClass}
        style={inlineStyle}
        {...handlers}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={baseClass}
      style={inlineStyle}
      {...handlers}
    >
      {children}
    </button>
  );
}
