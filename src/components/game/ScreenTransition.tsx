
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type ScreenTransitionProps = {
  show: boolean;
  onComplete?: () => void;
  className?: string;
};

const ScreenTransition = ({ 
  show, 
  onComplete, 
  className 
}: ScreenTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (show) {
      setIsVisible(true);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 1000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [show, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-game-pixel-black flex items-center justify-center",
      className
    )}>
      <div className="text-white font-retro text-sm animate-pulse">Loading...</div>
    </div>
  );
};

export default ScreenTransition;
