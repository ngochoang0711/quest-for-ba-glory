
import React from "react";
import { cn } from "@/lib/utils";

type PixelButtonProps = {
  children: React.ReactNode;
  color?: "blue" | "green" | "purple";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const PixelButton = ({ 
  children, 
  color = "blue", 
  className, 
  onClick,
  disabled = false
}: PixelButtonProps) => {
  const buttonClass = {
    blue: "pixel-button-blue",
    green: "pixel-button-green",
    purple: "pixel-button-purple",
  }[color];

  return (
    <button 
      className={cn(
        "pixel-button", 
        buttonClass, 
        className,
        disabled && "opacity-50 cursor-not-allowed",
        "hover:brightness-110 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#131613]"
      )} 
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PixelButton;
