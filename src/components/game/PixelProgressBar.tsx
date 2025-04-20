
import { cn } from "@/lib/utils";
import React from "react";

type PixelProgressBarProps = {
  value: number;
  maxValue: number;
  label?: string;
  color?: "blue" | "green" | "purple";
  showText?: boolean;
  className?: string;
};

const PixelProgressBar = ({
  value,
  maxValue,
  label,
  color = "blue",
  showText = true,
  className,
}: PixelProgressBarProps) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  const colorClasses = {
    blue: "bg-game-blue-light",
    green: "bg-game-green-light",
    purple: "bg-game-purple-light",
  }[color];
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between font-retro text-xs mb-1">
          <span>{label}</span>
          {showText && (
            <span>{value}/{maxValue}</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 h-3 border-2 border-game-pixel-black overflow-hidden">
        <div
          className={cn(colorClasses, "h-full", percentage < 100 ? "pixel-progress" : "")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PixelProgressBar;
