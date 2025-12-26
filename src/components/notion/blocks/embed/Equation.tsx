'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import styles from './Equation.module.css';

interface EquationProps {
  id: string;
  expression?: string;
  inline?: boolean; // true for inline, false/undefined for block
}

export const Equation: React.FC<EquationProps> = ({
  id,
  expression = '',
  inline = false,
}) => {
  if (!expression) {
    return null;
  }

  const ariaLabel = inline
    ? `数学公式: ${expression}`
    : `数学公式块: ${expression}`;

  const MathComponent = inline ? InlineMath : BlockMath;

  return (
    <span
      role="math"
      className={inline ? styles.equationInline : styles.equationBlock}
      aria-label={ariaLabel}
    >
      <MathComponent math={expression} />
    </span>
  );
};
