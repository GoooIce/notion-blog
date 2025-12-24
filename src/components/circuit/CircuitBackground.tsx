// src/components/circuit/CircuitBackground.tsx
'use client';

import React from 'react';

export default function CircuitBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.3,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal lines */}
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="0"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            {/* Vertical lines */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            {/* Diagonal lines at 45 degrees */}
            <line
              x1="0"
              y1="50"
              x2="50"
              y2="0"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="100"
              x2="100"
              y2="50"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
            {/* Circuit dots at intersections */}
            <circle cx="0" cy="0" r="2" fill="rgba(255, 255, 255, 0.1)" />
            <circle cx="50" cy="50" r="1.5" fill="rgba(255, 255, 255, 0.08)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
}
