import type { ArrowProps } from "../types/types"

export const ArrowDown: React.FC<ArrowProps> = ({ onClick, className }) => (
  <div className={`cursor-pointer ${className}`} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);
