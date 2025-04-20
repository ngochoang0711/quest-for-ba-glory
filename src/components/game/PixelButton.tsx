
import React from "react";
import { cn } from "@/lib/utils";

type PixelButtonProps = {
  children: React.ReactNode;
  color?: "blue" | "green" | "purple";
  className?: string;
  onClick?: () => void;
};

const PixelButton = ({ 
  children, 
  color = "blue", 
  className, 
  onClick 
}: PixelButtonProps) => {
  const buttonClass = {
    blue: "pixel-button-blue",
    green: "pixel-button-green",
    purple: "pixel-button-purple",
  }[color];

  return (
    <button 
      className={cn(buttonClass, className)} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PixelButton;
