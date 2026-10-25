import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "inset";
  isHoverable?: boolean;
}

/**
 * Card — kontainer kartu bersih & modern dengan border halus dan bayangan lembut.
 */
export function Card({
  children,
  className = "",
  variant = "default",
  isHoverable = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-surface-1 border-border card-3d text-text-1",
    subtle:  "bg-surface-0 border-border text-text-1",
    inset:   "bg-surface-2 border-border text-text-1",
  };

  const hoverStyle = isHoverable
    ? "transition-all duration-200 hover:border-border-control hover:shadow-sm"
    : "";

  return (
    <div
      className={`rounded-lg border p-6 ${variantStyles[variant]} ${hoverStyle} ${className}`}
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
      className={`text-base font-semibold text-text-1 tracking-tight ${className}`}
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
    <p className={`text-xs text-text-3 leading-relaxed ${className}`} {...props}>
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
    <div className={`space-y-4 ${className}`} {...props}>
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
      className={`mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-text-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
