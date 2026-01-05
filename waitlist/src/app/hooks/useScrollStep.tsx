import { useScroll, useTransform, MotionValue } from 'motion/react';
import { RefObject, useMemo } from 'react';

interface UseScrollStepProps {
  containerRef: RefObject<HTMLElement>;
  totalSteps: number;
}

interface NodeTransforms {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  glow: MotionValue<string>;
}

interface UseScrollStepReturn {
  scrollYProgress: MotionValue<number>;
  activeStep: MotionValue<number>;
  nodeTransforms: NodeTransforms[];
  railFillHeight: MotionValue<string>;
}

export function useScrollStep({ 
  containerRef, 
  totalSteps 
}: UseScrollStepProps): UseScrollStepReturn {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Active step as continuous value
  const activeStep = useTransform(
    scrollYProgress,
    (progress) => progress * (totalSteps - 1)
  );

  // Rail fill height
  const railFillHeight = useTransform(
    activeStep,
    (step) => `${(step / Math.max(totalSteps - 1, 1)) * 100}%`
  );

  // Create all node transforms once using useMemo
  const nodeTransforms = useMemo(() => {
    return Array.from({ length: totalSteps }, (_, index) => {
      // Node opacity: inactive (0.3) → active (1) → complete (0.5)
      const opacity = useTransform(activeStep, (step) => {
        if (step < index - 0.2) return 0.3;
        if (step < index) return 0.3 + (step - (index - 0.2)) * 3.5;
        if (step <= index + 0.8) return 1;
        if (step < index + 1) return 1 - (step - (index + 0.8)) * 2.5;
        return 0.5;
      });

      // Node scale: subtle scale when active
      const scale = useTransform(activeStep, (step) => {
        if (step < index - 0.2 || step > index + 1) return 1;
        if (step < index) {
          const progress = (step - (index - 0.2)) / 0.2;
          return 0.95 + progress * 0.08;
        }
        if (step <= index + 0.8) return 1.03;
        const progress = (step - (index + 0.8)) / 0.2;
        return 1.03 - progress * 0.03;
      });

      // Node glow: only when active
      const glow = useTransform(activeStep, (step) => {
        if (step < index - 0.2 || step > index + 1) {
          return '0 0 0px rgba(94, 234, 212, 0)';
        }
        if (step < index) {
          const progress = (step - (index - 0.2)) / 0.2;
          return `0 0 ${progress * 16}px rgba(94, 234, 212, ${progress * 0.25})`;
        }
        if (step <= index + 0.8) {
          return '0 0 16px rgba(94, 234, 212, 0.25)';
        }
        const progress = (step - (index + 0.8)) / 0.2;
        return `0 0 ${16 - progress * 12}px rgba(94, 234, 212, ${0.25 - progress * 0.15})`;
      });

      return { opacity, scale, glow };
    });
  }, [activeStep, totalSteps]);

  return {
    scrollYProgress,
    activeStep,
    nodeTransforms,
    railFillHeight
  };
}
