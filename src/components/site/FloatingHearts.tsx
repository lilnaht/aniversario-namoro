"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";

type HeartConfig = {
  left: number;
  top: number;
  delay: number;
  duration: number;
  scale: number;
};

const heartConfigs: HeartConfig[] = [
  { left: 4, top: 86, delay: 0, duration: 18, scale: 1.25 },
  { left: 8, top: 68, delay: 2, duration: 20, scale: 1.1 },
  { left: 12, top: 12, delay: 3, duration: 21, scale: 0.95 },
  { left: 16, top: 48, delay: 5, duration: 19, scale: 1.05 },
  { left: 20, top: 78, delay: 6, duration: 22, scale: 1.35 },
  { left: 24, top: 26, delay: 4, duration: 17, scale: 1.0 },
  { left: 28, top: 60, delay: 8, duration: 24, scale: 1.2 },
  { left: 32, top: 16, delay: 7, duration: 18, scale: 0.95 },
  { left: 36, top: 84, delay: 9, duration: 26, scale: 1.4 },
  { left: 40, top: 36, delay: 11, duration: 21, scale: 1.15 },
  { left: 44, top: 58, delay: 1, duration: 23, scale: 1.3 },
  { left: 48, top: 22, delay: 6, duration: 19, scale: 1.05 },
  { left: 52, top: 72, delay: 10, duration: 25, scale: 1.3 },
  { left: 56, top: 10, delay: 12, duration: 27, scale: 1.4 },
  { left: 60, top: 48, delay: 13, duration: 20, scale: 1.0 },
  { left: 64, top: 86, delay: 14, duration: 24, scale: 1.2 },
  { left: 68, top: 30, delay: 15, duration: 28, scale: 1.4 },
  { left: 72, top: 90, delay: 16, duration: 30, scale: 1.5 },
  { left: 76, top: 8, delay: 17, duration: 22, scale: 1.0 },
  { left: 80, top: 42, delay: 18, duration: 25, scale: 1.2 },
  { left: 84, top: 70, delay: 19, duration: 26, scale: 1.3 },
  { left: 88, top: 18, delay: 20, duration: 21, scale: 1.05 },
  { left: 92, top: 52, delay: 21, duration: 27, scale: 1.25 },
  { left: 96, top: 64, delay: 22, duration: 29, scale: 1.35 },
  { left: 6, top: 34, delay: 23, duration: 20, scale: 1.1 },
  { left: 10, top: 92, delay: 24, duration: 28, scale: 1.45 },
  { left: 14, top: 4, delay: 25, duration: 23, scale: 1.0 },
  { left: 18, top: 56, delay: 26, duration: 26, scale: 1.2 },
  { left: 22, top: 72, delay: 27, duration: 24, scale: 1.3 },
  { left: 26, top: 40, delay: 28, duration: 19, scale: 1.05 },
  { left: 30, top: 88, delay: 29, duration: 27, scale: 1.4 },
  { left: 34, top: 6, delay: 30, duration: 22, scale: 1.0 },
  { left: 38, top: 50, delay: 31, duration: 25, scale: 1.15 },
  { left: 42, top: 76, delay: 32, duration: 28, scale: 1.35 },
  { left: 46, top: 12, delay: 33, duration: 20, scale: 0.95 },
  { left: 50, top: 62, delay: 34, duration: 26, scale: 1.2 },
  { left: 54, top: 82, delay: 35, duration: 29, scale: 1.4 },
  { left: 58, top: 20, delay: 36, duration: 21, scale: 1.05 },
  { left: 62, top: 44, delay: 37, duration: 24, scale: 1.2 },
  { left: 66, top: 74, delay: 38, duration: 27, scale: 1.35 },
  { left: 70, top: 14, delay: 39, duration: 23, scale: 1.0 },
  { left: 74, top: 58, delay: 40, duration: 26, scale: 1.25 },
  { left: 78, top: 86, delay: 41, duration: 30, scale: 1.5 },
  { left: 82, top: 24, delay: 42, duration: 22, scale: 1.05 },
  { left: 86, top: 66, delay: 43, duration: 28, scale: 1.3 },
  { left: 90, top: 4, delay: 44, duration: 25, scale: 0.95 },
  { left: 94, top: 38, delay: 45, duration: 24, scale: 1.15 },
];

