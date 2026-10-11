import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "subtle" | "glow";
  isHoverable?: boolean;
}

export function Card({
  children,
  className = "",
  variant = "default",
  isHoverable = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-slate-900/80 border-slate-800 text-slate-100",
    glass:
      "bg-slate-900/40 backdrop-blur-xl border-slate-800/80 text-slate-100 shadow-2xl shadow-black/40",
    subtle: "bg-slate-950/60 border-slate-800/50 text-slate-200",
    glow: "bg-slate-900/70 border-cyan-500/30 text-slate-100 shadow-lg shadow-cyan-500/10",
  };

  const hoverStyle = isHoverable
    ? "transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px] hover:shadow-cyan-500/5"
    : "";

  return (
    <div
      className={`rounded-2xl border p-6 ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" | "h5" }) {
  return (
    <Component
      className={`text-xl font-bold tracking-tight text-white ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-400 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-slate-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
