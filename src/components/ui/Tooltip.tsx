"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => window.setTimeout(() => setOpen(true), 200)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? (
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs text-white shadow-lg">
          {content}
        </motion.span>
      ) : null}
    </span>
  );
}
