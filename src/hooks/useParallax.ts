'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'vertical', disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    // Check for mobile devices and reduce parallax
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;
    const isVertical = direction === 'vertical';

    // Create parallax animation
    const animation = gsap.to(element, {
      [isVertical ? 'yPercent' : 'xPercent']: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Cleanup
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed, direction, disabled]);

  return elementRef;
};

export const useRevealOnScroll = (options: { delay?: number; duration?: number } = {}) => {
  const { delay = 0, duration = 1 } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: 50,
    });

    // Create reveal animation
    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    });

    // Cleanup
    return () => {
      animation.kill();
    };
  }, [delay, duration]);

  return elementRef;
};

export const useStaggeredReveal = (childSelector = '.stagger-item') => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const children = container.querySelectorAll(childSelector);

    if (children.length === 0) return;

    // Set initial state
    gsap.set(children, {
      opacity: 0,
      y: 30,
    });

    // Create staggered reveal animation
    const animation = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
      },
    });

    // Cleanup
    return () => {
      animation.kill();
    };
  }, [childSelector]);

  return containerRef;
};