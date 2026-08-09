import React from 'react';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'alert' | 'critical' | 'neutral';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className = '', children, ...props }, ref) => {
    return (
      <span ref={ref} className={`ui-badge ui-badge-${variant} ${className}`} {...props}>
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
