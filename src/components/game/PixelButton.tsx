
import React from "react";
import { cn } from "@/lib/utils";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("pixel-base", className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
BaseButton.displayName = "BaseButton";

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
    <BaseButton 
      className={cn(
        "pixel-button",
        buttonClass,
        className
      )}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </BaseButton>
  );
};

export default PixelButton;
