'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GeometricPatternProps {
  pattern?: 'dots' | 'lines' | 'hexagons' | 'triangles';
  color?: string;
  size?: number;
  spacing?: number;
  className?: string;
}

const GeometricPattern: React.FC<GeometricPatternProps> = ({
  pattern = 'dots',
  color = '#FF6B9D',
  size = 20,
  spacing = 40,
  className = ''
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
              backgroundSize: `${spacing}px ${spacing}px`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', `${spacing}px ${spacing}px`],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      
      case 'lines':
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${color} 2px, ${color} 4px)`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', `${spacing}px ${spacing}px`],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      
      case 'hexagons':
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${color.replace('#', '%23')}' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', `${spacing}px ${spacing}px`],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      
      case 'triangles':
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${color.replace('#', '%23')}' fill-opacity='0.1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', `${spacing}px ${spacing}px`],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {renderPattern()}
    </div>
  );
};

export default GeometricPattern;
