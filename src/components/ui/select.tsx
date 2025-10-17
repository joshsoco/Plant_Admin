import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// For compatibility with existing code
const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
const SelectTrigger = Select;
const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <>{children}</>
);
const SelectItem = ({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) => (
  <option value={value} className={className}>{children}</option>
);

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
