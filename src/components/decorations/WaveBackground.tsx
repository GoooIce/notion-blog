'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaveBackgroundProps {
  color?: string;
  opacity?: number;
  speed?: number;
  amplitude?: number;
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({
  color = '#FF6B9D',
  opacity = 0.1,
  speed = 1,
  amplitude = 50,
  className = ''
}) => {
  const waveVariants = {
    animate: {
      x: ['0%', '100%', '0%'],
      transition: {
        duration: 8 / speed,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const generateWavePath = (offset: number) => {
    const points = [];
    const width = 100;
    const height = 100;
    
    for (let i = 0; i <= width; i += 2) {
      const x = i;
      const y = height / 2 + Math.sin((i + offset) * 0.1) * amplitude;
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')} L 100,100 L 0,100 Z`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
        variants={waveVariants}
        animate="animate"
      >
        {/* Multiple wave layers for depth */}
        <motion.path
          d={generateWavePath(0)}
          fill={color}
          opacity={opacity}
          variants={waveVariants}
          animate="animate"
        />
        <motion.path
          d={generateWavePath(20)}
          fill={color}
          opacity={opacity * 0.7}
          variants={waveVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
        />
        <motion.path
          d={generateWavePath(40)}
          fill={color}
          opacity={opacity * 0.5}
          variants={waveVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
        />
      </motion.svg>
    </div>
  );
};

export default WaveBackground;
