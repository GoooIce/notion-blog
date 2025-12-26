// src/components/circuit/CurrentCanvas.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

interface CurrentPath {
  points: Point[];
  color: string;
}

export default function CurrentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const pathsRef = useRef<CurrentPath[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = mouseRef.current;
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Add new path
      const speed = Math.hypot(
        e.clientX - lastMouseRef.current.x,
        e.clientY - lastMouseRef.current.y
      );

      pathsRef.current.push({
        points: [
          { x: lastMouseRef.current.x, y: lastMouseRef.current.y, age: 0 },
          { x: e.clientX, y: e.clientY, age: 0 },
        ],
        color: speed > 10 ? '#00d4ff' : '#00ff41',
      });

      // Limit paths
      if (pathsRef.current.length > 50) {
        pathsRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw paths
      pathsRef.current = pathsRef.current.filter((path) => {
        // Update ages
        path.points.forEach((p) => (p.age += 1));

        // Draw path
        if (path.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);

          for (let i = 1; i < path.points.length; i++) {
            const p0 = path.points[i - 1];
            const p1 = path.points[i];
            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
          }

          const lastPoint = path.points[path.points.length - 1];
          ctx.lineTo(lastPoint.x, lastPoint.y);

          const alpha = Math.max(0, 1 - path.points[0].age / 60);
          ctx.strokeStyle = path.color;
          ctx.globalAlpha = alpha * 0.6;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Remove old paths
        return path.points[0].age < 60;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
