// src/components/common/Input/Input.tsx
import React, { forwardRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

export type InputVariant = 'default' | 'filled' | 'outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      className,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variants: Record<InputVariant, string> = {
      default:
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
      filled:
        'bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20',
      outline:
        'bg-transparent border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-0',
    };

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('space-y-2 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-bold text-slate-700 dark:text-slate-300',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'w-full px-4 py-3 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none disabled:opacity-60 disabled:cursor-not-allowed',
              variants[variant],
              leftIcon && 'pr-12',
              (rightIcon || isPassword) && 'pl-12',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />

          {(rightIcon || isPassword) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-rose-500 text-xs font-bold mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;