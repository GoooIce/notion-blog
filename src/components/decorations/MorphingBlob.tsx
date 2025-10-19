'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

const MorphingBlob: React.FC<MorphingBlobProps> = ({
  color = '#FF6B9D',
  size = 200,
  speed = 1,
  className = ''
}) => {
  const generateBlobPath = (t: number) => {
    const points = [];
    const numPoints = 8;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = 0.4 + 0.2 * Math.sin(t + angle * 2);
      const x = 50 + radius * Math.cos(angle) * 50;
      const y = 50 + radius * Math.sin(angle) * 50;
      points.push(`${x},${y}`);
    }
    
    return `M ${points[0]} Q ${points[1]} ${points[2]} Q ${points[3]} ${points[4]} Q ${points[5]} ${points[6]} Q ${points[7]} ${points[0]} Z`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.path
          d={generateBlobPath(0)}
          fill={color}
          opacity={0.3}
          animate={{
            d: [
              generateBlobPath(0),
              generateBlobPath(Math.PI / 2),
              generateBlobPath(Math.PI),
              generateBlobPath(3 * Math.PI / 2),
              generateBlobPath(2 * Math.PI),
            ],
          }}
          transition={{
            duration: 4 / speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
};

export default MorphingBlob;