const bubbleConfigs: HeartConfig[] = [
  { left: 5, top: 20, delay: 0, duration: 28, scale: 1.2 },
  { left: 18, top: 68, delay: 6, duration: 30, scale: 1.0 },
  { left: 30, top: 35, delay: 10, duration: 32, scale: 1.4 },
  { left: 42, top: 80, delay: 4, duration: 29, scale: 1.1 },
  { left: 55, top: 18, delay: 8, duration: 34, scale: 1.35 },
  { left: 66, top: 58, delay: 2, duration: 31, scale: 1.2 },
  { left: 76, top: 28, delay: 12, duration: 33, scale: 1.1 },
  { left: 88, top: 74, delay: 14, duration: 35, scale: 1.3 },
  { left: 12, top: 88, delay: 16, duration: 36, scale: 1.5 },
  { left: 70, top: 90, delay: 18, duration: 37, scale: 1.45 },
];

const sparkleConfigs: HeartConfig[] = [
  { left: 10, top: 32, delay: 0, duration: 14, scale: 1.0 },
  { left: 16, top: 56, delay: 3, duration: 12, scale: 0.9 },
  { left: 22, top: 74, delay: 6, duration: 16, scale: 1.1 },
  { left: 28, top: 20, delay: 2, duration: 13, scale: 1.0 },
  { left: 34, top: 46, delay: 5, duration: 15, scale: 0.8 },
  { left: 40, top: 66, delay: 7, duration: 12, scale: 1.1 },
  { left: 46, top: 10, delay: 1, duration: 14, scale: 0.9 },
  { left: 52, top: 38, delay: 4, duration: 16, scale: 1.0 },
  { left: 58, top: 84, delay: 9, duration: 18, scale: 1.2 },
  { left: 64, top: 52, delay: 6, duration: 13, scale: 0.85 },
  { left: 70, top: 18, delay: 8, duration: 15, scale: 1.0 },
  { left: 76, top: 44, delay: 10, duration: 17, scale: 0.9 },
  { left: 82, top: 70, delay: 12, duration: 14, scale: 1.1 },
  { left: 88, top: 26, delay: 11, duration: 16, scale: 1.0 },
  { left: 94, top: 58, delay: 13, duration: 18, scale: 1.2 },
  { left: 8, top: 84, delay: 15, duration: 19, scale: 1.1 },
];

export default function FloatingHearts() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {heartConfigs.map((heart, index) => (
        <span
          key={index}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            animationDelay: prefersReducedMotion ? "0s" : `${heart.delay}s`,
            animationDuration: prefersReducedMotion ? "0s" : `${heart.duration}s`,
            ["--heart-scale" as string]: heart.scale,
          }}
        />
      ))}
      {bubbleConfigs.map((bubble, index) => (
        <span
          key={`bubble-${index}`}
          className="floating-bubble"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDelay: prefersReducedMotion ? "0s" : `${bubble.delay}s`,
            animationDuration: prefersReducedMotion ? "0s" : `${bubble.duration}s`,
            ["--bubble-scale" as string]: bubble.scale,
          }}
        />
      ))}
      {sparkleConfigs.map((sparkle, index) => (
        <span
          key={`sparkle-${index}`}
          className="floating-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: prefersReducedMotion ? "0s" : `${sparkle.delay}s`,
            animationDuration: prefersReducedMotion ? "0s" : `${sparkle.duration}s`,
            ["--sparkle-scale" as string]: sparkle.scale,
          }}
        />
      ))}
    </div>
  );
}
