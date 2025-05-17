type ArrowProps = {
  onClick?: () => void;
  className?: string;
};

export const ArrowUp: React.FC<ArrowProps> = ({ onClick, className }) => (
  <div className={`cursor-pointer ${className}`} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 15l-7-7-7 7" />
    </svg>
  </div>
);
