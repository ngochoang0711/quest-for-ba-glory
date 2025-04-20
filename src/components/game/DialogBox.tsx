
import React from "react";
import { cn } from "@/lib/utils";

type DialogBoxProps = {
  children: React.ReactNode;
  className?: string;
};

const DialogBox = ({ children, className }: DialogBoxProps) => {
  return (
    <div className={cn("dialog-box", className)}>
      {children}
    </div>
  );
};

export default DialogBox;
