import React from "react";
import clsx from "clsx";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "delete"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Button({
  onClick,
  children,
  variant = "primary",
  size = "md",
  className,
}: Readonly<ButtonProps>) {
  const baseClasses =
    "cursor-pointer transition-colors rounded font-medium inline-flex items-center justify-center";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-inverted))] hover:bg-[rgb(var(--color-primary-hover))]",
    secondary:
      "bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-secondary-hover))]",
    tertiary:
      "bg-[rgb(var(--color-tertiary))] text-[rgb(var(--color-text-inverted))] hover:bg-[rgb(var(--color-primary-hover))]",
    delete:
      "bg-[rgb(var(--color-error))] text-white hover:bg-red-700",
    outline:
      "border border-gray-300 text-[rgb(var(--color-text-base))] hover:bg-gray-100",
    ghost:
      "bg-transparent text-[rgb(var(--color-text-base))] hover:bg-gray-200",
  };

  const sizeClasses: Record<string, string> = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}