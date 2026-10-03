import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span className={cn("relative grid size-9 place-items-center rounded-xl bg-[#171717] border border-white/10 shadow-[0_4px_16px_-4px_rgba(139,92,246,0.6)] select-none", className)}>
        <svg viewBox="0 0 32 32" className="size-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6H21C22.1 6 23 6.9 23 8V9.5C23 10.6 22.1 11.5 21 11.5H13V15H19C20.1 15 21 15.9 21 17V18C21 19.1 20.1 20 19 20H13V26H7V6Z" fill="url(#brand-f-grad)" />
          <circle cx="23" cy="24" r="2.2" fill="#c084fc" />
          <defs>
            <linearGradient id="brand-f-grad" x1="7" y1="6" x2="23" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      <img src="/logo.svg" alt="Fcraft" className="h-8 w-auto object-contain" />
    </div>
  );
}

