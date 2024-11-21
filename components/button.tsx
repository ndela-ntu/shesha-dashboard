import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode; // Content of the button
  onClick?: () => void; // Click handler
  className?: string; // Custom className for styling
  type?: 'button' | 'submit' | 'reset'; // Button type
  disabled?: boolean; // Disable the button
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center bg-coralPink text-champagne px-2 py-1 rounded-xl ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
