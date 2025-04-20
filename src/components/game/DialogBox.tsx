
import React from "react";
import { cn } from "@/lib/utils";

type DialogBoxProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "warning" | "success";
};

const DialogBox = ({ 
  children, 
  className,
  variant = "default" 
}: DialogBoxProps) => {
  // Different border and background colors based on variant
  const variantStyles = {
    default: "border-game-pixel-black bg-white",
    info: "border-game-blue-dark bg-game-blue-light bg-opacity-10",
    warning: "border-yellow-500 bg-yellow-50",
    success: "border-game-green-dark bg-game-green-light bg-opacity-10",
  };

  return (
    <div className={cn(
      "dialog-box p-4 border-4 shadow-[4px_4px_0px_0px_#131613]", 
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default DialogBox;
