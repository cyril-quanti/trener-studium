import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-contrast hover:opacity-90",
  secondary: "bg-surface-raised text-text border border-border hover:bg-border/30",
  ghost: "text-text-muted hover:bg-surface-raised hover:text-text",
  danger: "bg-danger text-white hover:opacity-90",
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
};

export function buttonClassName(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return `inline-flex min-w-11 items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${buttonVariantClasses[variant]} ${buttonSizeClasses[size]} ${className}`;
}

export function Button({ variant = "primary", size = "md", icon, className = "", children, ...props }: ButtonProps) {
  return (
    <button className={buttonClassName(variant, size, className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
