"use client";

import { motion } from 'framer-motion';

const shapes = [
  { w: 80, h: 80, x: 0, y: 0, color: 'bg-neo-accent', delay: 0 },
  { w: 60, h: 100, x: 100, y: 20, color: 'bg-neo-text', delay: 0.1 },
  { w: 40, h: 40, x: 180, y: 80, color: 'border-2 border-neo-border bg-transparent', delay: 0.2 },
  { w: 100, h: 60, x: 40, y: 120, color: 'bg-neo-text', delay: 0.3 },
  { w: 50, h: 80, x: 160, y: 140, color: 'bg-neo-accent', delay: 0.4 },
  { w: 70, h: 50, x: 220, y: 60, color: 'border-2 border-neo-accent bg-transparent', delay: 0.5 },
];

export const GeometricIllustration = () => {
  return (
    <div className="relative h-[250px] w-full max-w-[300px]">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.color}`}
          style={{
            width: shape.w,
            height: shape.h,
            left: shape.x,
            top: shape.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
            rotate: [0, i % 2 === 0 ? 3 : -3, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: shape.delay },
            scale: { duration: 0.5, delay: shape.delay },
            y: {
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
};

export default GeometricIllustration;
