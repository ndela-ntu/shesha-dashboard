"use client";

import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React, { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  children: ReactNode; // Content of the button
  onClick?: () => void; // Click handler
  className?: string; // Custom className for styling
  disabled?: boolean; // Disable the button
}

export default function SubmitButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending}
      className={`flex items-center justify-center bg-coralPink text-champagne px-2 py-1`}
    >
      {pending ? (
        <Loader2 className="h-7 w-7 animate-spin" />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
