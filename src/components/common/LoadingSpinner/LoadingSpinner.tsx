// src/components/common/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'white';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  fullPage = false,
  className,
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variants = {
    default: 'text-slate-400 dark:text-slate-500',
    primary: 'text-blue-600 dark:text-blue-400',
    white: 'text-white',
  };

  const Spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullPage && 'fixed inset-0 z-[200] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm',
        className
      )}
    >
      <Loader2 className={cn('animate-spin', sizes[size], variants[variant])} />
      {text && <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );

  return Spinner;
};

export default LoadingSpinner;