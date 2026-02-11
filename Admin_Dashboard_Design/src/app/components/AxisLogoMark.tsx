import axisLogoImage from '@/assets/e46e1a5c27b866bc4c1422e3054ca75769cef618.png';

interface AxisLogoMarkProps {
  className?: string;
  size?: number;
}

/**
 * Axis Logo Mark Component
 * The official Axis symbol with transparent background
 * Used across navigation, headers, and Ava agent panels
 */
export function AxisLogoMark({ className, size = 20 }: AxisLogoMarkProps) {
  return (
    <img 
      src={axisLogoImage} 
      alt="Axis" 
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}