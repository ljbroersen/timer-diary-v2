import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: Readonly<ButtonProps>) {
  return (
    <button
      className="p-3 px-4 cursor-pointer bg-[rgb(var(--color-tertiary))] hover:bg-[rgb(var(--color-primary-hover))]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}