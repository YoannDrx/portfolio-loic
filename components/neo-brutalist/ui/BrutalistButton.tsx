"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark";
  icon?: React.ReactNode;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary", 
  icon,
  ...props
}) => {
  const baseStyles = "relative px-8 py-4 font-mono text-sm font-bold uppercase transition-all duration-150 border-2 border-neo-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center gap-3 select-none";
  
  const variants = {
    primary: "bg-neo-orange text-neo-black hover:bg-[#ff5500] shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000]",
    secondary: "bg-white text-neo-black shadow-[6px_6px_0px_0px_#000] hover:bg-gray-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000]",
    dark: "bg-neo-black text-neo-orange shadow-[6px_6px_0px_0px_#FF3300] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#FF3300]"
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
};
