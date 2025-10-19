'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShapesProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
  colors?: string[];
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 8,
  size = 'medium',
  colors = ['#FF6B9D', '#C06BFF', '#00D4FF', '#00FFA3', '#FFB800'],
  className = ''
}) => {
  const sizeMap = {
    small: { min: 20, max: 40 },
    medium: { min: 30, max: 60 },
    large: { min: 50, max: 100 }
  };

  const { min, max } = sizeMap[size];

  const shapes = Array.from({ length: count }, (_, i) => {
    const shapeType = Math.floor(Math.random() * 3); // 0: circle, 1: triangle, 2: square
    const shapeSize = Math.random() * (max - min) + min;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 4; // 3-7 seconds

    const getShape = () => {
      switch (shapeType) {
        case 0: // Circle
          return (
            <circle
              cx={shapeSize / 2}
              cy={shapeSize / 2}
              r={shapeSize / 2}
              fill={color}
              opacity={0.6}
            />
          );
        case 1: // Triangle
          return (
            <polygon
              points={`${shapeSize / 2},0 ${shapeSize},${shapeSize} 0,${shapeSize}`}
              fill={color}
              opacity={0.6}
            />
          );
        case 2: // Square
          return (
            <rect
              width={shapeSize}
              height={shapeSize}
              fill={color}
              opacity={0.6}
              rx={shapeSize * 0.1}
            />
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          zIndex: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.6, 0.3, 0.6, 0],
          scale: [0, 1, 1.2, 1, 0],
          rotate: [0, 180, 360],
          y: [0, -20, -40, -60, -80],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={shapeSize} height={shapeSize} viewBox={`0 0 ${shapeSize} ${shapeSize}`}>
          {getShape()}
        </svg>
      </motion.div>
    );
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes}
    </div>
  );
};

export default FloatingShapes;
