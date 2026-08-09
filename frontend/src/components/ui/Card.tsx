import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import './Card.css';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = '', children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, boxShadow: 'var(--shadow-lg)' } : {}}
        transition={{ duration: 0.15 }}
        className={`ui-card ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
