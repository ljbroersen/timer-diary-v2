import React from "react";
import clsx from "clsx";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "delete" ;
}

export default function Button({
  onClick,
  children,
  variant = "primary",
}: Readonly<ButtonProps>) {
  const baseClasses = "cursor-pointer transition-colors";
  const variantClasses = {
    primary: "bg-[rgb(var(--color-tertiary))] hover:bg-[rgb(var(--color-primary-hover))] mx-1 p-4",
    secondary: "bg-[rgb(var(--color-secondary))] hover:bg-[rgb(var(--color-secondary-hover))] w-1/5 p-4",
    tertiary:"px-1 bg-[rgb(var(--color-tertiary))] hover:bg-red-600 text-white",
    delete: "px-1 bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button className={clsx(baseClasses, variantClasses[variant])} onClick={onClick}>
      {children}
    </button>
  );
}