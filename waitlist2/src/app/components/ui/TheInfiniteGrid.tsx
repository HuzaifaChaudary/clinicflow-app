import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate
} from "motion/react";

interface TheInfiniteGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function TheInfiniteGrid({ className, children }: TheInfiniteGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const scrollSpeed = 0.8; // pixels per scroll

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      gridOffsetX.set((scrollX * scrollSpeed) % 80);
      gridOffsetY.set((scrollY * scrollSpeed) % 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [gridOffsetX, gridOffsetY, scrollSpeed]);

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full flex flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Base subtle grid - always visible */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      
      {/* Mouse-reactive grid - reveals on hover */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} highlight />
      </motion.div>

      {/* Atmospheric light orbs - clinical theme */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--blue-soft)]/30 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-10%] w-[35%] h-[35%] rounded-full bg-[var(--blue-primary)]/20 blur-[140px]" />
        <div className="absolute right-[20%] bottom-[10%] w-[20%] h-[20%] rounded-full bg-[var(--blue-vivid)]/15 blur-[100px]" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

interface GridPatternProps {
  offsetX: any;
  offsetY: any;
  highlight?: boolean;
}

const GridPattern = ({ offsetX, offsetY, highlight = false }: GridPatternProps) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={highlight ? "grid-pattern-highlight" : "grid-pattern"}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="currentColor"
            strokeWidth={highlight ? "1.5" : "1"}
            className={highlight ? "text-[var(--accent-primary)]" : "text-[var(--foreground)]"}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${highlight ? "grid-pattern-highlight" : "grid-pattern"})`} />
    </svg>
  );
};