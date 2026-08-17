"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FlipbookContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Dark theater wrapper for the flipbook viewer stage. */
export function FlipbookContainer({ children, className }: FlipbookContainerProps) {
  return (
    <div className={cn("relative overflow-hidden bg-[#111111]", className)}>
      {children}
    </div>
  );
}
