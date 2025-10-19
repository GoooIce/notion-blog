'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 50,
  colors = ['#FF6B9D', '#C06BFF', '#00D4FF', '#00FFA3', '#FFB800'],
  speed = 1,
  size = 3,
  className = ''
}) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 5;
    const duration = (3 + Math.random() * 4) / speed;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX = startX + (Math.random() - 0.5) * 50;
    const endY = startY + (Math.random() - 0.5) * 50;

    return (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${startX}%`,
          top: `${startY}%`,
          zIndex: 1,
        }}
        initial={{ 
          opacity: 0, 
          scale: 0,
          x: 0,
          y: 0
        }}
        animate={{
          opacity: [0, 1, 0.5, 1, 0],
          scale: [0, 1, 1.2, 1, 0],
          x: [0, endX - startX, 0],
          y: [0, endY - startY, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
        />
      </motion.div>
    );
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles}
    </div>
  );
};

export default ParticleField;
