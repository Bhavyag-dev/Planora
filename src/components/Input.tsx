import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium',
            error && 'border-red-500/50 focus-visible:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
