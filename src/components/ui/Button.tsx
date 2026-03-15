"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-muted shadow-soft active:scale-[0.98]",
  secondary:
    "bg-surface-elevated border border-border text-text-primary hover:bg-surface-muted",
  ghost: "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const sizes = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      loading,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.span
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className="inline-block"
      >
        <button
          ref={ref}
          type={props.type ?? "button"}
          className={`
            inline-flex items-center justify-center gap-2 font-medium
            transition-colors duration-200
            disabled:opacity-50 disabled:pointer-events-none
            ${variants[variant]} ${sizes[size]} ${className}
          `}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            icon
          )}
          {children}
        </button>
      </motion.span>
    );
  }
);

Button.displayName = "Button";
