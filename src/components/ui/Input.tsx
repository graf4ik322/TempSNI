import React, { InputHTMLAttributes, forwardRef } from 'react';
import { useApp } from '../../stores/AppContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
    const { state } = useApp();
    const { theme } = state;

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = `
      w-full px-3 py-2 border rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const normalStyles = `
      border-gray-300 focus:border-[${theme.colors.accent}] focus:ring-[${theme.colors.accent}]
    `;

    const errorStyles = `
      border-red-500 focus:border-red-500 focus:ring-red-500
    `;

    const combinedClassName = `
      ${baseStyles}
      ${error ? errorStyles : normalStyles}
      ${className}
    `.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.text,
            borderColor: error ? '#ef4444' : theme.colors.secondary,
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: theme.colors.text + '80' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);