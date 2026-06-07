"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export function Skeleton({ width = "100%", height = "1rem", rounded = "0.5rem", className }: SkeletonProps) {
  return <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className={cn("bg-slate-700", className)} style={{ width, height, borderRadius: rounded }} />;
}
