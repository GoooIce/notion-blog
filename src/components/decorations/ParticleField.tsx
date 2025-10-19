'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 100,
  colors = ['#FF6B9D', '#C06BFF', '#00D4FF', '#00FFA3', '#FFB800'],
  speed = 1,
  size = 3,
  className = '',
  interactive = true
}) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [P5Component, setP5Component] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // 确保只在客户端运行
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 动态导入p5.js
    const loadP5 = async () => {
      try {
        const p5 = (await import('p5')).default;

        // 定义粒子接口
        interface Particle {
          pos: any;
          vel: any;
          acc: any;
          life: number;
          maxLife: number;
          color: any;
          size: number;
          alpha: number;
        }

        // 创建P5组件
        const P5ParticleComponent = () => {
          const particlesRef = useRef<Particle[]>([]);

          useEffect(() => {
            if (!sketchRef.current) return;

            const sketch = (p: any) => {
              let canvas: any;

              p.setup = () => {
                canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent(sketchRef.current!);

                // 初始化粒子系统
                particlesRef.current = [];
                for (let i = 0; i < count; i++) {
                  createParticle(p);
                }

                p.colorMode(p.RGB, 255, 255, 255, 100);
              };

              const createParticle = (p: any) => {
                const particle: Particle = {
                  pos: p.createVector(p.random(p.width), p.random(p.height)),
                  vel: p.createVector(p.random(-1, 1), p.random(-1, 1)),
                  acc: p.createVector(0, 0),
                  life: p.random(100, 300),
                  maxLife: p.random(100, 300),
                  color: p.color(colors[Math.floor(p.random(colors.length))]),
                  size: p.random(size * 0.5, size * 2),
                  alpha: p.random(30, 80)
                };
                particlesRef.current.push(particle);
              };

              p.draw = () => {
                p.clear();

                // 更新和绘制粒子
                for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                  const particle = particlesRef.current[i];

                  // 应用力（重力、风等）
                  particle.acc.mult(0); // 重置加速度

                  // 添加轻微的重力
                  particle.acc.add(0, 0.01);

                  // 鼠标交互
                  if (interactive && p.mouseX > 0 && p.mouseY > 0) {
                    const mouse = p.createVector(p.mouseX, p.mouseY);
                    const dir = p.Vector.sub(mouse, particle.pos);
                    const distance = dir.mag();

                    if (distance < 100) {
                      dir.normalize();
                      dir.mult(-0.5 / distance); // 鼠标排斥力
                      particle.acc.add(dir);
                    }
                  }

                  // 更新粒子物理
                  particle.vel.add(particle.acc);
                  particle.vel.limit(2); // 限制最大速度
                  particle.pos.add(particle.vel);

                  // 边界处理
                  if (particle.pos.x < 0 || particle.pos.x > p.width) {
                    particle.vel.x *= -1;
                  }
                  if (particle.pos.y < 0 || particle.pos.y > p.height) {
                    particle.vel.y *= -1;
                  }

                  // 粒子生命周期
                  particle.life--;

                  if (particle.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    createParticle(p); // 创建新粒子
                    continue;
                  }

                  // 计算透明度
                  const lifeRatio = particle.life / particle.maxLife;
                  const alpha = particle.alpha * lifeRatio;

                  // 绘制粒子
                  p.push();
                  p.translate(particle.pos.x, particle.pos.y);
                  p.noStroke();

                  // 设置粒子颜色和透明度
                  const c = p.color(particle.color);
                  c.setAlpha(alpha);
                  p.fill(c);

                  // 绘制粒子（圆形或小方块）
                  p.circle(0, 0, particle.size);

                  // 添加光晕效果
                  p.fill(p.red(c), p.green(c), p.blue(c), alpha * 0.3);
                  p.circle(0, 0, particle.size * 2);

                  p.pop();
                }

                // 在粒子之间绘制连线（可选）
                if (interactive) {
                  drawConnections(p);
                }
              };

              const drawConnections = (p: any) => {
                for (let i = 0; i < particlesRef.current.length; i++) {
                  for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];
                    const distance = p.Vector.dist(p1.pos, p2.pos);

                    if (distance < 80) {
                      const alpha = (80 - distance) / 80 * 20; // 连线透明度
                      p.stroke(255, 255, 255, alpha);
                      p.strokeWeight(0.5);
                      p.line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                    }
                  }
                }
              };

              p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
              };

              p.mouseMoved = () => {
                // 鼠标移动时产生新粒子
                if (p.frameCount % 5 === 0) {
                  createParticle(p);
                }
              };
            };

            const p5Instance = new p5(sketch);

            return () => {
              p5Instance.remove();
            };
          }, [count, colors, speed, size, interactive]);

          return (
            <div
              ref={sketchRef}
              className={`fixed inset-0 pointer-events-none ${className}`}
              style={{ zIndex: -1 }}
            />
          );
        };

        setP5Component(() => P5ParticleComponent);
      } catch (error) {
        console.error('Failed to load p5.js:', error);
      }
    };

    loadP5();
  }, [isClient, count, colors, speed, size, interactive, className]);

  if (!isClient) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  if (!P5Component) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  return <P5Component />;
};

export default ParticleField;
