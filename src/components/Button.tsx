import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: Readonly<ButtonProps>) {
  return (
    <button
      className="p-3 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}