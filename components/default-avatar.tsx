import React from "react";

interface DefaultAvatarProps {
  name: string;
  size?: number;
  className?: string;
  defaultColors: { from: string; to: string };
}

export default function DefaultAvatar({
  name,
  size = 50,
  className = "",
  defaultColors,
}: DefaultAvatarProps) {
  const firstLetter = name.charAt(0).toUpperCase();

  // Generate a random gradient
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, ${
      defaultColors?.from != null ? defaultColors!.from : getRandomColor()
    }, ${defaultColors?.to != null ? defaultColors!.to : getRandomColor()})`,
  };

  return (
    <div
      className={`flex items-center justify-center text-champagne p-2.5 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full ${className}`}
      style={{
        ...gradientStyle,
        fontSize: `${size / 2}px`,
      }}
      aria-label={`Default avatar for ${name}`}
      role="img"
    >
      {firstLetter}
    </div>
  );
}
