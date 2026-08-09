import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import './Button.css';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`ui-btn ui-btn-${variant} ui-btn-${size} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
