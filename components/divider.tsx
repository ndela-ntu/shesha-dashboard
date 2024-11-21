import React from "react";

interface DividerProps {
  className?: string; // Custom styles for the divider
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div className={`border-t w-full border-champagne my-1 ${className}`}></div>
  );
};

export default Divider;
