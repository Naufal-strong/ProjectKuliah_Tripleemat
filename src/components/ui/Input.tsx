import React, { forwardRef, InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isRequired = false,
      id: customId,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-2"
          >
            {label}
            {isRequired && (
              <span className="ml-1 text-fail font-bold" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-3"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/*
           * border-border-control (#64748B) → kontras vs surface-0 = 4.24 ✅ WCAG 1.4.11
           * DILARANG border-border (#1E293B) pada kontrol — kontras hanya 1.38
           */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-required={isRequired}
            className={`w-full rounded-lg bg-surface-1 border px-3.5 py-2.5 text-sm text-text-1 placeholder-text-3 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              error
                ? "border-fail focus:border-fail focus:ring-fail/20"
                : "border-border-control focus:border-accent focus:ring-accent/15"
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-3"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-xs text-fail font-medium flex items-center gap-1 mt-1"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-text-3">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
