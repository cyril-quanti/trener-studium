import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "./button-styles";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={buttonClassName(variant, size, `pointer-events-none opacity-40 ${className}`)}>
        {icon}
        {children}
      </span>
    );
  }
  return (
    <Link className={buttonClassName(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}
