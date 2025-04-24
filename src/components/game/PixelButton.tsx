
import React from "react";
import { cn } from "@/lib/utils";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("pixel-base", className)}
        disabled={disabled}
        type={type}
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
  type?: "button" | "submit" | "reset";
};

const PixelButton = ({ 
  children, 
  color = "blue", 
  className,
  onClick,
  disabled = false,
  type = "button"
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
      type={type}
    >
      {children}
    </BaseButton>
  );
};

export default PixelButton;
