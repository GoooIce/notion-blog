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
    const isReducedMotion =
      typeof window !== 'undefined' &&
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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed, direction, disabled]);

  return elementRef;
};

export const useRevealOnScroll = (
  options: { delay?: number; duration?: number } = {}
) => {
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

// Mouse parallax effect
export const useMouseParallax = (
  options: { intensity?: number; disabled?: boolean } = {}
) => {
  const { intensity = 0.5, disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, disabled]);

  return elementRef;
};

// 3D tilt effect
export const use3DTilt = (
  options: { intensity?: number; disabled?: boolean } = {}
) => {
  const { intensity = 0.1, disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      const rotateX = deltaY * intensity * 20;
      const rotateY = deltaX * intensity * 20;

      gsap.to(element, {
        rotateX: -rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, disabled]);

  return elementRef;
};

// Magnetic effect
export const useMagneticEffect = (
  options: { intensity?: number; disabled?: boolean } = {}
) => {
  const { intensity = 0.3, disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, disabled]);

  return elementRef;
};

// Scroll rotation effect
export const useScrollRotate = (
  options: { speed?: number; disabled?: boolean } = {}
) => {
  const { speed = 0.5, disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;

    const animation = gsap.to(element, {
      rotation: 360 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [speed, disabled]);

  return elementRef;
};

// Scale on scroll effect
export const useScaleOnScroll = (
  options: { scale?: number; disabled?: boolean } = {}
) => {
  const { scale = 1.2, disabled = false } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || isReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;

    const animation = gsap.fromTo(
      element,
      {
        scale: 1,
      },
      {
        scale: scale,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, [scale, disabled]);

  return elementRef;
};
